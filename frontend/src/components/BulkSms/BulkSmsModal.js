import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import RecipientSelector from "./RecipientSelector";
import { DEFAULT_TEMPLATES, MESSAGE_LABELS } from "./MessageTemplates";
import api from "../../utils/api";
import "../../styles/bulkSms/BulkSmsModal.css";

const BulkSmsModal = ({ isOpen, onClose, weddingId, guests }) => {
  const [messageType, setMessageType] = useState("card");
  const [message, setMessage] = useState(DEFAULT_TEMPLATES.card);
  const [selectedIds, setSelectedIds] = useState([]);
  const [smsLogs, setSmsLogs] = useState([]);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (isOpen && weddingId) {
      api.get(`/api/bulk-sms/logs/${weddingId}`)
        .then(({ data }) => setSmsLogs(data.logs || []))
        .catch(() => {});
    }
  }, [isOpen, weddingId]);

  useEffect(() => {
    setMessage(DEFAULT_TEMPLATES[messageType]);
    setSelectedIds([]);
    setResult("");
  }, [messageType]);

  const handleSend = async () => {
    if (selectedIds.length === 0) { setResult("⚠️ Select at least one recipient"); return; }
    setSending(true);
    setResult("");
    try {
      const { data } = await api.post("/api/bulk-sms/send-bulk", {
        userId: user.id,
        weddingId,
        guestIds: selectedIds,
        messageType,
        message,
      });
      setResult(`✅ ${data.message}`);
      setSelectedIds([]);
      // Refresh logs
      api.get(`/api/bulk-sms/logs/${weddingId}`)
        .then(({ d }) => setSmsLogs(d.logs || []))
        .catch(() => {});
    } catch (err) {
      setResult(`❌ ${err.response?.data?.message || "Failed to send"}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="bulk-sms-modal">
        <h2 className="bulk-sms-title">📨 Bulk SMS</h2>

        <div className="bulk-sms-type-selector">
          {Object.entries(MESSAGE_LABELS).map(([key, label]) => (
            <button
              key={key}
              className={`type-btn ${messageType === key ? "active" : ""}`}
              onClick={() => setMessageType(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="bulk-sms-content">
          <div className="bulk-sms-message-section">
            <label className="bulk-sms-label">Message ({"{name}"} = guest name):</label>
            <textarea
              className="bulk-sms-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              maxLength={1000}
            />
          </div>

          <div className="bulk-sms-recipients-section">
            <label className="bulk-sms-label">Recipients (only guests with mobile):</label>
            <RecipientSelector
              guests={guests}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              smsLogs={smsLogs}
              messageType={messageType}
            />
          </div>
        </div>

        {result && <div className="bulk-sms-result">{result}</div>}

        <button className="bulk-sms-send-btn" onClick={handleSend} disabled={sending || selectedIds.length === 0}>
          {sending ? "Sending..." : `Send to ${selectedIds.length} guest${selectedIds.length !== 1 ? "s" : ""}`}
        </button>
      </div>
    </Modal>
  );
};

export default BulkSmsModal;
