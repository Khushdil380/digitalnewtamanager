import { useState, useEffect } from "react";
import "../../styles/celebration/CornerBurst.css";

const ITEMS = ["🌸", "🌺", "💐", "🎊", "✨", "🫧", "💒", "🪷", "🌹", "🎉", "💫", "🩷"];

const CornerBurst = ({ trigger }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger) return;

    const newParticles = [];
    // Generate particles from both corners
    for (let i = 0; i < 14; i++) {
      // Left corner
      newParticles.push({
        id: `L${Date.now()}${i}`,
        emoji: ITEMS[Math.floor(Math.random() * ITEMS.length)],
        side: "left",
        angle: 30 + Math.random() * 30, // 30-60 degrees
        distance: 30 + Math.random() * 40, // how far (vh)
        delay: Math.random() * 0.2,
        size: 1 + Math.random() * 0.8,
      });
      // Right corner
      newParticles.push({
        id: `R${Date.now()}${i}`,
        emoji: ITEMS[Math.floor(Math.random() * ITEMS.length)],
        side: "right",
        angle: 30 + Math.random() * 30,
        distance: 30 + Math.random() * 40,
        delay: Math.random() * 0.2,
        size: 1 + Math.random() * 0.8,
      });
    }

    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), 2500);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="corner-burst">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = -Math.sin(rad) * p.distance;

        return (
          <span
            key={p.id}
            className={`corner-particle corner-${p.side}`}
            style={{
              "--tx": `${p.side === "left" ? tx : -tx}vw`,
              "--ty": `${ty}vh`,
              animationDelay: `${p.delay}s`,
              fontSize: `${p.size}rem`,
            }}
          >
            {p.emoji}
          </span>
        );
      })}
    </div>
  );
};

export default CornerBurst;
