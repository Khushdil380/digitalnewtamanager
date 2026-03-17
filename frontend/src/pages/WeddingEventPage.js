import React, { useState, useEffect } from "react";
import axios from "axios";
import WeddingWishesHeader from "../components/WeddingWishesHeader";
import ContributionForm from "../components/ContributionForm";
import QRCodeSection from "../components/QRCodeSection";
import GuestList from "../components/GuestList";
import "../styles/WeddingEventPage.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const WeddingEventPage = ({ weddingId, onBackClick }) => {
  const [wedding, setWedding] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showGuestList, setShowGuestList] = useState(false);
  const [stats, setStats] = useState({
    totalContributions: 0,
    totalAmount: 0,
    cashCount: 0,
    onlineCount: 0,
    personalCount: 0,
    throughOthersCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.id) {
      setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    fetchWeddingData();
    fetchContributions();
  }, [weddingId]);

  const fetchWeddingData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/weddings/${weddingId}`,
      );
      setWedding(response.data.wedding);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch wedding:", error);
      setLoading(false);
    }
  };

  const fetchContributions = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/contributions/wedding/${weddingId}`,
      );
      setContributions(response.data.contributions || []);
      setStats(response.data.stats || {});
    } catch (error) {
      console.error("Failed to fetch contributions:", error);
    }
  };

  const handleContributionRecorded = () => {
    fetchContributions();
  };

  if (loading) {
    return (
      <div className="wedding-event-page">
        <div className="loading-state">Loading wedding details...</div>
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="wedding-event-page">
        <div className="error-state">Wedding not found</div>
        <button onClick={onBackClick} className="back-btn">
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="wedding-event-page">
      {/* Header with Stats */}
      <div className="event-header">
        <WeddingWishesHeader
          brideName={wedding.brideName}
          groomName={wedding.groomName}
          stats={stats}
          onBackClick={onBackClick}
          onGuestListClick={() => setShowGuestList(true)}
        />
      </div>

      {/* Main Content - Single Row */}
      <div className="event-content">
        <div className="form-container">
          <ContributionForm
            weddingId={weddingId}
            userId={userId}
            onContributionRecorded={handleContributionRecorded}
          />
        </div>

        <div className="qr-container">
          <QRCodeSection
            brideName={wedding?.brideName}
            groomName={wedding?.groomName}
            weddingId={weddingId}
          />
        </div>
      </div>

      {/* Guest List Modal */}
      {showGuestList && (
        <GuestList
          weddingId={weddingId}
          onClose={() => setShowGuestList(false)}
          hideAddForm={true}
        />
      )}
    </div>
  );
};

export default WeddingEventPage;
