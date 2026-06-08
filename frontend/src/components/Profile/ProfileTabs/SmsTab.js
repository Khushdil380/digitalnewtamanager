import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import "../../../styles/profile/SmsTab.css";

const SmsTab = ({ user }) => {
  const [apiKey, setApiKey] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const [testNumber, setTestNumber] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user?.id) {
      api.get(`/api/sms/settings/${user.id}`)
        .then(({ data }) => {
          setIsConfigured(data.isConfigured);
          if (data.smsPhoneNumber) setPhoneNumber(data.smsPhoneNumber);
        })
        .catch(() => {});
    }
  }, [user]);

  const handleSave = async () => {
    if (!apiKey && !isConfigured) { setMessage("API key is required"); return; }
    if (!phoneNumber) { setMessage("Phone number is required"); return; }
    setLoading(true);
    setMessage("");
    try {
      const payload = { userId: user.id, smsPhoneNumber: phoneNumber };
      if (apiKey) payload.smsApiKey = apiKey;
      const { data } = await api.post("/api/sms/settings", payload);
      setMessage(data.message);
      setIsConfigured(true);
      setApiKey("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  const handleTestSend = async () => {
    if (!testNumber.trim()) { setMessage("Enter a test number"); return; }
    setSending(true);
    setMessage("");
    try {
      const { data } = await api.post("/api/sms/send", {
        userId: user.id,
        to: testNumber,
        message: "✅ This is a test message from DigitalNewtaManager. Your SMS setup is working correctly!",
      });
      setMessage(data.success ? "✅ Test SMS sent!" : data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to send. Check your setup.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="tab-section">
      <h3 className="tab-title">💬 SMS Setup (httpSMS)</h3>

      <div className="sms-instructions">
        <p className="instruction-title">Setup Instructions:</p>
        <ol>
          <li>Create an account on <a href="https://httpsms.com/login" target="_blank" rel="noopener noreferrer">httpsms.com</a> and obtain your API key from Settings page</li>
          <li>Download the Android app from <a href="https://httpsms.com/threads/" target="_blank" rel="noopener noreferrer">httpsms.com/threads</a> (login to download APK)</li>
          <li>Open the app, login with same account, and grant SMS permissions</li>
          <li>Enter your mobile number (with +91) and API key below</li>
        </ol>
      </div>

      <div className="sms-form">
        <label className="input-label">API Key {isConfigured && <span className="configured-badge">✓ Configured</span>}</label>
        <input
          type="password"
          placeholder={isConfigured ? "••••(saved) — enter new to update" : "Paste your httpSMS API key"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="sms-input"
        />

        <label className="input-label">Sender Phone Number</label>
        <input
          type="text"
          placeholder="+917759898972"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="sms-input"
        />

        <button onClick={handleSave} disabled={loading} className="sms-save-btn">
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {message && <div className="sms-message">{message}</div>}

      {isConfigured && (
        <div className="sms-test-row">
          <input
            type="text"
            placeholder="Test number (e.g. 7759898972)"
            value={testNumber}
            onChange={(e) => setTestNumber(e.target.value)}
            className="sms-input sms-test-input"
          />
          <button onClick={handleTestSend} disabled={sending} className="sms-save-btn sms-test-send">
            {sending ? "..." : "Send Test"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SmsTab;
