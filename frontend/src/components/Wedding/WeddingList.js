import React from "react";
import WeddingCard from "./WeddingCard";
import "../../styles/wedding/WeddingList.css";

export default function WeddingList({
  weddings,
  refreshKey,
  onEditClick,
  onGuestClick,
  onDeleteClick,
  onGoToWeddingEvent,
}) {
  if (weddings.length === 0) {
    return (
      <div className="wedding-list-empty">
        <div className="empty-icon">💍</div>
        <h3>No Weddings Yet</h3>
        <p>Click "Add New Wedding" to create your first wedding</p>
      </div>
    );
  }

  return (
    <div className="wedding-list">
      {weddings.map((wedding) => (
        <WeddingCard
          key={wedding.id}
          wedding={wedding}
          refreshKey={refreshKey}
          onEditClick={onEditClick}
          onGuestClick={onGuestClick}
          onDeleteClick={onDeleteClick}
          onGoToWeddingEvent={onGoToWeddingEvent}
        />
      ))}
    </div>
  );
}
