import React, { useState } from "react";
import api from "../../utils/api";

const GuestAddForm = ({ weddingId, user, onGuestAdded, onClose, guests }) => {
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [tag, setTag] = useState("other");
  const [priority, setPriority] = useState(3);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [editingGuestId, setEditingGuestId] = useState(null);

  const resetForm = () => {
    setName(""); setVillage(""); setMobileNumber("");
    setTag("other"); setPriority(3); setEditingGuestId(null); setFormMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage("");
    if (!name.trim() || !village.trim()) { setFormMessage("Name and village required"); return; }
    if (mobileNumber && !/^\d{10}$/.test(mobileNumber.replace(/\D/g, ""))) { setFormMessage("Mobile must be 10 digits"); return; }

    setFormLoading(true);
    try {
      const payload = { name: name.trim(), village: village.trim(), mobileNumber: mobileNumber || null, tag, priority: parseInt(priority) };
      if (editingGuestId) {
        await api.put(`/api/guests/${editingGuestId}`, payload);
        setFormMessage("Guest updated!");
      } else {
        await api.post("/api/guests/create", { ...payload, userId: user.id, weddingId });
        setFormMessage("Guest added!");
      }
      setTimeout(() => { resetForm(); onGuestAdded(); }, 800);
    } catch (err) {
      setFormMessage(err.response?.data?.message || "Error saving guest");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (guest) => {
    setName(guest.name); setVillage(guest.village);
    setMobileNumber(guest.mobileNumber || ""); setTag(guest.tag);
    setPriority(guest.priority); setEditingGuestId(guest._id); setFormMessage("");
  };

  const getUniqueSuggestions = (field) => {
    const values = new Set();
    guests.forEach((g) => { if (g[field]) values.add(g[field]); });
    return Array.from(values).sort();
  };

  return {
    formJSX: (
      <div className="guest-form-inline">
        <div className="guest-form-header">
          <span className="guest-form-title">{editingGuestId ? "Edit Guest" : "Add Guest"}</span>
          <button type="button" onClick={onClose} className="guest-close-btn">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="inline-form">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="👤 Guest name" list="nameList" required />
          <datalist id="nameList">{getUniqueSuggestions("name").map((s) => <option key={s} value={s} />)}</datalist>
          <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="📍 Village" list="villageList" required />
          <datalist id="villageList">{getUniqueSuggestions("village").map((s) => <option key={s} value={s} />)}</datalist>
          <input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="📱 Mobile" maxLength="10" />
          <select value={tag} onChange={(e) => setTag(e.target.value)}>
            <option value="friend">👫 Friend</option>
            <option value="family">👨‍👩‍👧 Family</option>
            <option value="relative">🧑‍🤝‍🧑 Relative</option>
            <option value="neighbour">🏘️ Neighbour</option>
            <option value="other">✨ Other</option>
          </select>
          <div className="priority-inline">
            {[1, 2, 3].map((p) => (
              <label key={p}><input type="radio" checked={priority === p} onChange={() => setPriority(p)} />{p}</label>
            ))}
          </div>
          <button type="submit" disabled={formLoading} className="add-guest-submit-btn">
            {formLoading ? "..." : editingGuestId ? "Update" : "Add Guest"}
          </button>
          {editingGuestId && <button type="button" onClick={resetForm} className="cancel-edit-btn">Cancel</button>}
        </form>
        {formMessage && <div className={formMessage.includes("added") || formMessage.includes("updated") ? "form-success" : "form-error"}>{formMessage}</div>}
      </div>
    ),
    handleEdit,
  };
};

export default GuestAddForm;
