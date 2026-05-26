import React, { useState } from "react";
import api from "../../../utils/api";
import InputField from "../../common/InputField";
import Button from "../../common/Button";
import "../../../styles/profile/ProfileTab.css";

export default function MobileTab({ user, onUpdate }) {
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    if (!phoneNumber.trim()) { setError("Phone number is required"); return; }

    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/update-profile", { userId: user?.id, phoneNumber });
      setMessage(data.message);
      onUpdate(data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-tab">
      <div className="info-box"><label>Current Mobile</label><p>{user?.phoneNumber}</p></div>
      <InputField label="New Mobile Number" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter 10-digit mobile" required />
      {error && <div className="error-msg">{error}</div>}
      {message && <div className="success-msg">{message}</div>}
      <Button type="submit" variant="primary" disabled={loading}>{loading ? "Updating..." : "Update Mobile"}</Button>
    </form>
  );
}
