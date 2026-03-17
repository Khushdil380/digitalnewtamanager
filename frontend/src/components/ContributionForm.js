import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ContributionForm.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ContributionForm = ({ weddingId, userId, onContributionRecorded }) => {
  const [guests, setGuests] = useState([]);
  const [formData, setFormData] = useState({
    guestName: "",
    village: "",
    amount: "",
    type: "cash",
    givenPersonally: true,
    givenBy: "",
  });

  const [suggestions, setSuggestions] = useState({
    names: [],
    villages: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId]);

  const fetchGuests = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/guests/wedding/${weddingId}`,
      );
      setGuests(response.data.guests || []);
    } catch (err) {
      console.error("Failed to fetch guests:", err);
    }
  };

  const getNameSuggestions = (input) => {
    if (!input.trim()) return [];
    const query = input.toLowerCase();
    return guests
      .filter((g) => g.name.toLowerCase().includes(query))
      .map((g) => g.name)
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 5);
  };

  const getVillageSuggestions = (guestName) => {
    if (!guestName.trim()) return [];
    const matchingGuests = guests.filter(
      (g) => g.name.toLowerCase() === guestName.toLowerCase(),
    );
    return matchingGuests
      .map((g) => g.village)
      .filter((v, i, a) => a.indexOf(v) === i);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, guestName: value });

    if (value.trim()) {
      setSuggestions({
        ...suggestions,
        names: getNameSuggestions(value),
      });
    } else {
      setSuggestions({ ...suggestions, names: [] });
    }
  };

  const handleSelectName = (name) => {
    setFormData({ ...formData, guestName: name });
    const villages = getVillageSuggestions(name);
    setSuggestions({
      names: [],
      villages,
    });

    // Auto-fill village if only one match
    if (villages.length === 1) {
      setFormData((prev) => ({ ...prev, village: villages[0] }));
    }
  };

  const handleVillageChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, village: value });

    if (value.trim()) {
      const villages = getVillageSuggestions(formData.guestName);
      setSuggestions({
        ...suggestions,
        villages: villages.filter((v) =>
          v.toLowerCase().includes(value.toLowerCase()),
        ),
      });
    }
  };

  const handleSelectVillage = (village) => {
    setFormData({ ...formData, village });
    setSuggestions({ ...suggestions, villages: [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validation
    if (!formData.guestName.trim()) {
      setError("Guest name is required");
      return;
    }
    if (!formData.village.trim()) {
      setError("Village/City is required");
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) < 0) {
      setError("Valid amount is required");
      return;
    }

    if (!userId) {
      setError("User session not found. Please log in again.");
      setLoading(false);
      return;
    }

    setLoading(true);

    // Find guest ID
    const matchingGuest = guests.find(
      (g) =>
        g.name.toLowerCase() === formData.guestName.toLowerCase() &&
        g.village.toLowerCase() === formData.village.toLowerCase(),
    );

    try {
      let guestId;

      // If guest not found, create new guest as "addedOnWeddingDay"
      if (!matchingGuest) {
        const guestResponse = await axios.post(
          `${API_BASE_URL}/api/guests/wedding-day/${weddingId}`,
          {
            userId,
            weddingId,
            name: formData.guestName,
            village: formData.village,
          },
        );

        if (!guestResponse.data.success) {
          setError("Error adding guest to list");
          setLoading(false);
          return;
        }

        guestId = guestResponse.data.guest._id;
        // Add new guest to local state
        setGuests([...guests, guestResponse.data.guest]);
      } else {
        guestId = matchingGuest._id;
      }

      // Record contribution
      const response = await axios.post(
        `${API_BASE_URL}/api/contributions/record`,
        {
          weddingId,
          guestId,
          guestName: formData.guestName,
          village: formData.village,
          amount: parseFloat(formData.amount),
          type: formData.type,
          givenPersonally: formData.givenPersonally,
          givenBy: formData.givenBy || null,
        },
      );

      if (response.data.success) {
        setMessage(`✓ Contribution recorded for ${formData.guestName}`);
        setFormData({
          guestName: "",
          village: "",
          amount: "",
          type: "cash",
          givenPersonally: true,
          givenBy: "",
        });
        setSuggestions({ names: [], villages: [] });

        if (onContributionRecorded) {
          onContributionRecorded();
        }

        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error recording contribution");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contribution-form-container">
      <form onSubmit={handleSubmit} className="contribution-form">
        {/* Guest Name Input with Autocomplete */}
        <div className="form-group">
          <label htmlFor="guestName">Name *</label>
          <div className="input-with-suggestions">
            <input
              id="guestName"
              type="text"
              placeholder="Enter guest name"
              value={formData.guestName}
              onChange={handleNameChange}
              className="form-input"
            />
            {suggestions.names.length > 0 && (
              <div className="suggestions-list">
                {suggestions.names.map((name, idx) => (
                  <div
                    key={idx}
                    className="suggestion-item"
                    onClick={() => handleSelectName(name)}
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Village Input with Autocomplete */}
        <div className="form-group">
          <label htmlFor="village">Village/City *</label>
          <div className="input-with-suggestions">
            <input
              id="village"
              type="text"
              placeholder="Enter village/city"
              value={formData.village}
              onChange={handleVillageChange}
              className="form-input"
            />
            {suggestions.villages.length > 0 && (
              <div className="suggestions-list">
                {suggestions.villages.map((village, idx) => (
                  <div
                    key={idx}
                    className="suggestion-item"
                    onClick={() => handleSelectVillage(village)}
                  >
                    {village}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Amount Input */}
        <div className="form-group">
          <label htmlFor="amount">Amount *</label>
          <input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="form-input"
            min="0"
          />
        </div>

        {/* Payment Type - Radio Buttons */}
        <div className="form-group">
          <label>Payment Type *</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                checked={formData.type === "cash"}
                onChange={() => setFormData({ ...formData, type: "cash" })}
              />
              💵 Cash
            </label>
            <label className="radio-label">
              <input
                type="radio"
                checked={formData.type === "upi"}
                onChange={() => setFormData({ ...formData, type: "upi" })}
              />
              🔗 UPI
            </label>
          </div>
        </div>

        {/* Given By - Radio Buttons Only */}
        <div className="form-group">
          <label>Given By:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                checked={formData.givenPersonally}
                onChange={() =>
                  setFormData({
                    ...formData,
                    givenPersonally: true,
                    givenBy: "",
                  })
                }
              />
              Personally
            </label>
            <label className="radio-label">
              <input
                type="radio"
                checked={!formData.givenPersonally}
                onChange={() =>
                  setFormData({ ...formData, givenPersonally: false })
                }
              />
              By Someone
            </label>
          </div>
        </div>

        {/* Messages */}
        {error && <div className="error-message">❌ {error}</div>}
        {message && <div className="success-message">✓ {message}</div>}

        {/* Submit Button */}
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Recording..." : "✓ Record Contribution"}
        </button>
      </form>
    </div>
  );
};

export default ContributionForm;
