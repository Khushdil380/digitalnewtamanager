import React from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import ProfileDropdown from "./ProfileDropdown";
import "../styles/DashboardHeader.css";

export default function DashboardHeader({
  user,
  onProfileClick,
  onLogoutClick,
}) {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <span className="header-logo-icon">💍</span>
        <h1 className="header-title">DigitalNewtaManager</h1>
      </div>

      <div className="header-center">
        <ThemeSwitcher compact={true} />
      </div>

      <div className="header-right">
        <ProfileDropdown
          user={user}
          onProfileClick={onProfileClick}
          onLogoutClick={onLogoutClick}
        />
      </div>
    </header>
  );
}
