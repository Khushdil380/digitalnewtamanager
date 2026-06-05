import React from "react";
import "../../styles/progress/AttendanceBar.css";

const AttendanceBar = ({ attended, total }) => {
  const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

  return (
    <div className="attendance-bar-container">
      <div className="attendance-bar-track">
        <div className="attendance-bar-fill" style={{ width: `${percentage}%` }}>
          <span className="attendance-bar-glow" />
        </div>
      </div>
      <div className="attendance-bar-label">
        <span>🎉 {attended}/{total} attended</span>
        <span className="attendance-bar-percent">{percentage}%</span>
      </div>
    </div>
  );
};

export default AttendanceBar;
