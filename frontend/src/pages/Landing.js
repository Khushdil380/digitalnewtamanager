import React from "react";
import Button from "../components/Button";
import "../styles/Landing.css";

const Landing = ({ onLoginClick }) => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">DigitalNewtaManager</h1>
        <p className="landing-subtitle">
          Manage Wedding Guests & Contributions with Ease
        </p>

        <Button
          variant="primary"
          size="large"
          onClick={onLoginClick}
          className="landing-btn"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Landing;
