import React, { useState, useEffect } from "react";
import api from "../utils/api";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import ProfileModal from "../components/Profile/ProfileModal";
import WeddingModal from "../components/Wedding/WeddingModal";
import WeddingList from "../components/Wedding/WeddingList";
import GuestList from "../components/Guest/GuestList";
import Button from "../components/common/Button";
import "../styles/dashboard/Dashboard.css";

const Dashboard = ({ onGoToWeddingEvent }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showWeddingModal, setShowWeddingModal] = useState(false);
  const [showGuestList, setShowGuestList] = useState(false);
  const [selectedWeddingId, setSelectedWeddingId] = useState(null);
  const [weddings, setWeddings] = useState([]);
  const [editingWedding, setEditingWedding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchWeddings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchWeddings = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/api/weddings/user/${user.id}`);
      setWeddings(data.weddings || []);
    } catch (error) {
      console.error("Failed to fetch weddings:", error);
      setWeddings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const handleWeddingCreated = (newWedding) => {
    if (editingWedding) {
      setWeddings(weddings.map((w) => (w.id === newWedding.id ? newWedding : w)));
    } else {
      setWeddings([newWedding, ...weddings]);
    }
  };

  const handleDeleteWedding = async (weddingId) => {
    if (window.confirm("Are you sure you want to delete this wedding?")) {
      try {
        await api.delete(`/api/weddings/${weddingId}`);
        setWeddings(weddings.filter((w) => w.id !== weddingId));
      } catch (error) {
        console.error("Failed to delete wedding:", error);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardHeader
        user={user}
        onProfileClick={() => setShowProfileModal(true)}
        onLogoutClick={handleLogout}
      />

      <div className="dashboard-content">
        <Button
          variant="primary"
          className="add-wedding-btn"
          onClick={() => { setEditingWedding(null); setShowWeddingModal(true); }}
        >
          + Add New Wedding
        </Button>

        {loading ? (
          <div className="loading">Loading weddings...</div>
        ) : (
          <WeddingList
            weddings={weddings}
            onEditClick={(w) => { setEditingWedding(w); setShowWeddingModal(true); }}
            onGuestClick={(w) => { setSelectedWeddingId(w._id || w.id); setShowGuestList(true); }}
            onDeleteClick={handleDeleteWedding}
            onGoToWeddingEvent={onGoToWeddingEvent}
          />
        )}
      </div>

      <ProfileModal
        isOpen={showProfileModal}
        user={user}
        onClose={() => setShowProfileModal(false)}
        onUserUpdate={handleUserUpdate}
      />

      <WeddingModal
        isOpen={showWeddingModal}
        onClose={() => setShowWeddingModal(false)}
        onWeddingCreated={handleWeddingCreated}
        editingWedding={editingWedding}
      />

      {showGuestList && selectedWeddingId && (
        <GuestList
          weddingId={selectedWeddingId}
          onClose={() => { setShowGuestList(false); setSelectedWeddingId(null); }}
        />
      )}
    </div>
  );
};

export default Dashboard;
