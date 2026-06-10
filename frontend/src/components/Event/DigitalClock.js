import { useState, useEffect } from "react";
import "../../styles/event/DigitalClock.css";

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours24 = time.getHours();
  const hours = hours24 % 12 || 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const period = hours24 >= 12 ? "PM" : "AM";

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="digital-clock">
      <span className="clock-digits">{pad(hours)}</span>
      <span className="clock-separator">:</span>
      <span className="clock-digits">{pad(minutes)}</span>
      <span className="clock-separator">:</span>
      <span className="clock-digits">{pad(seconds)}</span>
      <span className="clock-period">{period}</span>
    </div>
  );
};

export default DigitalClock;
