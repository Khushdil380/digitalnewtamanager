import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../styles/QRCodeSection.css";

const QRCodeSection = ({ brideName, groomName, weddingId }) => {
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [tempUpiId, setTempUpiId] = useState("");
  const [tempMessage, setTempMessage] = useState(
    `Happy wedding ${brideName} and ${groomName}`,
  );
  const [qrLink, setQrLink] = useState(
    `https://digitalnewtamanager.vercel.app/thank-you?bride=${brideName}&groom=${groomName}&weddingId=${weddingId}`,
  );
  const [isCustomQr, setIsCustomQr] = useState(false);

  useEffect(() => {
    if (isCustomQr) {
      const timer = setTimeout(() => {
        setQrLink(
          `https://digitalnewtamanager.vercel.app/thank-you?bride=${brideName}&groom=${groomName}&weddingId=${weddingId}`,
        );
        setAmount("");
        setIsCustomQr(false);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [isCustomQr, brideName, groomName, weddingId]);

  const generateUpiQrLink = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter amount greater than 0");
      return;
    }

    const payeeName = `${brideName} and ${groomName} wedding`;
    const upiLink = `upi://pay?pa=${tempUpiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(tempMessage)}`;
    setQrLink(upiLink);
    setIsCustomQr(true);
  };

  return (
    <div className="qr-section">
      <div className="qr-header-simple">
        <div className="qr-title">💳 QR Code</div>
        <button
          className="qr-settings-btn"
          onClick={() => setShowSettings(true)}
          title="Settings"
        >
          ⚙️
        </button>
      </div>

      <div className="qr-code-display">
        <QRCodeCanvas value={qrLink} size={240} level="H" includeMargin />
        {isCustomQr && <div className="qr-custom-badge">Custom</div>}
      </div>

      <div className="qr-amount-row">
        <input
          type="number"
          min="1"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="qr-amount-input"
        />
        <button
          onClick={generateUpiQrLink}
          className="qr-generate-btn"
          disabled={!amount || parseFloat(amount) <= 0}
        >
          Generate QR
        </button>
      </div>

      {showSettings && (
        <div className="qr-settings-overlay">
          <div className="qr-settings-box">
            <div className="qr-settings-header">
              <h4>UPI Settings</h4>
              <button
                className="qr-close-btn"
                onClick={() => setShowSettings(false)}
              >
                ✕
              </button>
            </div>
            <div className="qr-settings-body">
              <label>UPI ID</label>
              <input
                type="text"
                value={tempUpiId}
                onChange={(e) => setTempUpiId(e.target.value)}
                placeholder="8809059380@axl"
              />
              <label>Message</label>
              <input
                type="text"
                value={tempMessage}
                onChange={(e) => setTempMessage(e.target.value)}
              />
              <button
                onClick={() => {
                  setUpiId(tempUpiId);
                  setShowSettings(false);
                }}
                className="qr-save-btn"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeSection;
