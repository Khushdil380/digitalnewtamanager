import React from "react";
import "../../styles/howToUse/HeroSection.css";

const HeroSection = () => {
  return (
    <section className="htu-hero">
      <h1 className="htu-hero-title">📖 How to Use DigitalNewtaManager</h1>
      <p className="htu-hero-subtitle">
        A complete guide to managing your wedding guests, contributions, and attendance — digitally.
      </p>
      <div className="htu-hero-context">
        <h3>💡 What is "Newta"?</h3>
        <p>
          In Indian weddings, especially in middle-class and rural families, when guests arrive at the wedding they give a monetary contribution called <strong>"Newta"</strong>. A person sits with a register and records each guest's name, village, and amount. Some give cash, some give via envelope. This age-old tradition of give-and-take has been on paper for generations.
        </p>
        <p><strong>DigitalNewtaManager</strong> digitizes this entire process — from invitation cards to the final register.</p>
      </div>
    </section>
  );
};

export default HeroSection;
