import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/GuestModal.css";

const API_BASE_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const GuestModal = ({ weddingId, editingGuest, onClose, onGuestAdded }) => {
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [tag, setTag] = useState("other");
  const [priority, setPriority] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (editingGuest) {
      setName(editingGuest.name);
      setVillage(editingGuest.village);
      setMobileNumber(editingGuest.mobileNumber || "");
      setTag(editingGuest.tag || "other");
      setPriority(editingGuest.priority || 3);
    }
  }, [editingGuest]);

  const validateMobile = (mobile) => {
    if (!mobile) return true;
    return /^\d{10}$/.test(mobile.replace(/\D/g, ""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !village.trim()) {
      setError("Name and village are required");
      return;
    }

    if (mobileNumber && !validateMobile(mobileNumber)) {
      setError("Mobile number must be 10 digits");
      return;
    }

    setLoading(true);

    try {
      if (editingGuest) {
        const response = await axios.put(
          `${API_BASE_URL}/api/guests/${editingGuest._id}`,
          {
            name: name.trim(),
            village: village.trim(),
            mobileNumber: mobileNumber || null,
            tag,
            priority: parseInt(priority),
          },
        );

        setSuccess("Guest updated successfully!");
      } else {
        const response = await axios.post(`${API_BASE_URL}/api/guests/create`, {
          userId: user.id,
          weddingId,
          name: name.trim(),
          village: village.trim(),
          mobileNumber: mobileNumber || null,
          tag,
          priority: parseInt(priority),
        });

        setSuccess("Guest added successfully!");
      }

      setTimeout(() => {
        resetForm();
        onGuestAdded();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Error saving guest");
      console.error("Save guest error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setVillage("");
    setMobileNumber("");
    setTag("other");
    setPriority(3);
  };

  return (
    <div className="guest-modal-overlay">
      <div className="guest-modal">
        <div className="guest-modal-header">
          <h2>{editingGuest ? "Edit Guest" : "Add New Guest"}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="guest-form">
          {/* First Row - Input Fields */}
          <div className="guest-form-row">
            <div className="guest-input-group">
              <label>👤 Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Guest name"
                required
              />
            </div>

            <div className="guest-input-group">
              <label>📍 Village/City *</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="Village or city"
                required
              />
            </div>

            <div className="guest-input-group">
              <label>📱 Mobile</label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="10 digit number"
                maxLength="10"
              />
            </div>

            <div className="guest-input-group">
              <label>🏷️ Tag</label>
              <select value={tag} onChange={(e) => setTag(e.target.value)}>
                <option value="friend">Friend</option>
                <option value="family">Family</option>
                <option value="relative">Relative</option>
                <option value="neighbour">Neighbour</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="guest-input-group">
              <label>⭐ Priority</label>
              <div className="priority-radio">
                <label>
                  <input
                    type="radio"
                    value="1"
                    checked={priority === "1" || priority === 1}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                  High
                </label>
                <label>
                  <input
                    type="radio"
                    value="2"
                    checked={priority === "2" || priority === 2}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                  Mid
                </label>
                <label>
                  <input
                    type="radio"
                    value="3"
                    checked={priority === "3" || priority === 3}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                  Low
                </label>
              </div>
            </div>

            <button type="submit" className="add-guest-btn" disabled={loading}>
              {loading
                ? "Saving..."
                : editingGuest
                  ? "Update Guest"
                  : "Add Guest"}
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default GuestModal;
