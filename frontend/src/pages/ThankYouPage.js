import React from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/pages/ThankYouPage.css";

const ThankYouPage = () => {
  const [searchParams] = useSearchParams();
  const bride = searchParams.get("bride") || "Bride";
  const groom = searchParams.get("groom") || "Groom";

  return (
    <div className="thankyou-page">
      <div className="thankyou-bg-shapes">
        <span className="ty-shape ty-s1">💕</span>
        <span className="ty-shape ty-s2">💍</span>
        <span className="ty-shape ty-s3">🌹</span>
        <span className="ty-shape ty-s4">✨</span>
        <span className="ty-shape ty-s5">🕊️</span>
        <span className="ty-shape ty-s6">💐</span>
      </div>

      <div className="thankyou-card">
        <div className="thankyou-header">
          <span className="ty-emoji-top">🎊</span>
          <p className="ty-welcome">You are invited to celebrate</p>
        </div>

        <div className="thankyou-couple">
          <div className="ty-name ty-bride">
            <span className="ty-icon">👰</span>
            <span>{bride}</span>
          </div>
          <span className="ty-heart">❤️</span>
          <div className="ty-name ty-groom">
            <span className="ty-icon">🤵</span>
            <span>{groom}</span>
          </div>
        </div>

        <div className="thankyou-divider"></div>

        <div className="thankyou-message">
          <p>Thank you so much for gracing our wedding with your presence.</p>
          <p>Your love, blessings, and warm wishes mean everything to us.</p>
          <p>We are truly grateful to have you as part of this beautiful journey.</p>
        </div>

        <div className="thankyou-wishes">
          <span className="ty-wish-icon">🙏</span>
          <p>May God bless you and your family with happiness and prosperity.</p>
          <p className="ty-tagline">Have a wonderful day!</p>
        </div>

        <div className="thankyou-footer">
          <span>💍</span>
          <span>DigitalNewtaManager</span>
          <span>💍</span>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
