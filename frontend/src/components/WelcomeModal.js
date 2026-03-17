import React from "react";
import Modal from "./Modal";
import "../styles/WelcomeModal.css";

export default function WelcomeModal({ isOpen, user, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="welcome-content">
        <div className="welcome-icon">✨</div>
        <h2>Welcome to DigitalNewtaManager!</h2>
        <p>Account created successfully</p>
        <div className="welcome-user">
          <p>
            <strong>{user?.fullName}</strong>
          </p>
          <p>{user?.email}</p>
        </div>
        <button className="welcome-btn" onClick={onClose}>
          Get Started
        </button>
      </div>
    </Modal>
  );
}
