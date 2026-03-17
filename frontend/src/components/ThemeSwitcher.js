import React, { useState, useEffect } from "react";
import "../styles/ThemeSwitcher.css";

const ThemeSwitcher = ({ compact = false }) => {
  const [currentTheme, setCurrentTheme] = useState("red");
  const themes = ["red", "pink", "purple"];

  useEffect(() => {
    const savedTheme = localStorage.getItem("colorTheme") || "red";
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.className = `theme-${theme}`;
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem("colorTheme", theme);
    applyTheme(theme);
  };

  return (
    <div className={`theme-switcher-container ${compact ? "compact" : ""}`}>
      {themes.map((theme) => (
        <button
          key={theme}
          className={`theme-btn theme-btn-${theme} ${
            currentTheme === theme ? "active" : ""
          }`}
          onClick={() => handleThemeChange(theme)}
          title={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`}
        />
      ))}
    </div>
  );
};

export default ThemeSwitcher;
