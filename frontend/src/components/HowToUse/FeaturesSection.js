import React from "react";
import "../../styles/howToUse/FeaturesSection.css";

const features = [
  {
    icon: "📲",
    title: "QR Code (UPI Payment)",
    desc: "कुछ मेहमान cash नहीं रखते, वो UPI से pay करना चाहते हैं। QR Code section में अपना UPI ID एक बार set करें, फिर किसी भी amount के लिए QR generate करें।",
    howTo: "Settings icon → UPI ID डालें → Amount enter करें → Generate QR। 30 सेकंड बाद default QR पर वापस आ जाता है।",
  },
  {
    icon: "💬",
    title: "SMS Thank You (httpSMS)",
    desc: "शादी में personally आने वाले मेहमान को automatic thank you SMS भेजें — आपके अपने phone से, आपके daily 100 free SMS plan से।",
    howTo: "Profile → SMS Tab → httpSMS app install करें → API Key और Phone Number save करें → Wedding page पर SMS toggle ON करें → हर contribution पर auto-send!",
  },
  {
    icon: "🎉",
    title: "Celebration Burst",
    desc: "हर successful contribution के बाद screen पर colorful emoji rain (🎉💰🎊💵✨) — माहौल बनता है! अगर irritating लगे तो OFF कर दें।",
    howTo: "Profile Dropdown (top-right) → 'Celebration ON/OFF' click करें। Setting localStorage में save रहती है।",
  },
  {
    icon: "📝",
    title: "Notes (per Wedding)",
    desc: "किसी ने gift दिया? कोई special request है? कोई important बात याद रखनी है? Notes में लिख लें — हर wedding के अपने अलग notes।",
    howTo: "Wedding Day page → Header में 📝 Notes icon click करें → Title और Description लिखें → Add करें।",
  },
  {
    icon: "⚠️",
    title: "Duplicate Guest Detection",
    desc: "अगर आप गलती से same name + same village वाला guest दोबारा add करें, तो warning popup आएगा। 'Add Anyway' करने पर नाम (1) format में save होगा।",
    howTo: "Automatic — Guest Add करते समय अगर match मिला तो popup दिखेगा। 'Edit Name' से नाम बदलकर distinguish कर सकते हैं।",
  },
  {
    icon: "🔔",
    title: "Already Contributed Warning",
    desc: "अगर कोई guest पहले से contribute कर चुका है और आप दोबारा record करें, तो popup आएगा — 'Update Amount' (final total) या 'Cancel'।",
    howTo: "Automatic — contribution record करते समय trigger होता है। Amount field में final total amount डालें (additional नहीं)।",
  },
  {
    icon: "🎨",
    title: "Three Wedding Themes",
    desc: "तीन खूबसूरत wedding themes — Redish (लाल), Pink (गुलाबी), Purple (बैंगनी)। कभी भी switch करें, पूरा UI adapt हो जाता है।",
    howTo: "Landing page या Dashboard header में Theme Switcher use करें।",
  },
  {
    icon: "📊",
    title: "Attendance Progress Bar",
    desc: "शादी के दिन live animated progress bar — दिखाता है कि कितने % मेहमान आ चुके (attended/total). हर record के बाद real-time update।",
    howTo: "Wedding Day page पर automatically दिखता है — कोई setup required नहीं।",
  },
];

const FeaturesSection = () => {
  return (
    <section className="htu-features htu-theme-purple">
      <h2 className="htu-section-title">✨ सभी Features विस्तार से</h2>
      <div className="htu-features-list">
        {features.map((f, i) => (
          <div key={i} className="htu-feature-detail">
            <div className="htu-feature-header">
              <span className="htu-feature-icon">{f.icon}</span>
              <h4>{f.title}</h4>
            </div>
            <p className="htu-feature-desc">{f.desc}</p>
            <div className="htu-feature-howto">
              <strong>कैसे करें:</strong> {f.howTo}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
