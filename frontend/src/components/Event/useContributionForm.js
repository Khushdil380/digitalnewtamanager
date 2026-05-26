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

  useEffect(() => {
    api.get(`/api/guests/wedding/${weddingId}`)
      .then(({ data }) => setGuests(data.guests || []))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId]);

  const getNameSuggestions = (input) => {
    if (!input.trim()) return [];
    const q = input.toLowerCase();
    return guests.filter((g) => g.name.toLowerCase().includes(q))
      .map((g) => g.name).filter((v, i, a) => a.indexOf(v) === i).slice(0, 5);
  };

  const getVillageSuggestions = (name) => {
    if (!name.trim()) return [];
    return guests.filter((g) => g.name.toLowerCase() === name.toLowerCase())
      .map((g) => g.village).filter((v, i, a) => a.indexOf(v) === i);
  };

  const handleNameChange = (value) => {
    setFormData({ ...formData, guestName: value });
    setSuggestions({ ...suggestions, names: value.trim() ? getNameSuggestions(value) : [] });
  };

  const handleSelectName = (name) => {
    setFormData({ ...formData, guestName: name });
    const villages = getVillageSuggestions(name);
    setSuggestions({ names: [], villages });
    if (villages.length === 1) setFormData((prev) => ({ ...prev, guestName: name, village: villages[0] }));
  };

  const handleVillageChange = (value) => {
    setFormData({ ...formData, village: value });
    if (value.trim()) {
      const villages = getVillageSuggestions(formData.guestName);
      setSuggestions({ ...suggestions, villages: villages.filter((v) => v.toLowerCase().includes(value.toLowerCase())) });
    }
  };

  const handleSelectVillage = (village) => {
    setFormData({ ...formData, village });
    setSuggestions({ ...suggestions, villages: [] });
  };

  const handlePaymentTypeChange = (paymentType) => {
    // If envelope, auto-set amount to 0 (user can still edit)
    if (paymentType === "envelope") {
      setFormData({ ...formData, paymentType, amount: "0" });
    } else {
      setFormData({ ...formData, paymentType });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    if (!formData.guestName.trim()) { setError("Guest name is required"); return; }
    if (!formData.village.trim()) { setError("Village/City is required"); return; }
    if (formData.paymentType !== "envelope" && (!formData.amount || parseFloat(formData.amount) < 0)) {
      setError("Valid amount is required"); return;
    }
    if (!userId) { setError("Please log in again"); return; }

    setLoading(true);
    const matchingGuest = guests.find((g) =>
      g.name.toLowerCase() === formData.guestName.toLowerCase() &&
      g.village.toLowerCase() === formData.village.toLowerCase()
    );

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
        setFormData({ guestName: "", village: "", amount: "", paymentType: "cash", givenBy: "personally" });
        setSuggestions({ names: [], villages: [] });
        if (onContributionRecorded) onContributionRecorded();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error recording contribution");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData, setFormData, suggestions, loading, message, error,
    handleNameChange, handleSelectName, handleVillageChange, handleSelectVillage,
    handlePaymentTypeChange, handleSubmit,
  };
};

export default useContributionForm;
