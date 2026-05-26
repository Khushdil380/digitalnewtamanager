import React, { useState } from "react";
import "../../styles/event/WeddingWishesHeader.css";

const WeddingWishesHeader = ({ brideName, groomName, stats, onBackClick, onGuestListClick }) => {
  const [showStats, setShowStats] = useState(false);

  return (
    <header className="event-header-bar">
      <button className="header-back-btn" onClick={onBackClick}>← Back</button>

      <h1 className="header-couple-names">
        {brideName} <span className="header-amp">&</span> {groomName}
      </h1>

      <div className="header-actions">
        <button className="header-icon-btn" onClick={onGuestListClick} title="Guest list">👥</button>
        <button className="header-icon-btn" onClick={() => setShowStats(!showStats)} title="Stats">
          {showStats ? "🙈" : "👁️"}
        </button>
      </div>

      {showStats && stats && (
        <div className="header-stats-bar">
          <span className="stat-chip">🎉 {stats.totalContributions}</span>
          <span className="stat-chip">₹{(stats.totalAmount || 0).toLocaleString()}</span>
          <span className="stat-chip">💵 {stats.cashCount}</span>
          <span className="stat-chip">🔗 {stats.upiCount || 0}</span>
          <span className="stat-chip">✉️ {stats.envelopeCount || 0}</span>
        </div>
      )}
    </header>
  );
};

export default WeddingWishesHeader;
