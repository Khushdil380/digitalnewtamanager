import React, { useState } from "react";
import api from "../../../utils/api";
import InputField from "../../common/InputField";
import Button from "../../common/Button";
import "../../../styles/profile/ProfileTab.css";

export default function EmailTab({ user, onUpdate }) {
  const [step, setStep] = useState("view");
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRequestUpdate = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    if (!newEmail.trim()) { setError("Email is required"); return; }

    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/update-email", { userId: user?.id, email: newEmail });
      setMessage(data.message);
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUpdate = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    if (!otp) { setError("OTP is required"); return; }

    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/verify-email-update", { userId: user?.id, email: newEmail, otp });
      setMessage(data.message);
      onUpdate(data.user);
      setTimeout(() => setStep("view"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={step === "verify" ? handleVerifyUpdate : handleRequestUpdate} className="profile-tab">
      {step === "view" ? (
        <>
          <div className="info-box"><label>Current Email</label><p>{user?.email}</p></div>
          <Button type="button" variant="secondary" onClick={() => setStep("update")}>Update Email</Button>
        </>
      ) : step === "update" ? (
        <>
          <InputField label="New Email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
          {error && <div className="error-msg">{error}</div>}
          {message && <div className="success-msg">{message}</div>}
          <div className="button-group">
            <Button type="submit" variant="primary" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</Button>
            <Button type="button" variant="secondary" onClick={() => setStep("view")}>Cancel</Button>
          </div>
        </>
      ) : (
        <>
          <InputField label="OTP" type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          {error && <div className="error-msg">{error}</div>}
          {message && <div className="success-msg">{message}</div>}
          <Button type="submit" variant="primary" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</Button>
        </>
      )}
    </form>
  );
}
