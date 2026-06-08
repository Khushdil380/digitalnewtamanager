import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { formatDate } from "../../utils/formatDate";
import Button from "../common/Button";
import "../../styles/wedding/WeddingCard.css";

export default function WeddingCard({ wedding, onEditClick, onGuestClick, onDeleteClick, onGoToWeddingEvent }) {
  const [guestStats, setGuestStats] = useState({ invited: 0, attended: 0 });

  useEffect(() => {
    const weddingId = wedding._id || wedding.id;
    api.get(`/api/guests/wedding/${weddingId}`)
      .then(({ data }) => {
        const guests = (data.guests || []).filter((g) => !g.isDeleted);
        setGuestStats({
          invited: guests.length,
          attended: guests.filter((g) => g.attended).length,
        });
      })
      .catch(() => setGuestStats({ invited: 0, attended: 0 }));
  }, [wedding._id, wedding.id]);

  return (
    <div className="wedding-card">
      <div className="wedding-card-row">
        <div className="wedding-couple">
          <span className="couple-icon">👰</span>
          <span className="couple-name">{wedding.brideName}</span>
          <span className="connector">+</span>
          <span className="couple-name">{wedding.groomName}</span>
          <span className="couple-icon">🤵</span>
        </div>

        <div className="detail-item">
          <span className="detail-icon">📍</span>
          <span className="detail-text">{wedding.venue}</span>
        </div>

        <div className="detail-item">
          <span className="detail-icon">📅</span>
          <span className="detail-text">{formatDate(wedding.date)}</span>
        </div>

        <div className="detail-item">
          <span className="detail-icon">👥</span>
          <span className="detail-text">{guestStats.invited}/{guestStats.attended}</span>
        </div>

        <div className="wedding-card-buttons">
          <Button variant="primary" size="small" onClick={() => onGoToWeddingEvent(wedding._id || wedding.id)}>
            Go To
          </Button>
          <Button variant="secondary" size="small" onClick={() => onGuestClick(wedding)}>
            👥 Guests
          </Button>
        </div>

        <button className="wedding-edit-btn" onClick={() => onEditClick(wedding)} title="Edit wedding">
          ✏️
        </button>
      </div>
    </div>
  );
}
