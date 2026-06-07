import React from "react";
import "../../styles/howToUse/TipsSection.css";

const TipsSection = () => {
  return (
    <section className="htu-tips">
      <h2 className="htu-section-title">💡 Tips & Best Practices</h2>
      <ul className="htu-tips-list">
        <li><strong>Add guests early</strong> — When you distribute invitation cards, add guest names immediately. This saves time on the wedding day.</li>
        <li><strong>Use priority</strong> — Mark important guests as Priority 1 so you can quickly filter and find them.</li>
        <li><strong>Mobile numbers</strong> — Add mobile numbers for guests you want to send thank you SMS to.</li>
        <li><strong>Multiple weddings</strong> — If you have multiple family weddings, create separate entries. Each has its own guest list and contributions.</li>
        <li><strong>Export before the event</strong> — Export your guest list as PDF before the wedding for a printed backup.</li>
        <li><strong>SMS setup</strong> — Configure httpSMS in Profile → SMS tab before the wedding day so auto thank you messages work seamlessly.</li>
        <li><strong>2-hour auto logout</strong> — For security, the app logs out after 2 hours of inactivity.</li>
      </ul>
    </section>
  );
};

export default TipsSection;
