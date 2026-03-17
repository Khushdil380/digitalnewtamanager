import React from "react";
import { AVATARS } from "../constants/avatars";
import "../styles/AvatarSelector.css";

export default function AvatarSelector({ selected, onSelect }) {
  return (
    <div className="avatar-selector">
      <label>Choose Avatar</label>
      <div className="avatar-grid">
        {AVATARS.map((avatar) => (
          <button
            key={avatar}
            type="button"
            className={`avatar-btn ${selected === avatar ? "selected" : ""}`}
            onClick={() => onSelect(avatar)}
          >
            <span className="avatar-emoji">{avatar}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
