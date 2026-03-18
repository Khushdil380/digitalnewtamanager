import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import "../styles/WeddingCard.css";

const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

export default function WeddingCard({
  wedding,
  onEditClick,
  onGuestClick,
  onDeleteClick,
  onGoToWeddingEvent,
}) {
  const [guestStats, setGuestStats] = useState({
    invited: 0,
    attended: 0,
  });
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGuestStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wedding.id, wedding._id]);

  const fetchGuestStats = async () => {
    try {
      setLoading(true);
      const weddingId = wedding._id || wedding.id;
      const response = await axios.get(
        `${API_BASE_URL}/api/guests/wedding/${weddingId}`,
      );
      const guests = response.data.guests || [];
      const invited = guests.length;
      const attended = guests.filter((g) => g.attendedStatus).length;
      setGuestStats({ invited, attended });
    } catch (error) {
      console.error("Failed to fetch guest stats:", error);
      setGuestStats({ invited: 0, attended: 0 });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="wedding-card">
      <div className="wedding-card-row">
        {/* Couple Names */}
        <div className="wedding-couple">
          <span className="couple-icon">👰</span>
          <span className="couple-name">{wedding.brideName}</span>
          <span className="connector">+</span>
          <span className="couple-name">{wedding.groomName}</span>
          <span className="couple-icon">🤵</span>
        </div>

        {/* Venue */}
        <div className="detail-item">
          <span className="detail-icon">📍</span>
          <span className="detail-text">{wedding.venue}</span>
        </div>

        {/* Date */}
        <div className="detail-item">
          <span className="detail-icon">📅</span>
          <span className="detail-text">{formatDate(wedding.date)}</span>
        </div>

        {/* Guests Count - Invited/Attended */}
        <div className="detail-item">
          <span className="detail-icon">👥</span>
          <span className="detail-text">
            {guestStats.invited}/{guestStats.attended}
          </span>
        </div>

        {/* Buttons */}
        <div className="wedding-card-buttons">
          <Button
            variant="primary"
            size="small"
            onClick={() => onGoToWeddingEvent(wedding._id || wedding.id)}
          >
            Go To
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() => onGuestClick(wedding)}
          >
            👥 Guests
          </Button>
        </div>

        {/* Edit Icon */}
        <button
          className="wedding-edit-btn"
          onClick={() => onEditClick(wedding)}
          title="Edit wedding"
        >
          ✏️
        </button>
      </div>
    </div>
  );
}
