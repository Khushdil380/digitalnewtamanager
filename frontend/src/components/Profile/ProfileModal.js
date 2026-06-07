import React, { useState } from "react";
import Modal from "../common/Modal";
import PersonalTab from "./ProfileTabs/PersonalTab";
import EmailTab from "./ProfileTabs/EmailTab";
import PasswordTab from "./ProfileTabs/PasswordTab";
import SmsTab from "./ProfileTabs/SmsTab";
import "../../styles/profile/ProfileModal.css";

export default function ProfileModal({ isOpen, user, onClose, onUserUpdate }) {
  const [activeTab, setActiveTab] = useState("personal");

  const handleUserUpdate = (updatedUser) => {
    onUserUpdate(updatedUser);
  };

  const tabs = [
    { id: "personal", label: "Personal", icon: "👤" },
    { id: "email", label: "Email", icon: "✉️" },
    { id: "password", label: "Password", icon: "🔐" },
    { id: "sms", label: "SMS", icon: "💬" },
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
            {activeTab === "password" && <PasswordTab user={user} />}
            {activeTab === "sms" && <SmsTab user={user} />}
          </div>
        </div>
      </div>
    </Modal>
  );
}
