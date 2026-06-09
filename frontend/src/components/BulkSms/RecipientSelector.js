import React, { useState } from "react";

const RecipientSelector = ({ guests, selectedIds, setSelectedIds, smsLogs, messageType }) => {
  const [search, setSearch] = useState("");

  const eligibleGuests = guests
    .filter((g) => g.mobileNumber && !g.isDeleted)
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredGuests = search.trim()
    ? eligibleGuests.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
    : eligibleGuests;

  const alreadySent = new Set(
    smsLogs.filter((l) => l.messageType === messageType).map((l) => l.guestId)
  );

  const toggleGuest = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(filteredGuests.filter((g) => !alreadySent.has(g._id)).map((g) => g._id));
  };

  const selectByTag = (tag) => {
    setSelectedIds(filteredGuests.filter((g) => g.tag === tag && !alreadySent.has(g._id)).map((g) => g._id));
  };

  const clearAll = () => setSelectedIds([]);

  return (
    <div className="recipient-selector">
      <div className="recipient-actions">
        <button type="button" onClick={selectAll} className="recipient-action-btn">All</button>
        <button type="button" onClick={() => selectByTag("family")} className="recipient-action-btn">Family</button>
        <button type="button" onClick={() => selectByTag("friend")} className="recipient-action-btn">Friends</button>
        <button type="button" onClick={() => selectByTag("relative")} className="recipient-action-btn">Relative</button>
        <button type="button" onClick={() => selectByTag("neighbour")} className="recipient-action-btn">Neighbour</button>
        <button type="button" onClick={clearAll} className="recipient-action-btn clear">Clear</button>
        <input
          type="text"
          className="recipient-search"
          placeholder="🔍 Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="recipient-list">
        {filteredGuests.map((guest) => {
          const sent = alreadySent.has(guest._id);
          return (
            <label key={guest._id} className={`recipient-item ${sent ? "already-sent" : ""}`}>
              <input
                type="checkbox"
                checked={selectedIds.includes(guest._id)}
                onChange={() => toggleGuest(guest._id)}
                disabled={sent}
              />
              <span className="recipient-name">{guest.name}</span>
              <span className="recipient-village">{guest.village}</span>
              {sent && <span className="sent-badge">✓ Sent</span>}
            </label>
          );
        })}
        {filteredGuests.length === 0 && <p className="no-recipients">No guests found</p>}
      </div>
      <div className="recipient-count">
        Selected: {selectedIds.length} / {eligibleGuests.filter((g) => !alreadySent.has(g._id)).length} eligible
      </div>
    </div>
  );
};

export default RecipientSelector;
