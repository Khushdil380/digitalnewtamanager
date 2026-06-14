import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { formatDate } from "../../utils/formatDate";
import Button from "../common/Button";
import CardDistributionModal from "../Guest/CardDistributionModal";
import img1 from "../../assets/weddingcard/1.png";
import img2 from "../../assets/weddingcard/2.png";
import img3 from "../../assets/weddingcard/3.png";
import img4 from "../../assets/weddingcard/4.png";
import img5 from "../../assets/weddingcard/5.png";
import img6 from "../../assets/weddingcard/6.png";
import "../../styles/wedding/WeddingCard.css";

const CARD_IMAGES = [img1, img2, img3, img4, img5, img6];
const CELEBRATION_EMOJIS = ["💍", "💐", "❤️", "🌹", "💒", "🎊"];

export default function WeddingCard({ wedding, onEditClick, onGuestClick, onDeleteClick, onGoToWeddingEvent }) {
  const [guestStats, setGuestStats] = useState({ invited: 0, attended: 0 });
  const [guests, setGuests] = useState([]);
  const [showCardDist, setShowCardDist] = useState(false);
  const [bgIndex, setBgIndex] = useState(() => Math.floor(Math.random() * CARD_IMAGES.length));

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % CARD_IMAGES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = () => {
    const weddingId = wedding._id || wedding.id;
    api.get(`/api/guests/wedding/${weddingId}`)
      .then(({ data }) => {
        const allGuests = data.guests || [];
        const active = allGuests.filter((g) => g.isDeleted !== true);
        setGuests(allGuests);
        setGuestStats({ invited: active.length, attended: active.filter((g) => g.attended).length });
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wedding._id, wedding.id]);

  // Listen for guest changes from anywhere in the app
  useEffect(() => {
    const handleGuestChange = () => fetchStats();
    window.addEventListener("guestListUpdated", handleGuestChange);
    return () => window.removeEventListener("guestListUpdated", handleGuestChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wedding-card">
      <img src={CARD_IMAGES[bgIndex]} alt="" className="wc-bg-img" loading="lazy" />

      <div className="wc-header-strip">
        <span className="wc-stat">👥 {guestStats.invited}/{guestStats.attended}</span>
        <button className="wc-edit-btn" onClick={() => setShowCardDist(true)} title="Card Distribution">📬</button>
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

      <CardDistributionModal
        isOpen={showCardDist}
        onClose={() => setShowCardDist(false)}
        guests={guests}
        weddingId={wedding._id || wedding.id}
        onUpdate={fetchStats}
        weddingDate={wedding.date}
      />
    </div>
  );
}
