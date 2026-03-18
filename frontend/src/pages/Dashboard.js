import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardHeader from "../components/DashboardHeader";
import ProfileModal from "../components/ProfileModal";
import WeddingModal from "../components/WeddingModal";
import WeddingList from "../components/WeddingList";
import GuestList from "../components/GuestList";
import "../styles/Dashboard.css";

const API_BASE_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const Dashboard = ({ onGoToWeddingEvent }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}"),
  );
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showWeddingModal, setShowWeddingModal] = useState(false);
  const [showGuestList, setShowGuestList] = useState(false);
  const [selectedWeddingId, setSelectedWeddingId] = useState(null);
  const [weddings, setWeddings] = useState([]);
  const [editingWedding, setEditingWedding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchWeddings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchWeddings = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/weddings/user/${user?.id}`,
      );
      setWeddings(res.data.weddings || []);
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

  const handleAddWeddingClick = () => {
    setEditingWedding(null);
    setShowWeddingModal(true);
  };

  const handleEditWedding = (wedding) => {
    setEditingWedding(wedding);
    setShowWeddingModal(true);
  };

  const handleWeddingCreated = (newWedding) => {
    if (editingWedding) {
      setWeddings(
        weddings.map((w) => (w.id === newWedding.id ? newWedding : w)),
      );
    } else {
      setWeddings([newWedding, ...weddings]);
    }
  };

  const handleGuestClick = (wedding) => {
    setSelectedWeddingId(wedding._id || wedding.id);
    setShowGuestList(true);
  };

  const handleDeleteWedding = async (weddingId) => {
    if (window.confirm("Are you sure you want to delete this wedding?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/weddings/${weddingId}`);
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
        <div className="weddings-section">
          <button className="add-wedding-btn" onClick={handleAddWeddingClick}>
            + Add New Wedding
          </button>

          {loading ? (
            <div className="loading">Loading weddings...</div>
          ) : (
            <WeddingList
              weddings={weddings}
              onEditClick={handleEditWedding}
              onGuestClick={handleGuestClick}
              onDeleteClick={handleDeleteWedding}
              onGoToWeddingEvent={onGoToWeddingEvent}
            />
          )}
        </div>
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
          onClose={() => {
            setShowGuestList(false);
            setSelectedWeddingId(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
