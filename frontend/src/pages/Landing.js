import React from "react";
import Button from "../components/common/Button";
import "../styles/pages/Landing.css";

const Landing = ({ onLoginClick, onHowToUseClick }) => {
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
          <a href="https://khushdil-ansari-portfolio-frontend.vercel.app" target="_blank" rel="noopener noreferrer" className="landing-icon" title="Portfolio">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </a>
          <a href="https://github.com/Khushdil380" target="_blank" rel="noopener noreferrer" className="landing-icon" title="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21.5c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>
          </a>
          <div className="landing-icon-wrapper">
            <span className="landing-icon" title="Help">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg>
            </span>
            <div className="landing-help-tooltip">
              <p>For any help, feedback,<br/>or queries contact us at:</p>
              <a href="mailto:helpdigitalnewtamanager@gmail.com">helpdigitalnewtamanager@gmail.com</a>
            </div>
          </div>
        </div>

        <div className="landing-how-to-use">
          <button className="how-to-use-btn" onClick={onHowToUseClick}>📖 How to Use</button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
