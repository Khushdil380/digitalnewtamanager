import React, { useState, useEffect } from "react";
import axios from "axios";
import GuestCard from "./GuestCard";
import GuestFilters from "./GuestFilters";
import "../styles/GuestList.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const GuestList = ({ weddingId, onClose, hideAddForm = false }) => {
  const [guests, setGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("added");
  const [groupBy, setGroupBy] = useState("none");

  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [tag, setTag] = useState("other");
  const [priority, setPriority] = useState(3);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [editingGuestId, setEditingGuestId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchGuests();
  }, [weddingId]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [guests, searchQuery, sortBy, groupBy]);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/guests/wedding/${weddingId}`,
      );
      setGuests(response.data.guests || []);
      setError("");
    } catch (err) {
      setError("Failed to load guests");
      console.error("Fetch guests error:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...guests];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (guest) =>
          guest.name.toLowerCase().includes(query) ||
          guest.village.toLowerCase().includes(query) ||
          (guest.mobileNumber && guest.mobileNumber.includes(query)) ||
          (guest.contributionAmount &&
            guest.contributionAmount.toString().includes(query)),
      );
    }

    // Sort
    switch (sortBy) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "priority":
        result.sort((a, b) => a.priority - b.priority);
        break;
      case "village":
        result.sort((a, b) => a.village.localeCompare(b.village));
        break;
      case "addedEarlier":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "addedWeddingDay":
        result = result.filter((g) => g.addedOn === "onWeddingDay");
        break;
      case "attended":
        result = result.filter((g) => g.attendedStatus === "attended");
        break;
      case "notAttended":
        result = result.filter((g) => g.attendedStatus !== "attended");
        break;
      case "amount":
        result.sort(
          (a, b) => (b.contributionAmount || 0) - (a.contributionAmount || 0),
        );
        break;
      case "upi":
        result = result.filter((g) => g.contributionType === "online");
        break;
      case "cash":
        result = result.filter((g) => g.contributionType === "cash");
        break;
      case "added":
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredGuests(result);
  };

  const handleDeleteGuest = async (guestId) => {
    if (window.confirm("Are you sure you want to delete this guest?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/guests/${guestId}`);
        setGuests(guests.filter((g) => g._id !== guestId));
      } catch (err) {
        setError("Failed to delete guest");
        console.error("Delete guest error:", err);
      }
    }
  };

  const validateMobile = (mobile) => {
    if (!mobile) return true;
    return /^\d{10}$/.test(mobile.replace(/\D/g, ""));
  };

  const resetForm = () => {
    setName("");
    setVillage("");
    setMobileNumber("");
    setTag("other");
    setPriority(3);
    setEditingGuestId(null);
    setFormMessage("");
  };

  const getUniqueSuggestions = (field) => {
    const values = new Set();
    guests.forEach((guest) => {
      if (field === "name" && guest.name) {
        values.add(guest.name);
      } else if (field === "village" && guest.village) {
        values.add(guest.village);
      }
    });
    return Array.from(values).sort();
  };

  const handleAddGuestSubmit = async (e) => {
    e.preventDefault();
    setFormMessage("");

    if (!name.trim() || !village.trim()) {
      setFormMessage("Name and village required");
      return;
    }

    if (mobileNumber && !validateMobile(mobileNumber)) {
      setFormMessage("Mobile must be 10 digits");
      return;
    }

    setFormLoading(true);
    try {
      if (editingGuestId) {
        // Update existing guest
        await axios.put(`${API_BASE_URL}/api/guests/${editingGuestId}`, {
          name: name.trim(),
          village: village.trim(),
          mobileNumber: mobileNumber || null,
          tag,
          priority: parseInt(priority),
        });
        setFormMessage("Guest updated!");
      } else {
        // Create new guest
        await axios.post(`${API_BASE_URL}/api/guests/create`, {
          userId: user.id,
          weddingId,
          name: name.trim(),
          village: village.trim(),
          mobileNumber: mobileNumber || null,
          tag,
          priority: parseInt(priority),
        });
        setFormMessage("Guest added!");
      }

      setTimeout(() => {
        resetForm();
        fetchGuests();
      }, 800);
    } catch (err) {
      setFormMessage(err.response?.data?.message || "Error saving guest");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditGuest = (guest) => {
    setName(guest.name);
    setVillage(guest.village);
    setMobileNumber(guest.mobileNumber || "");
    setTag(guest.tag);
    setPriority(guest.priority);
    setEditingGuestId(guest._id);
    setFormMessage("");
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSortBy("added");
    setGroupBy("none");
  };

  const handleDownloadPDF = () => {
    // Format guest data for PDF
    const guestListText = filteredGuests
      .map(
        (guest, index) =>
          `${index + 1}. ${guest.name.padEnd(25)} | ${guest.village.padEnd(20)} | ${
            guest.mobileNumber
              ? guest.mobileNumber.padEnd(12)
              : "N/A".padEnd(12)
          } | ${guest.tag}`,
      )
      .join("\n");

    const content = `Digital Newta Manager - Guest List\n${"=".repeat(80)}\n\n${guestListText}`;

    // Create blob and download
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guest-list-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const groupedGuests = () => {
    if (groupBy === "none") {
      return { "All Guests": filteredGuests };
    }

    const grouped = {};
    filteredGuests.forEach((guest) => {
      let key = "Others";

      if (groupBy === "village") {
        key = guest.village;
      } else if (groupBy === "tag") {
        key = guest.tag.charAt(0).toUpperCase() + guest.tag.slice(1);
      } else if (groupBy === "priority") {
        key = ["High Priority", "Medium Priority", "Low Priority"][
          guest.priority - 1
        ];
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(guest);
    });

    return grouped;
  };

  if (loading) {
    return (
      <div className="guest-list-container">
        <div className="guest-list-modal">
          <div className="loading">Loading guests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="guest-list-container">
      <div className="guest-list-modal">
        {!hideAddForm && (
          <div className="guest-form-inline">
            <form onSubmit={handleAddGuestSubmit} className="inline-form">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="👤 Guest name"
                list="nameList"
                required
              />
              <datalist id="nameList">
                {getUniqueSuggestions("name").map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="📍 Village"
                list="villageList"
                required
              />
              <datalist id="villageList">
                {getUniqueSuggestions("village").map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="📱 Mobile"
                maxLength="10"
              />
              <select value={tag} onChange={(e) => setTag(e.target.value)}>
                <option value="friend">👫 Friend</option>
                <option value="family">👨‍👩‍👧 Family</option>
                <option value="relative">🧑‍🤝‍🧑 Relative</option>
                <option value="neighbour">🏘️ Neighbour</option>
                <option value="other">✨ Other</option>
              </select>
              <div className="priority-inline">
                <label>
                  <input
                    type="radio"
                    value="1"
                    checked={priority === 1}
                    onChange={(e) => setPriority(1)}
                  />
                  1
                </label>
                <label>
                  <input
                    type="radio"
                    value="2"
                    checked={priority === 2}
                    onChange={(e) => setPriority(2)}
                  />
                  2
                </label>
                <label>
                  <input
                    type="radio"
                    value="3"
                    checked={priority === 3}
                    onChange={(e) => setPriority(3)}
                  />
                  3
                </label>
              </div>
              <button
                type="submit"
                disabled={formLoading}
                className="add-guest-submit-btn"
              >
                {formLoading ? "..." : editingGuestId ? "Update" : "Add Guest"}
              </button>
              {editingGuestId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="cancel-edit-btn"
                >
                  Cancel
                </button>
              )}
              <button type="button" onClick={onClose} className="close-btn">
                ×
              </button>
            </form>
            {formMessage && (
              <div
                className={
                  formMessage.includes("added") ? "form-success" : "form-error"
                }
              >
                {formMessage}
              </div>
            )}
          </div>
        )}

        <GuestFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          groupBy={groupBy}
          setGroupBy={setGroupBy}
          onClearFilters={handleClearFilters}
          onDownloadPDF={handleDownloadPDF}
          hideAddForm={hideAddForm}
          onClose={onClose}
        />

        {error && <div className="error-message">{error}</div>}

        {filteredGuests.length === 0 ? (
          <div className="no-guests">
            <p>💍 No guests found. Add one to get started!</p>
          </div>
        ) : (
          <div className="guests-display">
            {Object.entries(groupedGuests()).map(
              ([groupKey, groupedGuestList]) => (
                <div key={groupKey} className="guest-group">
                  {groupBy !== "none" && (
                    <div className="group-header">
                      {groupKey} ({groupedGuestList.length})
                    </div>
                  )}
                  <div className="guests-list">
                    {groupedGuestList.map((guest) => (
                      <GuestCard
                        key={guest._id}
                        guest={guest}
                        onEditClick={handleEditGuest}
                        onDeleteClick={handleDeleteGuest}
                      />
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        <div className="guests-stats">
          <span>
            👥 Invited/Attended: {guests.length}/
            {guests.filter((g) => g.attendedStatus).length}
          </span>
          <span>📊 Showing: {filteredGuests.length}</span>
        </div>
      </div>
    </div>
  );
};

export default GuestList;
