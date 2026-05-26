import React, { useState } from "react";
import api from "../../../utils/api";
import InputField from "../../common/InputField";
import Button from "../../common/Button";
import AvatarSelector from "../AvatarSelector";
import "../../../styles/profile/ProfileTab.css";

export default function PersonalTab({ user, onUpdate }) {
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    if (!fullName.trim()) { setError("Name is required"); return; }

    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/update-profile", { userId: user?.id, fullName, avatar });
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
      <div className="profile-avatar-display">
        <div className="profile-avatar-circle">
          {avatar ? <span className="avatar-emoji">{avatar}</span> : "👤"}
        </div>
      </div>

      <InputField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      <AvatarSelector selected={avatar} onSelect={setAvatar} />

      {error && <div className="error-msg">{error}</div>}
      {message && <div className="success-msg">{message}</div>}

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
