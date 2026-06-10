import React, { useState, useCallback, useEffect, useRef } from "react";
import GuestCard from "./GuestCard";
import GuestFilters from "./GuestFilters";
import GuestAddForm from "./GuestAddForm";
import GuestExport from "./GuestExport";
import BulkSmsModal from "../BulkSms/BulkSmsModal";
import useGuestList from "./useGuestList";
import "../../styles/guest/GuestList.css";

const BATCH_SIZE = 30;

// Returns true if today is after the wedding date
const isAfterWeddingDay = (weddingDate) => {
  if (!weddingDate) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const wedding = new Date(weddingDate); wedding.setHours(0, 0, 0, 0);
  return today > wedding;
};

const GuestList = ({ weddingId, onClose, hideAddForm = false, weddingInfo = null }) => {
  const {
    guests, filteredGuests, deletedGuests, loading, error, user,
    searchQuery, setSearchQuery, sortBy, setSortBy, groupBy, setGroupBy,
    fetchGuests, deleteGuest, clearFilters, groupedGuests,
  } = useGuestList(weddingId);

  const pastWeddingDay = isAfterWeddingDay(weddingInfo?.date);

  const { formJSX, handleEdit } = GuestAddForm({
    weddingId, user, onGuestAdded: fetchGuests, onClose, guests,
  });

  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showBulkSms, setShowBulkSms] = useState(false);
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
        {!hideAddForm && (
          pastWeddingDay ? (
            <div className="past-wedding-notice">
              <div className="guest-form-header">
                <span className="guest-form-title">Guest List</span>
                <button type="button" onClick={onClose} className="guest-close-btn">✕</button>
              </div>
              <div className="past-wedding-msg">
                📅 Wedding day has passed. New guests can only be added via the <strong>Record Contribution</strong> page, which labels them as <em>Wedding Day</em>.
              </div>
            </div>
          ) : formJSX
        )}

        <GuestFilters
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          sortBy={sortBy} setSortBy={setSortBy}
          groupBy={groupBy} setGroupBy={setGroupBy}
          onClearFilters={clearFilters}
          exportSlot={<GuestExport filteredGuests={filteredGuests} weddingId={weddingId} weddingInfo={weddingInfo} groupBy={groupBy} groupedGuests={groupedGuests} />}
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
          <button className="bulk-sms-trigger" onClick={() => setShowBulkSms(true)} title="Bulk SMS">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>
          </button>
        </div>

        {deletedGuests.length > 0 && (
          <div className="deleted-guests-section">
            <button className="deleted-toggle" onClick={() => setShowDeleted(!showDeleted)}>
              🗑️ Deleted ({deletedGuests.length}) <span className={`deleted-arrow ${showDeleted ? "open" : ""}`}>▾</span>
            </button>
            {showDeleted && (
              <div className="deleted-list-scroll">
                <div className="guests-list">
                  {deletedGuests.map((guest) => (
                    <GuestCard key={guest._id} guest={guest} isDeleted />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <BulkSmsModal
        isOpen={showBulkSms}
        onClose={() => setShowBulkSms(false)}
        weddingId={weddingId}
        guests={guests}
      />
    </div>
  );
};

export default GuestList;
