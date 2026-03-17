import React, { useState, useRef, useEffect } from "react";
import "../styles/ProfileDropdown.css";

export default function ProfileDropdown({
  user,
  onProfileClick,
  onLogoutClick,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    onProfileClick();
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    onLogoutClick();
    setIsOpen(false);
  };

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button
        className="profile-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="profile-name">{user?.fullName}</span>
        <div className="profile-avatar">
          {user?.avatar ? <span>{user.avatar}</span> : "👤"}
        </div>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={handleProfileClick}>
            👤 Profile
          </button>
          <button className="dropdown-item logout" onClick={handleLogoutClick}>
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}
