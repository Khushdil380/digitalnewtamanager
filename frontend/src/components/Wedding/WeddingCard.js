import React, { useState, useEffect, useMemo } from "react";
import api from "../../utils/api";
import { formatDate } from "../../utils/formatDate";
import Button from "../common/Button";
import "../../styles/wedding/WeddingCard.css";

const CARD_IMAGES = [
  "/images/1.svg",
  "/images/2.svg",
  "/images/3.svg",
  "/images/4.svg",
  "/images/5.svg",
  "/images/6.svg",
];

export default function WeddingCard({ wedding, onEditClick, onGuestClick, onDeleteClick, onGoToWeddingEvent }) {
  const [guestStats, setGuestStats] = useState({ invited: 0, attended: 0 });

  const cardImage = useMemo(() => {
    const id = wedding._id || wedding.id || "";
    const index = id.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % CARD_IMAGES.length;
    return CARD_IMAGES[index];
  }, [wedding._id, wedding.id]);

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
      <div className="wc-header-strip">
        <span className="wc-stat" title="Invited/Attended">👥 {guestStats.invited}/{guestStats.attended}</span>
        <button className="wc-edit-btn" onClick={() => onEditClick(wedding)} title="Edit">✏️</button>
      </div>

      <div className="wc-body">
        <div className="wc-couple">
          <div className="wc-person">👰 {wedding.brideName}</div>
          <div className="wc-person">🤵 {wedding.groomName}</div>
        </div>

        <div className="wc-image-area">
          <img
            src={cardImage}
            alt="Wedding celebration"
            className="wc-celebration-img"
            loading="lazy"
          />
        </div>

        <div className="wc-info">
          <span className="wc-venue">📍 {wedding.venue}</span>
          <span className="wc-date">📅 {formatDate(wedding.date)}</span>
        </div>
      </div>

      <div className="wc-actions">
        <Button variant="primary" size="small" onClick={() => onGoToWeddingEvent(wedding._id || wedding.id)}>
          Go To
        </Button>
        <Button variant="secondary" size="small" onClick={() => onGuestClick(wedding)}>
          Guests
        </Button>
      </div>
    </div>
  );
}
