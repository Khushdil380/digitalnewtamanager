import React from "react";
import "../../styles/howToUse/HeroSection.css";

const HeroSection = () => {
  return (
    <section className="htu-hero htu-theme-red">
      <div className="htu-hero-badge">💍 DigitalNewtaManager</div>
      <h1 className="htu-hero-title">शादी का हिसाब, अब डिजिटल!</h1>
      <p className="htu-hero-subtitle">Complete Guide to Managing Your Wedding Guests & Contributions</p>

      <div className="htu-hero-card">
        <h3>💡 "Newta" क्या है?</h3>
        <p>
          भारतीय शादियों में, खासकर मध्यमवर्गीय और ग्रामीण परिवारों में, शादी के दिन एक व्यक्ति रजिस्टर लेकर बैठता है। जैसे-जैसे मेहमान आते हैं, वे <strong>न्यौता (Newta)</strong> देते हैं — यानी शगुन की राशि। उनका नाम, गाँव और राशि दर्ज की जाती है।
        </p>
        <p>
          कुछ लोग कैश देते हैं, कुछ लिफाफे में, कुछ UPI से। कुछ खुद आते हैं, कुछ किसी और के हाथ भेजते हैं। यह परंपरा पीढ़ियों से कागज पर चली आ रही है।
        </p>
        <p className="htu-hero-highlight">
          🚀 <strong>DigitalNewtaManager</strong> इस पूरी प्रक्रिया को डिजिटल बनाता है — निमंत्रण कार्ड बांटने से लेकर शादी के दिन के रजिस्टर तक।
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
