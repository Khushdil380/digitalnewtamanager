import React from "react";
import Button from "../components/common/Button";
import "../styles/pages/Landing.css";

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

        <div className="landing-links">
          <a href="https://khushdil-ansari-portfolio-frontend.vercel.app" target="_blank" rel="noopener noreferrer" className="landing-link">
            Portfolio
          </a>
          <a href="https://github.com/Khushdil380" target="_blank" rel="noopener noreferrer" className="landing-link">
            GitHub
          </a>
          <div className="landing-link-wrapper">
            <span className="landing-link">Help</span>
            <div className="landing-help-tooltip">
              <p>For any help, feedback,<br />or queries contact us at:</p>
              <a href="mailto:helpdigitalnewtamanager@gmail.com">helpdigitalnewtamanager@gmail.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
