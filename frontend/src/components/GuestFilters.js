import React from "react";
import "../styles/GuestFilters.css";

const GuestFilters = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  groupBy,
  setGroupBy,
  onClearFilters,
  onDownloadPDF,
  hideAddForm = false,
  onClose,
}) => {
  return (
    <div className="guest-filters-section">
      {hideAddForm && (
        <div className="wedding-guest-header">
          <h3>👥 Wedding Guests</h3>
          <button className="close-btn-filters" onClick={onClose}>
            ✕
          </button>
        </div>
      )}
      <div className="filters-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search guest name, village, mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="added">Recently Added</option>
            <option value="addedEarlier">Added Earlier</option>
            <option value="addedWeddingDay">Added on Wedding Day</option>
            <option value="name">Name (A-Z)</option>
            <option value="priority">Priority (High to Low)</option>
            <option value="village">Village (A-Z)</option>
            <option value="attended">Attended ✅</option>
            <option value="notAttended">Not Attended ❌</option>
            <option value="amount">Amount (High to Low)</option>
            <option value="upi">Paid by UPI 🔗</option>
            <option value="cash">Paid by Cash 💵</option>
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

        <button className="clear-filters-btn" onClick={onClearFilters}>
          🔄 Clear
        </button>

        <button className="download-pdf-btn" onClick={onDownloadPDF}>
          📥 Download PDF
        </button>
      </div>
    </div>
  );
};

export default GuestFilters;
