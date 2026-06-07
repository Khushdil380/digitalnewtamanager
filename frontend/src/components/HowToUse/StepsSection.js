import React from "react";
import "../../styles/howToUse/StepsSection.css";

const steps = [
  {
    icon: "1️⃣",
    title: "Create Account & Login",
    desc: "Register with your email. An OTP will be sent for verification. Once verified, you can login anytime with email and password.",
  },
  {
    icon: "2️⃣",
    title: "Create a Wedding",
    desc: "On the Dashboard, click 'Add New Wedding'. Enter bride name, groom name, date, and venue. You can create multiple weddings (for siblings, cousins, etc.).",
  },
  {
    icon: "3️⃣",
    title: "Add Guest List (During Card Distribution)",
    desc: "When you print invitation cards and distribute them, open the Guest List for that wedding and add each guest's name, village, mobile (optional), category, and priority. This is your master invitation list.",
  },
  {
    icon: "4️⃣",
    title: "Wedding Day — Record Contributions",
    desc: "Click 'Go To' on the wedding card. On this page, as each guest arrives, enter their name (auto-suggests from your list), village, amount, payment type (Cash/UPI/Envelope), and whether they came personally or sent via someone.",
  },
  {
    icon: "5️⃣",
    title: "Track Progress",
    desc: "The attendance progress bar shows how many guests have arrived. Stats in the header show total amount collected, cash/UPI/envelope breakdown.",
  },
  {
    icon: "6️⃣",
    title: "Export & Share",
    desc: "Export the guest list as PDF, CSV, Excel, plain text, or email it to yourself. Use this for future reference when attending their weddings.",
  },
];

const StepsSection = () => {
  return (
    <section className="htu-steps">
      <h2 className="htu-section-title">📋 Step-by-Step Workflow</h2>
      <div className="htu-steps-list">
        {steps.map((step, i) => (
          <div key={i} className="htu-step-card">
            <span className="htu-step-icon">{step.icon}</span>
            <div className="htu-step-content">
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StepsSection;
