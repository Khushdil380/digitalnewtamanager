import React, { useState } from "react";
import "../styles/WeddingWishesHeader.css";

const WeddingWishesHeader = ({
  brideName,
  groomName,
  stats,
  onBackClick,
  onGuestListClick,
}) => {
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="wedding-wishes-header">
      <div className="wishes-content">
        <div className="header-row">
          {/* Back Button - Left Corner */}
          <button className="back-btn-header" onClick={onBackClick}>
            ← Back
          </button>

          {/* Couple Names - Middle */}
          <h1 className="couple-title">
            <span className="bride-name">{brideName}</span>
            <span className="connector">&</span>
            <span className="groom-name">{groomName}</span>
          </h1>

          {/* Eye Toggle and Hidden Stats - Right Corner */}
          {stats && (
            <div className="header-icons-wrapper">
              <button
                className="guest-icon-btn"
                onClick={onGuestListClick}
                title="View guest list"
              >
                👥
              </button>

              <div className="header-stats-wrapper">
                <button
                  className="eye-toggle-btn"
                  onClick={() => setShowStats(!showStats)}
                  title={showStats ? "Hide stats" : "Show stats"}
                >
                  {showStats ? "👁️" : "👁️‍🗨️"}
                </button>

                {showStats && (
                  <div className="header-stats">
                    <div className="stat-item">
                      <span className="stat-text">
                        {stats.totalContributions}/
                        {stats.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">💵</span>
                      <span className="stat-value">{stats.cashCount}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">🔗</span>
                      <span className="stat-value">
                        {stats.onlineCount || 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeddingWishesHeader;
