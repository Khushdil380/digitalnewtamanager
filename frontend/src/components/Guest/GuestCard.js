import React from "react";
import "../../styles/guest/GuestCard.css";

const TAG_COLORS = {
  friend: "#ff6b9d", family: "#c41e3a", relative: "#9b2c7a", neighbour: "#ffc0cb", other: "#808080",
};

const GuestCard = ({ guest, onEditClick, onDeleteClick }) => {
  const tagColor = TAG_COLORS[guest.tag] || TAG_COLORS.other;

  return (
    <div className="guest-card-row">
      <div className="guest-name">👤 {guest.name}</div>
      <div className="guest-village">📍 {guest.village}</div>
      <div className="guest-mobile">📱 {guest.mobileNumber || "---"}</div>
      <div className="guest-tag" style={{ borderLeftColor: tagColor }}>
        <span className="tag-badge" style={{ backgroundColor: tagColor }}>
          {guest.tag.charAt(0).toUpperCase() + guest.tag.slice(1)}
        </span>
      </div>
      <div className="guest-priority">⭐ {["High", "Mid", "Low"][guest.priority - 1]}</div>
      <div className="guest-attended">{guest.attended ? "✅" : "❌"}</div>
      <div className="guest-amount">₹{(guest.amount || 0).toLocaleString()}</div>
      <div className="guest-payment">
        {guest.paymentType === "cash" && "💵"}
        {guest.paymentType === "upi" && "🔗"}
        {guest.paymentType === "envelope" && "✉️"}
        {!guest.paymentType && "—"}
      </div>
      <div className="guest-given-by">
        {guest.attendedBy === "personally" && "🧑"}
        {guest.attendedBy === "someone" && "👥"}
        {!guest.attendedBy && "—"}
      </div>
      <div className="guest-added">
        {guest.addedOn === "wedding" ? "👰" : "📋"}
        <span className="date-badge">
          {guest.createdAt ? new Date(guest.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : ""}
        </span>
      </div>
      <div className="guest-actions">
        <button className="edit-guest-btn" onClick={() => onEditClick(guest)} title="Edit">✏️</button>
        <button className="delete-guest-btn" onClick={() => onDeleteClick(guest._id)} title="Delete">🗑️</button>
      </div>
    </div>
  );
};

export default GuestCard;
