import { useState, useEffect } from "react";
import api from "../../utils/api";

const useContributionForm = (weddingId, userId, onContributionRecorded) => {
  const [guests, setGuests] = useState([]);
  const [formData, setFormData] = useState({
    guestName: "", village: "", amount: "", paymentType: "cash", givenBy: "personally",
  });
  const [suggestions, setSuggestions] = useState({ names: [], villages: [] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [alreadyContributed, setAlreadyContributed] = useState(null);

  useEffect(() => {
    api.get(`/api/guests/wedding/${weddingId}`)
      .then(({ data }) => setGuests(data.guests || []))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId]);

  const getNameSuggestions = (input) => {
    if (!input.trim()) return [];
    const q = input.toLowerCase();
    const seen = new Set();
    return guests
      .filter((g) => g.name.toLowerCase().includes(q))
      .filter((g) => { if (seen.has(g.name.toLowerCase())) return false; seen.add(g.name.toLowerCase()); return true; })
      .slice(0, 5)
      .map((g) => ({ name: g.name, attended: g.attended }));
  };

  const getVillageSuggestions = (name) => {
    if (!name.trim()) return [];
    return guests.filter((g) => g.name.toLowerCase() === name.toLowerCase())
      .map((g) => g.village).filter((v, i, a) => a.indexOf(v) === i);
  };

  const handleNameChange = (value) => {
    setFormData({ ...formData, guestName: value });
    setSuggestions({ ...suggestions, names: value.trim() ? getNameSuggestions(value) : [] });
    setAlreadyContributed(null);
  };

  const handleSelectName = (suggestion) => {
    const name = typeof suggestion === "string" ? suggestion : suggestion.name;
    setFormData({ ...formData, guestName: name });
    const villages = getVillageSuggestions(name);
    setSuggestions({ names: [], villages });
    setAlreadyContributed(null);
    if (villages.length === 1) setFormData((prev) => ({ ...prev, guestName: name, village: villages[0] }));
  };

  const handleVillageChange = (value) => {
    setFormData({ ...formData, village: value });
    setAlreadyContributed(null);
    if (value.trim()) {
      const villages = getVillageSuggestions(formData.guestName);
      setSuggestions({ ...suggestions, villages: villages.filter((v) => v.toLowerCase().includes(value.toLowerCase())) });
    }
  };

  const handleSelectVillage = (village) => {
    setFormData({ ...formData, village });
    setSuggestions({ ...suggestions, villages: [] });
    setAlreadyContributed(null);
  };

  const handlePaymentTypeChange = (paymentType) => {
    if (paymentType === "envelope") {
      setFormData({ ...formData, paymentType, amount: "0" });
    } else {
      setFormData({ ...formData, paymentType });
    }
  };

  const findMatchingGuest = () => {
    return guests.find((g) =>
      g.name.toLowerCase() === formData.guestName.toLowerCase() &&
      g.village.toLowerCase() === formData.village.toLowerCase()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (alreadyContributed) return; // Block form submission while popup is active
    setError(""); setMessage("");
    if (!formData.guestName.trim()) { setError("Guest name is required"); return; }
    if (!formData.village.trim()) { setError("Village/City is required"); return; }
    if (formData.paymentType !== "envelope" && (!formData.amount || parseFloat(formData.amount) < 0)) {
      setError("Valid amount is required"); return;
    }
    if (!userId) { setError("Please log in again"); return; }

    // Check if guest already contributed
    const matchingGuest = findMatchingGuest();
    if (matchingGuest && matchingGuest.attended) {
      setAlreadyContributed(matchingGuest);
      return;
    }

    await recordContribution();
  };

  const recordContribution = async () => {
    setLoading(true);
    setAlreadyContributed(null);
    const matchingGuest = findMatchingGuest();

    try {
      let guestId;
      if (!matchingGuest) {
        const { data } = await api.post(`/api/guests/wedding-day/${weddingId}`, {
          userId, weddingId, name: formData.guestName, village: formData.village,
        });
        if (!data.success) { setError("Error adding guest"); setLoading(false); return; }
        guestId = data.guest._id;
        setGuests([...guests, data.guest]);
      } else {
        guestId = matchingGuest._id;
      }

      const { data } = await api.post("/api/contributions/record", {
        weddingId, guestId,
        guestName: formData.guestName,
        village: formData.village,
        amount: parseFloat(formData.amount) || 0,
        paymentType: formData.paymentType,
        givenBy: formData.givenBy,
      });

      if (data.success) {
        setMessage(`✓ Recorded for ${formData.guestName}`);

        // Auto-send thank you SMS if enabled
        if (localStorage.getItem("smsThankYou") === "on" && formData.givenBy === "personally") {
          const guest = guests.find((g) =>
            g.name.toLowerCase() === formData.guestName.toLowerCase() &&
            g.village.toLowerCase() === formData.village.toLowerCase()
          );
          const mobile = guest?.mobileNumber;
          if (mobile && userId) {
            const customMsg = localStorage.getItem("smsCustomMsg") || `आपका बहुत बहुत शुक्रिया ${formData.guestName} जी, शादी में शामिल होने के लिए। 🙏`;
            const thankMsg = customMsg.replace(/\{name\}/g, formData.guestName);
            api.post("/api/sms/send", { userId, to: mobile, message: thankMsg })
              .then(() => {
                const count = parseInt(localStorage.getItem("smsCount") || "0") + 1;
                localStorage.setItem("smsCount", count.toString());
                window.dispatchEvent(new Event("smsCountUpdated"));
              })
              .catch(() => {});
          }
        }

        setFormData({ guestName: "", village: "", amount: "", paymentType: "cash", givenBy: "personally" });
        setSuggestions({ names: [], villages: [] });
        // Update local guests state to reflect the contribution
        setGuests((prev) => prev.map((g) =>
          g._id === guestId ? { ...g, attended: true, amount: parseFloat(formData.amount) || 0, paymentType: formData.paymentType, attendedBy: formData.givenBy } : g
        ));
        if (onContributionRecorded) onContributionRecorded();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error recording contribution");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAmount = () => {
    // User confirmed update — proceed with recording (will overwrite)
    recordContribution();
  };

  const handleCancelDuplicate = () => {
    setAlreadyContributed(null);
  };

  return {
    formData, setFormData, suggestions, loading, message, error,
    alreadyContributed,
    handleNameChange, handleSelectName, handleVillageChange, handleSelectVillage,
    handlePaymentTypeChange, handleSubmit, handleUpdateAmount, handleCancelDuplicate,
  };
};

export default useContributionForm;
