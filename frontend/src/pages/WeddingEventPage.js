import React, { useState, useEffect } from "react";
import api from "../utils/api";
import WeddingWishesHeader from "../components/Event/WeddingWishesHeader";
import ContributionForm from "../components/Event/ContributionForm";
import QRCodeSection from "../components/Event/QRCodeSection";
import GuestList from "../components/Guest/GuestList";
import Calculator from "../components/Calculator/Calculator";
import NotesModal from "../components/Notes/NotesModal";
import AttendanceBar from "../components/Progress/AttendanceBar";
import CelebrationBurst from "../components/Celebration/CelebrationBurst";
import "../styles/event/WeddingEventPage.css";

const WeddingEventPage = ({ weddingId, onBackClick }) => {
  const [wedding, setWedding] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showGuestList, setShowGuestList] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const [stats, setStats] = useState({
    totalContributions: 0,
    totalAmount: 0,
    cashCount: 0,
    upiCount: 0,
    envelopeCount: 0,
    personalCount: 0,
    bySomeoneCount: 0,
  });
  const [totalGuests, setTotalGuests] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.id) {
      setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/weddings/${weddingId}/event-data`);
      setWedding(data.wedding);
      setStats(data.stats || {});
      setTotalGuests(data.totalGuests || 0);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch wedding data:", error);
      setLoading(false);
    }
  };

  const handleContributionRecorded = () => {
    api.get(`/api/contributions/wedding/${weddingId}`)
      .then((res) => {
        setStats(res.data.stats || {});
      })
      .catch((err) => {
        console.error("Failed to refresh stats:", err);
      });
    api.get(`/api/guests/wedding/${weddingId}`)
      .then((res) => {
        setTotalGuests((res.data.guests || []).filter((g) => !g.isDeleted).length);
      })
      .catch(() => {});
    // Trigger celebration if enabled
    if (localStorage.getItem("celebrationMode") !== "off") {
      setCelebrationTrigger((prev) => prev + 1);
    }
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
          onCalcClick={() => setShowCalc((v) => !v)}
          onNotesClick={() => setShowNotes(true)}
        />
      </div>

      {/* Main Content - Single Row */}
      <div className="event-content">
        <div className="form-container">
          <ContributionForm
            weddingId={weddingId}
            userId={userId}
            onContributionRecorded={handleContributionRecorded}
            brideName={wedding?.brideName}
            groomName={wedding?.groomName}
            weddingDate={wedding?.date}
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

      {/* Attendance Progress Bar */}
      <AttendanceBar attended={stats.totalContributions} total={totalGuests} />

      {showCalc && <Calculator onClose={() => setShowCalc(false)} />}

      {showGuestList && (
        <GuestList
          weddingId={weddingId}
          onClose={() => setShowGuestList(false)}
          hideAddForm={true}
          weddingInfo={wedding ? { brideName: wedding.brideName, groomName: wedding.groomName, date: wedding.date, venue: wedding.venue } : null}
        />
      )}

      <NotesModal
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
        weddingId={weddingId}
      />

      <CelebrationBurst trigger={celebrationTrigger} />
    </div>
  );
};

export default WeddingEventPage;
