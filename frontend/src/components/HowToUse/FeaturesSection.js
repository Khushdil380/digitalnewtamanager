import React from "react";
import "../../styles/howToUse/FeaturesSection.css";

const features = [
  { icon: "📝", title: "Notes", desc: "Add personal notes per wedding — track gifts, special requests, or any info about guests." },
  { icon: "📲", title: "QR Code (UPI)", desc: "Generate UPI payment QR codes for guests who want to pay digitally. Set amount and it auto-reverts after 30 seconds." },
  { icon: "💬", title: "SMS Thank You", desc: "Auto-send thank you message to guests who attend personally and have a mobile number saved. Uses httpSMS (your own phone as gateway)." },
  { icon: "🎉", title: "Celebration Burst", desc: "Fun emoji rain animation after each contribution. Toggle ON/OFF from profile dropdown." },
  { icon: "⚠️", title: "Duplicate Detection", desc: "Warns when you try to add a guest with same name and village. Prevents accidental duplicates." },
  { icon: "🔔", title: "Already Contributed Warning", desc: "If a guest has already contributed and you record again, it asks whether to update the amount or cancel." },
  { icon: "🎨", title: "Three Themes", desc: "Switch between Redish, Pink, and Purple wedding themes anytime. The entire UI adapts." },
  { icon: "📊", title: "Progress Bar", desc: "Live attendance progress bar shows how many guests have arrived out of total invited." },
];

const FeaturesSection = () => {
  return (
    <section className="htu-features">
      <h2 className="htu-section-title">✨ Key Features</h2>
      <div className="htu-features-grid">
        {features.map((f, i) => (
          <div key={i} className="htu-feature-card">
            <span className="htu-feature-icon">{f.icon}</span>
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
