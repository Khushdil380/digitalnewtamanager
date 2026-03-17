import React from "react";
import "../styles/GuestCard.css";

const GuestCard = ({ guest, onEditClick, onDeleteClick }) => {
  const getTagColor = (tag) => {
    const colors = {
      friend: "#ff6b9d",
      family: "#c41e3a",
      relative: "#9b2c7a",
      neighbour: "#ffc0cb",
      other: "#808080",
    };
    return colors[tag] || "#808080";
  };

  const getAddedOnLabel = (addedOn) => {
    if (addedOn === "onWeddingDay") return "👰 Wedding";
    return "👤 Earlier";
  };

  const getPaymentEmoji = (type) => {
    if (type === "online") return "🔗";
    if (type === "cash") return "💵";
    return "❓";
  };

  const getAttendanceEmoji = (status) => {
    return status === "attended" ? "✅" : "❌";
  };

  const formattedDate = guest.createdAt
    ? new Date(guest.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="guest-card-row">
      <div className="guest-name">👤 {guest.name}</div>
      <div className="guest-village">📍 {guest.village}</div>
      <div className="guest-mobile">📱 {guest.mobileNumber || "---"}</div>
      <div
        className="guest-tag"
        style={{ borderLeftColor: getTagColor(guest.tag) }}
      >
        <span
          className="tag-badge"
          style={{ backgroundColor: getTagColor(guest.tag) }}
        >
          {guest.tag.charAt(0).toUpperCase() + guest.tag.slice(1)}
        </span>
      </div>
      <div className="guest-priority">
        ⭐ {["High", "Mid", "Low"][guest.priority - 1]}
      </div>
      <div className="guest-attended" title={guest.attendedStatus}>
        {getAttendanceEmoji(guest.attendedStatus)}
      </div>
      <div className="guest-amount">
        💵 ₹{(guest.contributionAmount || 0).toLocaleString()}
      </div>
      <div className="guest-payment" title={guest.contributionType}>
        {getPaymentEmoji(guest.contributionType)}
      </div>
      <div className="guest-added">
        {getAddedOnLabel(guest.addedOn)}{" "}
        {formattedDate && <span className="date-badge">{formattedDate}</span>}
      </div>
      <div className="guest-actions">
        <button
          className="edit-guest-btn"
          onClick={() => onEditClick(guest)}
          title="Edit guest"
        >
          ✏️
        </button>
        <button
          className="delete-guest-btn"
          onClick={() => onDeleteClick(guest._id)}
          title="Delete guest"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default GuestCard;
