import React, { useState, useEffect, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../../styles/event/QRCodeSection.css";

const QRCodeSection = ({ brideName, groomName, weddingId }) => {
  const [upiId, setUpiId] = useState(() => localStorage.getItem("upiId") || "");
  const [message, setMessage] = useState(() =>
    localStorage.getItem("upiMessage") || `Happy wedding ${brideName} and ${groomName}`
  );
  const [amount, setAmount] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [tempUpiId, setTempUpiId] = useState(upiId);
  const [tempMessage, setTempMessage] = useState(message);
  const [isCustomQr, setIsCustomQr] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");

  const defaultLink = `https://digitalnewtamanager.vercel.app/thank-you?bride=${brideName}&groom=${groomName}&weddingId=${weddingId}`;
  const [qrLink, setQrLink] = useState(defaultLink);

  // Countdown timer
  useEffect(() => {
    if (!isCustomQr || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setQrLink(defaultLink);
          setIsCustomQr(false);
          setAmount("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isCustomQr, countdown, defaultLink]);

  const handleSaveSettings = () => {
    if (!tempUpiId.trim()) return;
    setUpiId(tempUpiId.trim());
    setMessage(tempMessage.trim());
    localStorage.setItem("upiId", tempUpiId.trim());
    localStorage.setItem("upiMessage", tempMessage.trim());
    setShowSettings(false);
    setError("");
  };

  const generateUpiQr = useCallback(() => {
    setError("");
    if (!upiId) {
      setError("Set UPI ID first (⚙️)");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError("Enter valid amount");
      return;
    }
    const payeeName = `${brideName} and ${groomName} wedding`;
    const link = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(message)}`;
    setQrLink(link);
    setIsCustomQr(true);
    setCountdown(30);
  }, [upiId, amount, brideName, groomName, message]);

  return (
    <div className="qr-section">
      <div className="qr-header-simple">
        <div className="qr-title">💳 QR Code</div>
        <button className="qr-settings-btn" onClick={() => setShowSettings(true)} title="UPI Settings">⚙️</button>
      </div>

      {isCustomQr && (
        <div className="qr-countdown">
          <span className="countdown-num">{countdown}</span>
          <span className="countdown-label">sec</span>
        </div>
      )}

      <div className="qr-code-display">
        <QRCodeCanvas value={qrLink} size={200} level="H" includeMargin style={{ width: "100%", height: "auto", maxWidth: "200px" }} />
      </div>

      {upiId && (
        <div className="qr-upi-display">{upiId.length > 20 ? upiId.slice(0, 20) + "…" : upiId}</div>
      )}

      {error && <div className="qr-error">{error}</div>}

      <div className="qr-amount-row">
        <input
          type="number"
          min="1"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="qr-amount-input"
        />
        <button onClick={generateUpiQr} className="qr-generate-btn">
          Generate QR
        </button>
      </div>

      {showSettings && (
        <div className="qr-settings-overlay">
          <div className="qr-settings-box">
            <div className="qr-settings-header">
              <h4>UPI Settings</h4>
              <button className="qr-close-btn" onClick={() => setShowSettings(false)}>✕</button>
            </div>
            <div className="qr-settings-body">
              <label>UPI ID *</label>
              <input type="text" value={tempUpiId} onChange={(e) => setTempUpiId(e.target.value)} placeholder="8809059380@axl" />
              <label>Transaction Message</label>
              <input type="text" value={tempMessage} onChange={(e) => setTempMessage(e.target.value)} />
              <button onClick={handleSaveSettings} className="qr-save-btn" disabled={!tempUpiId.trim()}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeSection;
