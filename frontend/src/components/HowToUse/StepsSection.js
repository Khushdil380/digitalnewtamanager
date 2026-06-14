import React from "react";
import "../../styles/howToUse/StepsSection.css";

const steps = [
  {
    icon: "🔐",
    title: "Account बनाएं और Login करें",
    desc: "Email से Register करें। OTP verification के बाद Login करें। Password भूल गए? No worry — Forgot Password से reset करें।",
    tip: "💡 एक बार login करने के बाद 2 घंटे तक session active रहता है।",
  },
  {
    icon: "💒",
    title: "Wedding बनाएं",
    desc: "Dashboard पर 'Add New Wedding' click करें। दूल्हा-दुल्हन का नाम, तारीख और जगह डालें। आप एक से ज्यादा शादियां बना सकते हैं — भाई, बहन, चचेरे भाई सबके लिए अलग-अलग।",
    tip: "💡 हर wedding का अपना अलग guest list और contribution record होता है।",
  },
  {
    icon: "📋",
    title: "Guest List बनाएं (कार्ड बांटते समय)",
    desc: "जब आप invitation cards छपवाकर बांटें, तभी Guest List में हर मेहमान का नाम add करें — नाम, गाँव/शहर, मोबाइल (optional), category (Friend/Family/Relative), और priority (1=High)।",
    tip: "💡 यह master list शादी के दिन काम आएगी — नाम type करते ही suggest होगा।",
  },
  {
    icon: "📬",
    title: "Card Distribution Track करें",
    desc: "जैसे-जैसे card बांटें, 📬 icon click करके mark करें कि किसे card दिया। घर में कई लोग बांट रहे हैं? Real-time status से कोई confusion नहीं।",
    tip: "💡 Wedding Card header पर भी 📬 icon से directly access कर सकते हैं। शादी के बाद feature auto-disabled हो जाता है।",
  },
  {
    icon: "🎊",
    title: "शादी के दिन — Contribution Record करें",
    desc: "Wedding card पर 'Go To' click करें। जैसे-जैसे मेहमान आएं: नाम type करें (auto-suggest), गाँव select करें, राशि डालें, Payment type (Cash/UPI/Envelope) चुनें, और Personally या By Someone select करें।",
    tip: "💡 अगर कोई नया मेहमान आए जो list में नहीं है, तो वो automatically 'Wedding Day' label से add हो जाएगा।",
  },
  {
    icon: "📊",
    title: "Progress Track करें",
    desc: "Page के नीचे animated Progress Bar दिखाता है कि कितने मेहमान आ चुके हैं। Header में Stats icon से total amount, cash/UPI/envelope breakdown देखें।",
    tip: "💡 Real-time update — हर contribution record करने पर bar और stats automatically बढ़ते हैं।",
  },
  {
    icon: "📥",
    title: "Export और Share करें",
    desc: "Guest List को PDF, CSV, Excel, Text format में download करें या Email पर भेजें। शादी के बाद future reference के लिए काम आएगी।",
    tip: "💡 Filter apply करके specific group (जैसे attended-only) export कर सकते हैं।",
  },
];

const StepsSection = () => {
  return (
    <section className="htu-steps htu-theme-pink">
      <h2 className="htu-section-title">📋 कैसे इस्तेमाल करें — Step by Step</h2>
      <div className="htu-steps-list">
        {steps.map((step, i) => (
          <div key={i} className="htu-step-card">
            <div className="htu-step-number">{step.icon}</div>
            <div className="htu-step-content">
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
              {step.tip && <span className="htu-step-tip">{step.tip}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StepsSection;
