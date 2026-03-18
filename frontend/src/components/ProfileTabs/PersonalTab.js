import React, { useState } from "react";
import axios from "axios";
import InputField from "../InputField";
import Button from "../Button";
import AvatarSelector from "../AvatarSelector";
import "../../styles/ProfileTab.css";

const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

export default function PersonalTab({ user, onUpdate }) {
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!fullName.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/update-profile`, {
        userId: user?.id,
        fullName,
        avatar,
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
      <div className="profile-avatar-display">
        <div
          className="profile-avatar-circle"
          style={{
            borderColor: `var(--primary)`,
          }}
        >
          {avatar ? <span className="avatar-emoji">{avatar}</span> : "👤"}
        </div>
      </div>

      <InputField
        label="Full Name"
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />

      <AvatarSelector selected={avatar} onSelect={setAvatar} />

      {error && <div className="error-msg">{error}</div>}
      {message && <div className="success-msg">{message}</div>}

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
