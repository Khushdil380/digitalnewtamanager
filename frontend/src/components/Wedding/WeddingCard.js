import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { formatDate } from "../../utils/formatDate";
import Button from "../common/Button";
import "../../styles/wedding/WeddingCard.css";

const CARD_IMAGES = [
  `${process.env.PUBLIC_URL}/images/1.svg`,
  `${process.env.PUBLIC_URL}/images/2.svg`,
  `${process.env.PUBLIC_URL}/images/3.svg`,
  `${process.env.PUBLIC_URL}/images/4.svg`,
  `${process.env.PUBLIC_URL}/images/5.svg`,
  `${process.env.PUBLIC_URL}/images/6.svg`,
];
const CELEBRATION_EMOJIS = ["💍", "💐", "❤️", "🌹", "💒", "🎊"];

export default function WeddingCard({ wedding, onEditClick, onGuestClick, onDeleteClick, onGoToWeddingEvent }) {
  const [guestStats, setGuestStats] = useState({ invited: 0, attended: 0 });
  const [bgIndex, setBgIndex] = useState(() => Math.floor(Math.random() * CARD_IMAGES.length));

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % CARD_IMAGES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const weddingId = wedding._id || wedding.id;
    api.get(`/api/guests/wedding/${weddingId}`)
      .then(({ data }) => {
        const guests = (data.guests || []).filter((g) => !g.isDeleted);
        setGuestStats({ invited: guests.length, attended: guests.filter((g) => g.attended).length });
      })
      .catch(() => setGuestStats({ invited: 0, attended: 0 }));
  }, [wedding._id, wedding.id]);

  return (
    <div className="wedding-card">
      <img src={CARD_IMAGES[bgIndex]} alt="" className="wc-bg-img" loading="lazy" />

      <div className="wc-header-strip">
        <span className="wc-stat">👥 {guestStats.invited}/{guestStats.attended}</span>
        <button className="wc-edit-btn" onClick={() => onEditClick(wedding)} title="Edit">✏️</button>
      </div>

      <div className="wc-body">
        <div className="wc-couple">
          <div className="wc-person">👰 {wedding.brideName}</div>
          <div className="wc-amp">&</div>
          <div className="wc-person">🤵 {wedding.groomName}</div>
        </div>

        <div className="wc-celebration">
          {CELEBRATION_EMOJIS.map((emoji, i) => (
            <span key={i} className="wc-float-emoji" style={{ animationDelay: `${i * 0.5}s`, left: `${15 + i * 13}%` }}>{emoji}</span>
          ))}
        </div>

        <div className="wc-info">
          <span className="wc-venue">📍 {wedding.venue}</span>
          <span className="wc-date">📅 {formatDate(wedding.date)}</span>
        </div>
      </div>

      <div className="wc-actions">
        <Button variant="primary" size="small" onClick={() => onGoToWeddingEvent(wedding._id || wedding.id)}>Go To</Button>
        <Button variant="secondary" size="small" onClick={() => onGuestClick(wedding)}>Guests</Button>
      </div>
    </div>
  );
}
