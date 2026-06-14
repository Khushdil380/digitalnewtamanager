import { useState, useMemo } from "react";
import api from "../../utils/api";
import "../../styles/guest/CardDistributionModal.css";

const CardDistributionModal = ({ isOpen, onClose, guests, weddingId, onUpdate, weddingDate }) => {
  const [search, setSearch] = useState("");
  const [showMarked, setShowMarked] = useState(false);
  const [localMarked, setLocalMarked] = useState(new Set());
  const [localUnmarked, setLocalUnmarked] = useState(new Set());

  // Check if wedding day has passed — disable marking after wedding
  const isPastWedding = useMemo(() => {
    if (!weddingDate) return false;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const wedding = new Date(weddingDate); wedding.setHours(0, 0, 0, 0);
    return today > wedding;
  }, [weddingDate]);

  const activeGuests = useMemo(() => {
    return guests.filter((g) => g.isDeleted !== true);
  }, [guests]);

  const pendingGuests = useMemo(() => {
    return activeGuests.filter((g) => {
      if (localMarked.has(g._id)) return false;
      if (localUnmarked.has(g._id)) return true;
      return g.cardDistributed !== true;
    });
  }, [activeGuests, localMarked, localUnmarked]);

  const markedGuests = useMemo(() => {
    return activeGuests.filter((g) => {
      if (localUnmarked.has(g._id)) return false;
      if (localMarked.has(g._id)) return true;
      return g.cardDistributed === true;
    });
  }, [activeGuests, localMarked, localUnmarked]);

  const displayList = showMarked ? markedGuests : pendingGuests;

  const filtered = useMemo(() => {
    if (!search.trim()) return displayList;
    const q = search.toLowerCase();
    return displayList.filter((g) =>
      g.name.toLowerCase().includes(q) || g.village.toLowerCase().includes(q)
    );
  }, [displayList, search]);

  const handleMark = (guestId) => {
    // Instant UI update
    setLocalMarked((prev) => new Set([...prev, guestId]));
    setLocalUnmarked((prev) => { const s = new Set(prev); s.delete(guestId); return s; });
    // Background API call
    api.patch(`/api/guests/${guestId}/card`, { cardDistributed: true }).then(() => onUpdate()).catch(() => {});
  };

  const handleUnmark = (guestId) => {
    // Instant UI update
    setLocalUnmarked((prev) => new Set([...prev, guestId]));
    setLocalMarked((prev) => { const s = new Set(prev); s.delete(guestId); return s; });
    // Background API call
    api.patch(`/api/guests/${guestId}/card`, { cardDistributed: false }).then(() => onUpdate()).catch(() => {});
  };

  const handleClose = () => {
    setLocalMarked(new Set());
    setLocalUnmarked(new Set());
    setSearch("");
    setShowMarked(false);
    onClose();
  };

  if (!isOpen) return null;

  if (isPastWedding) {
    return (
      <div className="card-dist-overlay" onClick={handleClose}>
        <div className="card-dist-modal" onClick={(e) => e.stopPropagation()}>
          <div className="card-dist-header">
            <h3>📬 Card Distribution</h3>
            <button className="card-dist-close" onClick={handleClose}>✕</button>
          </div>
          <div className="card-dist-empty">📅 Wedding day has passed. Card distribution is no longer available.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-dist-overlay" onClick={handleClose}>
      <div className="card-dist-modal" onClick={(e) => e.stopPropagation()}>
        <div className="card-dist-header">
          <h3>📬 Card Distribution</h3>
          <span className="card-dist-count">{pendingGuests.length} pending</span>
          <button className="card-dist-close" onClick={handleClose}>✕</button>
        </div>

        <div className="card-dist-toolbar">
          <input
            type="text"
            placeholder="🔍 Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="card-dist-search-input"
          />
          <button
            className={`card-dist-toggle ${showMarked ? "active" : ""}`}
            onClick={() => setShowMarked(!showMarked)}
          >
            {showMarked ? `📬 Marked (${markedGuests.length})` : `📭 Pending (${pendingGuests.length})`}
          </button>
        </div>

        <div className="card-dist-list">
          {filtered.length === 0 ? (
            <div className="card-dist-empty">
              {showMarked ? "No marked guests" : pendingGuests.length === 0 ? "🎉 All cards distributed!" : "No matching guests"}
            </div>
          ) : (
            filtered.map((guest) => (
              <div key={guest._id} className="card-dist-item">
                <div className="card-dist-info">
                  <span className="card-dist-name">{guest.name}</span>
                  <span className="card-dist-sep">•</span>
                  <span className="card-dist-village">{guest.village}</span>
                </div>
                {showMarked ? (
                  <button className="card-dist-unmark-btn" onClick={() => handleUnmark(guest._id)}>✕ Undo</button>
                ) : (
                  <button className="card-dist-mark-btn" onClick={() => handleMark(guest._id)}>✓</button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDistributionModal;
