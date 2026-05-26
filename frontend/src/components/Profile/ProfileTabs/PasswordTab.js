import React, { useState } from "react";
import api from "../../../utils/api";
import InputField from "../../common/InputField";
import Button from "../../common/Button";
import "../../../styles/profile/ProfileTab.css";

export default function PasswordTab({ user }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }

    setLoading(true);
    try {
      await api.post("/api/auth/update-password", { userId: user?.id, currentPassword, newPassword });
      setMessage("Password updated successfully");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-tab">
      <InputField label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
      <InputField label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
      <InputField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      {error && <div className="error-msg">{error}</div>}
      {message && <div className="success-msg">{message}</div>}
      <Button type="submit" variant="primary" disabled={loading}>{loading ? "Updating..." : "Update Password"}</Button>
    </form>
  );
}
