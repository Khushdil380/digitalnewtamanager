import React from "react";
import "../styles/AnimatedBackground.css";

const AnimatedBackground = () => {
  return (
    <div className="animated-background">
      <div className="background-shape shape-circle shape-1"></div>
      <div className="background-shape shape-circle shape-2"></div>
      <div className="background-shape shape-circle shape-3"></div>
      <div className="background-shape shape-flower shape-4">🌹</div>
      <div className="background-shape shape-flower shape-5">💐</div>
      <div className="background-shape shape-heart shape-6">♥</div>
      <div className="background-shape shape-heart shape-7">♥</div>
      <div className="background-shape shape-ring shape-8">💍</div>
      <div className="background-shape shape-couple shape-9">👰</div>
      <div className="background-shape shape-couple shape-10">🤵</div>
      <div className="background-shape shape-sparkle shape-11">✨</div>
      <div className="background-shape shape-dove shape-12">🕊️</div>
      <div className="background-shape shape-gift shape-13">🎁</div>
    </div>
  );
};

export default AnimatedBackground;
