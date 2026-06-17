import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import Modal from "../common/Modal";
import InputField from "../common/InputField";
import Button from "../common/Button";
import "../../styles/wedding/WeddingModal.css";

export default function WeddingModal({ isOpen, onClose, onWeddingCreated, editingWedding }) {
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (editingWedding) {
      setBrideName(editingWedding.brideName || "");
      setGroomName(editingWedding.groomName || "");
      setDate(editingWedding.date ? editingWedding.date.split("T")[0] : "");
      setVenue(editingWedding.venue || "");
    } else {
      resetForm();
    }
  }, [editingWedding, isOpen]);

  const resetForm = () => {
    setBrideName(""); setGroomName(""); setDate(""); setVenue("");
    setMessage(""); setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");

    if (!brideName.trim() || !groomName.trim() || !date || !venue.trim()) {
      setError("All fields are required");
      return;
    }

    // Prevent past dates
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date); selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError("Wedding date cannot be in the past");
      return;
    }

    setLoading(true);
    try {
      const payload = { brideName, groomName, date, venue };
      let res;
      if (editingWedding) {
        res = await api.put(`/api/weddings/${editingWedding.id}`, payload);
      } else {
        res = await api.post("/api/weddings/create", { ...payload, userId: user?.id });
      }
      setMessage(res.data.message);
      onWeddingCreated(res.data.wedding);
      setTimeout(() => { resetForm(); onClose(); }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save wedding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="medium">
      <div className="wedding-modal">
        <h2>{editingWedding ? "Edit Wedding" : "Create New Wedding"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="wedding-input-row">
            <div className="wedding-input-wrapper">
              <span className="wedding-icon">👰</span>
              <InputField label="Bride Name" placeholder="Bride name" value={brideName} onChange={(e) => setBrideName(e.target.value)} required />
            </div>
            <div className="wedding-input-wrapper">
              <span className="wedding-icon">🤵</span>
              <InputField label="Groom Name" placeholder="Groom name" value={groomName} onChange={(e) => setGroomName(e.target.value)} required />
            </div>
          </div>

          <InputField label="Wedding Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} required />
          <InputField label="Venue/Location" placeholder="City or venue" value={venue} onChange={(e) => setVenue(e.target.value)} required />

          {error && <div className="auth-error-message">{error}</div>}
          {message && <div className="auth-success-message">{message}</div>}

          <div className="wedding-button-group">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Saving..." : editingWedding ? "Update Wedding" : "Create Wedding"}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
