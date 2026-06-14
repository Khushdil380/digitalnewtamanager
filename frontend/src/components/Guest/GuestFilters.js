import React from "react";
import "../../styles/guest/GuestFilters.css";

const GuestFilters = ({
  searchQuery, setSearchQuery, sortBy, setSortBy, groupBy, setGroupBy,
  onClearFilters, exportSlot, hideAddForm = false, onClose,
}) => {
  return (
    <div className="guest-filters-section">
      {hideAddForm && (
        <div className="wedding-guest-header">
          <h3>👥 Wedding Guests</h3>
          <button className="close-btn-filters" onClick={onClose}>✕</button>
        </div>
      )}
      <div className="filters-row">
        <div className="search-box">
          <input type="text" placeholder="🔍 Search guest name, village, mobile..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
        </div>

        <div className="filter-group">
          <label>Filter/Sort:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="added">Recently Added</option>
            <option value="name">Name (A-Z)</option>
            <option value="priority">Priority (High→Low)</option>
            <option value="village">Village (A-Z)</option>
            <option value="amount">Amount (High→Low)</option>
            <option value="addedEarlier">📋 Added via Guest List</option>
            <option value="addedWeddingDay">👰 Added on Wedding Day</option>
            <option value="attended">✅ Attended</option>
            <option value="notAttended">❌ Not Attended</option>
            <option value="cash">💵 Cash</option>
            <option value="upi">🔗 UPI</option>
            <option value="envelope">✉️ Envelope</option>
            <option value="cardYes">📬 Card Distributed</option>
            <option value="cardNo">📭 No Card Yet</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Group By:</label>
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
            <option value="none">None</option>
            <option value="village">Village</option>
            <option value="tag">Tag</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        <button className="clear-filters-btn" onClick={onClearFilters}>🔄 Clear</button>
        {exportSlot}
      </div>
    </div>
  );
};

export default GuestFilters;
