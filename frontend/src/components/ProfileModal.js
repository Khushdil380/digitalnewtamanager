import React, { useState } from "react";
import Modal from "./Modal";
import PersonalTab from "./ProfileTabs/PersonalTab";
import EmailTab from "./ProfileTabs/EmailTab";
import MobileTab from "./ProfileTabs/MobileTab";
import PasswordTab from "./ProfileTabs/PasswordTab";
import "../styles/ProfileModal.css";

export default function ProfileModal({ isOpen, user, onClose, onUserUpdate }) {
  const [activeTab, setActiveTab] = useState("personal");

  const handleUserUpdate = (updatedUser) => {
    onUserUpdate(updatedUser);
  };

  const tabs = [
    { id: "personal", label: "Personal", icon: "👤" },
    { id: "email", label: "Email", icon: "✉️" },
    { id: "mobile", label: "Mobile", icon: "📱" },
    { id: "password", label: "Password", icon: "🔐" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="medium">
      <div className="profile-modal">
        <h2>My Profile</h2>

        <div className="profile-tabs">
          <div className="tab-buttons">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === "personal" && (
              <PersonalTab user={user} onUpdate={handleUserUpdate} />
            )}
            {activeTab === "email" && (
              <EmailTab user={user} onUpdate={handleUserUpdate} />
            )}
            {activeTab === "mobile" && (
              <MobileTab user={user} onUpdate={handleUserUpdate} />
            )}
            {activeTab === "password" && <PasswordTab user={user} />}
          </div>
        </div>
      </div>
    </Modal>
  );
}
