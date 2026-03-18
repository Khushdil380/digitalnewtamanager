import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import InputField from "./InputField";
import Button from "./Button";
import "../styles/WeddingModal.css";

const API_BASE_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export default function WeddingModal({
  isOpen,
  onClose,
  onWeddingCreated,
  editingWedding,
}) {
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
    setBrideName("");
    setGroomName("");
    setDate("");
    setVenue("");
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!brideName.trim() || !groomName.trim() || !date || !venue.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      if (editingWedding) {
        const res = await axios.put(
          `${API_BASE_URL}/api/weddings/${editingWedding.id}`,
          {
            brideName,
            groomName,
            date,
            venue,
          },
        );
        setMessage(res.data.message);
        onWeddingCreated(res.data.wedding);
      } else {
        const res = await axios.post(`${API_BASE_URL}/api/weddings/create`, {
          userId: user?.id,
          brideName,
          groomName,
          date,
          venue,
        });
        setMessage(res.data.message);
        onWeddingCreated(res.data.wedding);
      }
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);
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
              <InputField
                label="Bride Name"
                type="text"
                placeholder="Bride name"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                required
              />
            </div>

            <div className="wedding-input-wrapper">
              <span className="wedding-icon">🤵</span>
              <InputField
                label="Groom Name"
                type="text"
                placeholder="Groom name"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                required
              />
            </div>
          </div>

          <InputField
            label="Wedding Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <InputField
            label="Venue/Location"
            type="text"
            placeholder="City or venue location"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            required
          />

          {error && <div className="wedding-error-msg">{error}</div>}
          {message && <div className="wedding-success-msg">{message}</div>}

          <div className="wedding-button-group">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading
                ? "Saving..."
                : editingWedding
                  ? "Update Wedding"
                  : "Create Wedding"}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
