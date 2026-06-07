import React from "react";
import HeroSection from "../components/HowToUse/HeroSection";
import StepsSection from "../components/HowToUse/StepsSection";
import FeaturesSection from "../components/HowToUse/FeaturesSection";
import TipsSection from "../components/HowToUse/TipsSection";
import "../styles/howToUse/HowToUsePage.css";

const HowToUsePage = ({ onBack }) => {
  return (
    <div className="how-to-use-page">
      <button className="htu-back-btn" onClick={onBack}>← Back</button>
      <HeroSection />
      <StepsSection />
      <FeaturesSection />
      <TipsSection />
      <div className="htu-footer">
        <p>Made with ❤️ for every Indian wedding | <a href="mailto:helpdigitalnewtamanager@gmail.com">helpdigitalnewtamanager@gmail.com</a></p>
      </div>
    </div>
  );
};

export default HowToUsePage;
