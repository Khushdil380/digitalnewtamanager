import React, { useState, useEffect } from "react";
import useContributionForm from "./useContributionForm";
import Modal from "../common/Modal";
import api from "../../utils/api";
import "../../styles/event/ContributionForm.css";

const ContributionForm = ({ weddingId, userId, onContributionRecorded, brideName, groomName }) => {
  const {
    formData, setFormData, suggestions, loading, message, error,
    alreadyContributed,
    handleNameChange, handleSelectName, handleVillageChange, handleSelectVillage,
    handlePaymentTypeChange, handleSubmit, handleUpdateAmount, handleCancelDuplicate,
  } = useContributionForm(weddingId, userId, onContributionRecorded);

  const [smsOn, setSmsOn] = useState(() => localStorage.getItem("smsThankYou") === "on");
  const [smsCount, setSmsCount] = useState(() => parseInt(localStorage.getItem("smsCount") || "0"));
  const [smsConfigured, setSmsConfigured] = useState(false);
  const [smsWarning, setSmsWarning] = useState("");
  const [showMsgEditor, setShowMsgEditor] = useState(false);
  const [customMsg, setCustomMsg] = useState(() =>
    localStorage.getItem("smsCustomMsg") || `आपका बहुत बहुत शुक्रिया {name} जी, ${brideName || ""} और ${groomName || ""} की शादी में शामिल होकर इस दिन को और भी यादगार बनाने के लिए, आपकी मौजूदगी, प्यार और आशीर्वाद ने इस दिन को हमारे जीवन का सबसे खूबसूरत पल बना दिया। हम इस नई शुरुआत में आपकी शुभकामनाओं को हमेशा संजोकर रखेंगे।\n\nआप आए तो महफ़िल में निखार आ गया, हर तरफ खुशियों का खुमार आ गया।\nदिल से करते हैं हम आपका शुक्रिया,\nआपके आने से हमारी शादी में बहार आ गया।\n\nएक बार फिर से आपका तहे दिल से शुक्रिया। 🙏`
  );

  useEffect(() => {
    if (brideName && groomName && !localStorage.getItem("smsCustomMsg")) {
      const defaultMsg = `आपका बहुत बहुत शुक्रिया {name} जी, ${brideName} और ${groomName} की शादी में शामिल होकर इस दिन को और भी यादगार बनाने के लिए, आपकी मौजूदगी, प्यार और आशीर्वाद ने इस दिन को हमारे जीवन का सबसे खूबसूरत पल बना दिया। हम इस नई शुरुआत में आपकी शुभकामनाओं को हमेशा संजोकर रखेंगे।\n\nआप आए तो महफ़िल में निखार आ गया, हर तरफ खुशियों का खुमार आ गया।\nदिल से करते हैं हम आपका शुक्रिया,\nआपके आने से हमारी शादी में बहार आ गया।\n\nएक बार फिर से आपका तहे दिल से शुक्रिया। 🙏`;
      setCustomMsg(defaultMsg);
      localStorage.setItem("smsCustomMsg", defaultMsg);
    }
  }, [brideName, groomName]);

  useEffect(() => {
    const handleSmsCount = () => setSmsCount(parseInt(localStorage.getItem("smsCount") || "0"));
    window.addEventListener("smsCountUpdated", handleSmsCount);
    return () => window.removeEventListener("smsCountUpdated", handleSmsCount);
  }, []);

  useEffect(() => {
    if (userId) {
      api.get(`/api/sms/settings/${userId}`)
        .then(({ data }) => setSmsConfigured(data.isConfigured))
        .catch(() => setSmsConfigured(false));
    }
  }, [userId]);

  const toggleSms = () => {
    if (!smsOn && !smsConfigured) {
      setSmsWarning("⚠️ Please setup SMS first in Profile → SMS tab");
      setTimeout(() => setSmsWarning(""), 5000);
      return;
    }
    const newVal = !smsOn;
    setSmsOn(newVal);
    localStorage.setItem("smsThankYou", newVal ? "on" : "off");
  };

  const saveCustomMsg = () => {
    localStorage.setItem("smsCustomMsg", customMsg);
    setShowMsgEditor(false);
  };

  return (
    <div className="contribution-form-container">
      <form onSubmit={handleSubmit} className="contribution-form">
        <div className="form-group">
          <label>Name *</label>
          <div className="input-with-suggestions">
            <input type="text" placeholder="Enter guest name" value={formData.guestName} onChange={(e) => handleNameChange(e.target.value)} className="form-input" />
            {suggestions.names.length > 0 && (
              <div className="suggestions-list">
                {suggestions.names.map((s, i) => (
                  <div key={i} className={`suggestion-item ${s.attended ? "suggestion-attended" : ""}`} onClick={() => handleSelectName(s)}>
                    {s.attended && <span className="suggestion-check" title="Already contributed">✅</span>}
                    {s.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Village/City *</label>
          <div className="input-with-suggestions">
            <input type="text" placeholder="Enter village/city" value={formData.village} onChange={(e) => handleVillageChange(e.target.value)} className="form-input" />
            {suggestions.villages.length > 0 && (
              <div className="suggestions-list">
                {suggestions.villages.map((v, i) => (
                  <div key={i} className="suggestion-item" onClick={() => handleSelectVillage(v)}>{v}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Amount {formData.paymentType === "envelope" ? "(optional)" : "*"}</label>
          <input type="number" placeholder={formData.paymentType === "envelope" ? "0 (envelope)" : "Enter amount"} value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="form-input" min="0" />
        </div>

        <div className="form-group">
          <label>Payment Type *</label>
          <div className="radio-group">
            <label className="radio-label"><input type="radio" checked={formData.paymentType === "cash"} onChange={() => handlePaymentTypeChange("cash")} />💵 Cash</label>
            <label className="radio-label"><input type="radio" checked={formData.paymentType === "upi"} onChange={() => handlePaymentTypeChange("upi")} />🔗 UPI</label>
            <label className="radio-label"><input type="radio" checked={formData.paymentType === "envelope"} onChange={() => handlePaymentTypeChange("envelope")} />✉️ Envelope</label>
          </div>
        </div>

        <div className="form-group">
          <label>Given By:</label>
          <div className="radio-group">
            <label className="radio-label"><input type="radio" checked={formData.givenBy === "personally"} onChange={() => setFormData({ ...formData, givenBy: "personally" })} />Personally</label>
            <label className="radio-label"><input type="radio" checked={formData.givenBy === "someone"} onChange={() => setFormData({ ...formData, givenBy: "someone" })} />By Someone</label>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        {/* Already Contributed Warning Popup */}
        {alreadyContributed && (
          <div className="duplicate-popup-overlay">
            <div className="duplicate-popup-box">
              <p className="duplicate-popup-icon">⚠️</p>
              <p className="duplicate-popup-msg"><strong>{alreadyContributed.name}</strong> has already contributed ₹{alreadyContributed.amount || 0}</p>
              <p className="duplicate-popup-hint">Enter the final total amount (not additional)</p>
              <div className="duplicate-popup-actions">
                <button type="button" onClick={handleUpdateAmount} className="warning-update-btn">Update Amount</button>
                <button type="button" onClick={handleCancelDuplicate} className="warning-cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="submit-row">
          <div className="sms-controls">
            <button type="button" className={`sms-toggle-btn ${smsOn ? "active" : ""}`} onClick={toggleSms} title={smsOn ? "SMS: ON" : "SMS: OFF"}>
              {smsOn ? "📩" : "✉️"}
              {smsCount > 0 && <span className="sms-badge">{smsCount}</span>}
            </button>
            <button type="button" className="sms-edit-btn" onClick={() => setShowMsgEditor(true)} title="Edit thank you message">
              ✏️
            </button>
            {smsWarning && <span className="sms-warning-toast">{smsWarning}</span>}
          </div>
          <button type="submit" disabled={loading || !!alreadyContributed} className="submit-btn">
            {loading ? "Recording..." : "✓ Record"}
          </button>
        </div>
      </form>

      {/* Custom Message Editor Modal */}
      <Modal isOpen={showMsgEditor} onClose={() => setShowMsgEditor(false)} size="medium">
        <div className="msg-editor">
          <h3 className="msg-editor-title">✏️ Custom Thank You Message</h3>
          <p className="msg-editor-hint">Use {"{name}"} to insert guest name automatically</p>
          <textarea
            className="msg-editor-input"
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            rows={4}
            maxLength={300}
          />
          <div className="msg-editor-actions">
            <button type="button" onClick={saveCustomMsg} className="sms-save-btn">Save Message</button>
            <button type="button" onClick={() => setShowMsgEditor(false)} className="warning-cancel-btn">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContributionForm;
