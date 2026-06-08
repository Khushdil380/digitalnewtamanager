import React, { useState } from "react";
import api from "../../utils/api";
import "../../styles/guest/GuestAddForm.css";

const GuestAddForm = ({ weddingId, user, onGuestAdded, onClose, guests }) => {
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [tag, setTag] = useState("other");
  const [priority, setPriority] = useState(3);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [editingGuestId, setEditingGuestId] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [nameSuggestions, setNameSuggestions] = useState([]);

  const resetForm = () => {
    setName(""); setVillage(""); setMobileNumber("");
    setTag("other"); setPriority(3); setEditingGuestId(null);
    setFormMessage(""); setDuplicateWarning(null); setNameSuggestions([]);
  };

  const getNameSuggestions = (input) => {
    if (!input.trim()) return [];
    const q = input.toLowerCase();
    const seen = new Set();
    return guests
      .filter((g) => g.name.toLowerCase().includes(q))
      .filter((g) => { if (seen.has(g.name.toLowerCase())) return false; seen.add(g.name.toLowerCase()); return true; })
      .slice(0, 6)
      .map((g) => g.name);
  };

  const handleNameInput = (value) => {
    setName(value);
    setNameSuggestions(value.trim() ? getNameSuggestions(value) : []);
  };

  const handleSelectNameSuggestion = (suggestion) => {
    setName(suggestion);
    setNameSuggestions([]);
  };

  const checkDuplicate = () => {
    const trimName = name.trim().toLowerCase();
    const trimVillage = village.trim().toLowerCase();
    if (!trimName || !trimVillage) return null;
    return guests.find(
      (g) => g.name.toLowerCase() === trimName && g.village.toLowerCase() === trimVillage
    );
  };

  const getNextNumberedName = (baseName, villageName) => {
    const trimName = baseName.trim().toLowerCase();
    const trimVillage = villageName.trim().toLowerCase();
    let maxNum = 0;
    guests.forEach((g) => {
      const gName = g.name.toLowerCase();
      const gVillage = g.village.toLowerCase();
      if (gVillage === trimVillage) {
        if (gName === trimName) maxNum = Math.max(maxNum, 1);
        const match = gName.match(new RegExp(`^${trimName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\((\\d+)\\)$`));
        if (match) maxNum = Math.max(maxNum, parseInt(match[1]) + 1);
      }
    });
    return `${name.trim()} (${maxNum})`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage("");
    if (!name.trim() || !village.trim()) { setFormMessage("Name and village required"); return; }
    if (mobileNumber && !/^\d{10}$/.test(mobileNumber.replace(/\D/g, ""))) { setFormMessage("Mobile must be 10 digits"); return; }

    // Check for duplicate (only when adding new, not editing)
    if (!editingGuestId) {
      const duplicate = checkDuplicate();
      if (duplicate) {
        setDuplicateWarning(duplicate);
        return;
      }
    }

    await submitGuest(name.trim());
  };

  const submitGuest = async (finalName) => {
    setFormLoading(true);
    setDuplicateWarning(null);
    try {
      const payload = { name: finalName, village: village.trim(), mobileNumber: mobileNumber || null, tag, priority: parseInt(priority) };
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

  const handleAddAnyway = () => {
    const numberedName = getNextNumberedName(name.trim(), village.trim());
    submitGuest(numberedName);
  };

  const handleEditInstead = () => {
    setDuplicateWarning(null);
    // Focus stays on form so user can modify the name
  };

  const handleEdit = (guest) => {
    setName(guest.name); setVillage(guest.village);
    setMobileNumber(guest.mobileNumber || ""); setTag(guest.tag);
    setPriority(guest.priority); setEditingGuestId(guest._id); setFormMessage("");
    setDuplicateWarning(null); setNameSuggestions([]);
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
          <div className="input-with-suggestions" style={{ position: "relative" }}>
            <input type="text" value={name} onChange={(e) => handleNameInput(e.target.value)} onBlur={() => setTimeout(() => setNameSuggestions([]), 150)} placeholder="👤 Guest name" required />
            {nameSuggestions.length > 0 && (
              <div className="name-suggestions-dropdown">
                {nameSuggestions.map((s, i) => (
                  <div key={i} className="name-suggestion-item" onMouseDown={() => handleSelectNameSuggestion(s)}>{s}</div>
                ))}
              </div>
            )}
          </div>
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

        {/* Duplicate Warning Popup */}
        {duplicateWarning && (
          <div className="duplicate-popup-overlay">
            <div className="duplicate-popup-box">
              <p className="duplicate-popup-icon">⚠️</p>
              <p className="duplicate-popup-msg"><strong>"{duplicateWarning.name}"</strong> from <strong>"{duplicateWarning.village}"</strong> already exists!</p>
              <p className="duplicate-popup-hint">Adding will save as "{name.trim()} (1)" format</p>
              <div className="duplicate-popup-actions">
                <button type="button" onClick={handleAddAnyway} className="add-guest-submit-btn">Add Anyway</button>
                <button type="button" onClick={handleEditInstead} className="cancel-edit-btn">Edit Name</button>
              </div>
            </div>
          </div>
        )}
      </div>
    ),
    handleEdit,
  };
};

export default GuestAddForm;
