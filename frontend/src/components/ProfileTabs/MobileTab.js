import React, { useState } from "react";
import axios from "axios";
import InputField from "../InputField";
import Button from "../Button";
import "../../styles/ProfileTab.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function MobileTab({ user, onUpdate }) {
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/update-profile`, {
        userId: user?.id,
        phoneNumber,
      });
      setMessage(res.data.message);
      onUpdate(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-tab">
      <div className="info-box">
        <label>Current Mobile Number</label>
        <p>{user?.phoneNumber}</p>
      </div>

      <InputField
        label="New Mobile Number"
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Enter 10-digit mobile number"
        required
      />

      {error && <div className="error-msg">{error}</div>}
      {message && <div className="success-msg">{message}</div>}

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? "Updating..." : "Update Mobile"}
      </Button>
    </form>
  );
}
