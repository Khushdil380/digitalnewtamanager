import React, { useState, useCallback, useEffect, useRef } from "react";
import GuestCard from "./GuestCard";
import GuestFilters from "./GuestFilters";
import GuestAddForm from "./GuestAddForm";
import GuestExport from "./GuestExport";
import useGuestList from "./useGuestList";
import "../../styles/guest/GuestList.css";

const BATCH_SIZE = 30;

const GuestList = ({ weddingId, onClose, hideAddForm = false, weddingInfo = null }) => {
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

  useEffect(() => { setVisibleCount(BATCH_SIZE); }, [searchQuery, sortBy, groupBy]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
      setVisibleCount((prev) => prev + BATCH_SIZE);
    }
  }, []);

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
          onClearFilters={clearFilters}
          exportSlot={<GuestExport filteredGuests={filteredGuests} weddingId={weddingId} weddingInfo={weddingInfo} />}
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
