import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import "../../styles/common/WelcomeModal.css";

const WelcomeModal = ({ isOpen, user, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="welcome-content">
        <div className="welcome-icon">✨</div>
        <h2>Welcome to DigitalNewtaManager!</h2>
        <p>Account created successfully</p>
        <div className="welcome-user">
          <p><strong>{user?.fullName}</strong></p>
          <p>{user?.email}</p>
        </div>
        <Button variant="primary" size="large" onClick={onClose}>
          Get Started
        </Button>
      </div>
    </Modal>
  );
};

export default WelcomeModal;
