import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnimatedBackground from "./components/common/AnimatedBackground";
import ThemeSwitcher from "./components/common/ThemeSwitcher";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import WeddingEventPage from "./pages/WeddingEventPage";
import ThankYouPage from "./pages/ThankYouPage";
import HowToUsePage from "./pages/HowToUsePage";
import AuthModal from "./components/AuthModal";
import "./styles/index.css";

function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedWeddingId, setSelectedWeddingId] = useState(null);
  const [showHowToUse, setShowHowToUse] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Check inactivity on page load
      const lastActive = parseInt(localStorage.getItem("lastActive") || "0");
      const twoHours = 2 * 60 * 60 * 1000;
      if (lastActive && Date.now() - lastActive > twoHours) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("lastActive");
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }
      localStorage.setItem("lastActive", Date.now().toString());
    }
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  // Track user activity — reset inactivity timer on any interaction
  useEffect(() => {
    if (!isLoggedIn) return;
    const updateActive = () => localStorage.setItem("lastActive", Date.now().toString());
    const events = ["click", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, updateActive, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, updateActive));
  }, [isLoggedIn]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
        window.history.pushState(null, "", window.location.href);
      }
    };

    if (isLoggedIn) {
      for (let i = 0; i < 5; i++) {
        window.history.pushState(null, "", window.location.href);
      }
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

  const handleAuthClose = () => {
    setShowAuthModal(false);
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  const handleGoToWeddingEvent = (weddingId) => {
    setSelectedWeddingId(weddingId);
    setCurrentView("event");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedWeddingId(null);
  };

  if (loading) return null;

  return (
    <Routes>
      {/* Public route: Thank You Page (accessible from QR code) */}
      <Route path="/thank-you" element={<ThankYouPage />} />

      {/* Protected/Main routes */}
      <Route
        path="*"
        element={
          <div className="app">
            <AnimatedBackground />
            {!isLoggedIn && !showHowToUse && <ThemeSwitcher />}
            {isLoggedIn ? (
              currentView === "dashboard" ? (
                <Dashboard onGoToWeddingEvent={handleGoToWeddingEvent} />
              ) : currentView === "event" ? (
                <WeddingEventPage
                  weddingId={selectedWeddingId}
                  onBackClick={handleBackToDashboard}
                />
              ) : null
            ) : showHowToUse ? (
              <HowToUsePage onBack={() => setShowHowToUse(false)} />
            ) : (
              <>
                <Landing onLoginClick={handleLoginClick} onHowToUseClick={() => setShowHowToUse(true)} />
                <AuthModal isOpen={showAuthModal} onClose={handleAuthClose} />
              </>
            )}
          </div>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
