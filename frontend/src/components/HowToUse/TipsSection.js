import React from "react";
import "../../styles/howToUse/TipsSection.css";

const TipsSection = () => {
  return (
    <section className="htu-tips htu-theme-red">
      <h2 className="htu-section-title">💡 Pro Tips</h2>
      <div className="htu-tips-grid">
        <div className="htu-tip-card">
          <span>📅</span>
          <p><strong>कार्ड बांटते समय ही</strong> guest list बनाएं — शादी के दिन time बचेगा, नाम auto-suggest होगा।</p>
        </div>
        <div className="htu-tip-card">
          <span>⭐</span>
          <p><strong>Priority use करें</strong> — VIP guests को Priority 1 दें, जल्दी filter और find कर पाएंगे।</p>
        </div>
        <div className="htu-tip-card">
          <span>📱</span>
          <p><strong>Mobile number add करें</strong> — जिन्हें thank you SMS भेजना है उनका number जरूर डालें।</p>
        </div>
        <div className="htu-tip-card">
          <span>💒</span>
          <p><strong>Multiple weddings</strong> — हर शादी का अलग entry बनाएं, सब independent है।</p>
        </div>
        <div className="htu-tip-card">
          <span>📄</span>
          <p><strong>शादी से पहले Export करें</strong> — PDF backup print रखें, बिजली/internet गई तो काम आएगी।</p>
        </div>
        <div className="htu-tip-card">
          <span>💬</span>
          <p><strong>SMS पहले setup करें</strong> — Profile → SMS tab में httpSMS configure करें ताकि wedding day पर seamless चले।</p>
        </div>
        <div className="htu-tip-card">
          <span>🔒</span>
          <p><strong>Auto-logout</strong> — Security के लिए 2 घंटे inactivity पर automatic logout हो जाता है।</p>
        </div>
        <div className="htu-tip-card">
          <span>🎉</span>
          <p><strong>Celebration OFF करें</strong> — अगर fast recording कर रहे हैं तो emoji burst OFF कर दें, distraction कम।</p>
        </div>
      </div>
    </section>
  );
};

export default TipsSection;
