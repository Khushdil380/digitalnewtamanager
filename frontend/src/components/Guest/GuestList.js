import React, { useState, useCallback, useEffect, useRef } from "react";
import GuestCard from "./GuestCard";
import GuestFilters from "./GuestFilters";
import GuestAddForm from "./GuestAddForm";
import useGuestList from "./useGuestList";
import "../../styles/guest/GuestList.css";

const BATCH_SIZE = 30;

const GuestList = ({ weddingId, onClose, hideAddForm = false }) => {
  const {
    guests, filteredGuests, loading, error, user,
    searchQuery, setSearchQuery, sortBy, setSortBy, groupBy, setGroupBy,
    fetchGuests, deleteGuest, clearFilters, groupedGuests,
  } = useGuestList(weddingId);

  const { formJSX, handleEdit } = GuestAddForm({
    weddingId, user, onGuestAdded: fetchGuests, onClose, guests,
  });

  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const scrollRef = useRef(null);

  // Reset visible count when filters change
  useEffect(() => { setVisibleCount(BATCH_SIZE); }, [searchQuery, sortBy, groupBy]);

  // Load more on scroll
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
      setVisibleCount((prev) => prev + BATCH_SIZE);
    }
  }, []);

  const handleDownloadPDF = () => {
    const text = filteredGuests
      .map((g, i) => `${i + 1}. ${g.name.padEnd(25)} | ${g.village.padEnd(20)} | ${g.mobileNumber || "N/A"} | ${g.tag}`)
      .join("\n");
    const blob = new Blob([`Digital Newta Manager - Guest List\n${"=".repeat(60)}\n\n${text}`], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guest-list-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
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
        {!hideAddForm && formJSX}

        <GuestFilters
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          sortBy={sortBy} setSortBy={setSortBy}
          groupBy={groupBy} setGroupBy={setGroupBy}
          onClearFilters={clearFilters} onDownloadPDF={handleDownloadPDF}
          hideAddForm={hideAddForm} onClose={onClose}
        />

        {error && <div className="error-message">{error}</div>}

        {filteredGuests.length === 0 ? (
          <div className="no-guests"><p>💍 No guests found. Add one to get started!</p></div>
        ) : (
          <div className="guests-display" ref={scrollRef} onScroll={handleScroll}>
            {Object.entries(groupedGuests()).map(([key, list]) => (
              <div key={key} className="guest-group">
                {groupBy !== "none" && <div className="group-header">{key} ({list.length})</div>}
                <div className="guests-list">
                  {list.slice(0, visibleCount).map((guest) => (
                    <GuestCard key={guest._id} guest={guest} onEditClick={handleEdit} onDeleteClick={deleteGuest} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="guests-stats">
          <span>👥 Invited/Attended: {guests.length}/{guests.filter((g) => g.attended).length}</span>
          <span>📊 Showing: {filteredGuests.length}</span>
        </div>
      </div>
    </div>
  );
};

export default GuestList;
