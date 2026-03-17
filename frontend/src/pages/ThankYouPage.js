import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/ThankYouPage.css";

const ThankYouPage = () => {
  const [searchParams] = useSearchParams();
  const bride = searchParams.get("bride") || "Bride";
  const groom = searchParams.get("groom") || "Groom";
  const weddingId = searchParams.get("weddingId") || "";
  const [displayedText, setDisplayedText] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const messages = [
    `Welcome to the wedding of`,
    `💕 ${bride} & ${groom} 💕`,
    ``,
    `Thank you for being part of`,
    `this special day!`,
    ``,
    `Your love and blessings mean`,
    `the world to us.`,
    ``,
    `Wishing you a beautiful day!`,
  ];

  // Typewriter animation for text
  useEffect(() => {
    if (currentLineIndex >= messages.length) return;

    const currentMessage = messages[currentLineIndex];
    const targetLength = displayedText + currentMessage;

    if (displayedText.length < (currentMessage + " ").length) {
      const timer = setTimeout(() => {
        setDisplayedText(displayedText + currentMessage.charAt(0));
      }, 50);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setDisplayedText(targetLength + "\n");
        setCurrentLineIndex(currentLineIndex + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [displayedText, currentLineIndex, messages]);

  return (
    <div className="thank-you-page">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="shape shape-heart">💕</div>
        <div className="shape shape-ring">💍</div>
        <div className="shape shape-flower">🌹</div>
      </div>

      {/* Main Content */}
      <div className="thank-you-content">
        {/* Animated Couple Names */}
        <div className="couple-section">
          <div className="bride-name animate-slide-right">
            <span className="name-emoji">👰</span>
            <span className="name-text">{bride}</span>
          </div>
          <div className="heart-divider animate-bounce">💕</div>
          <div className="groom-name animate-slide-left">
            <span className="name-emoji">🤵</span>
            <span className="name-text">{groom}</span>
          </div>
        </div>

        {/* Message with Typewriter Effect */}
        <div className="message-section">
          <div className="message-text">
            {displayedText.split("\n").map((line, idx) => (
              <div key={idx} className="message-line">
                {line}
              </div>
            ))}
            <span className="cursor">|</span>
          </div>
        </div>

        {/* Closing Message */}
        <div className="closing-section">
          <div className="closing-emoji">🙏</div>
          <p className="closing-text">
            May your marriage be filled with joy and happiness!
          </p>
        </div>

        {/* Contribution Button (if applicable) */}
        {/* Placeholder for future: link to contribution page */}
      </div>

      {/* Footer */}
      <footer className="thank-you-footer">
        <p>Digital Newta Manager • Celebrating life's special moments 💍</p>
      </footer>
    </div>
  );
};

export default ThankYouPage;
