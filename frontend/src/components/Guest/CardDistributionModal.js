import { useState, useMemo } from "react";
import api from "../../utils/api";
import "../../styles/guest/CardDistributionModal.css";

const CardDistributionModal = ({ isOpen, onClose, guests, weddingId, onUpdate }) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(null);

  const pendingGuests = useMemo(() => {
    return guests.filter((g) => g.cardDistributed !== true && g.isDeleted !== true);
  }, [guests]);

  const filtered = useMemo(() => {
    if (!search.trim()) return pendingGuests;
    const q = search.toLowerCase();
    return pendingGuests.filter((g) =>
      g.name.toLowerCase().includes(q) || g.village.toLowerCase().includes(q)
    );
  }, [pendingGuests, search]);

  const handleMark = async (guestId) => {
    setLoading(guestId);
    try {
      await api.patch(`/api/guests/${guestId}/card`, { cardDistributed: true });
      onUpdate();
    } catch (err) {
      console.error("Failed to mark card:", err);
    } finally {
      setLoading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="card-dist-overlay" onClick={onClose}>
      <div className="card-dist-modal" onClick={(e) => e.stopPropagation()}>
        <div className="card-dist-header">
          <h3>📬 Card Distribution</h3>
          <span className="card-dist-count">{pendingGuests.length} pending</span>
          <button className="card-dist-close" onClick={onClose}>✕</button>
        </div>

        <div className="card-dist-search">
          <input
            type="text"
            placeholder="🔍 Search by name or village..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="card-dist-list">
          {filtered.length === 0 ? (
            <div className="card-dist-empty">
              {pendingGuests.length === 0 ? "🎉 All cards distributed!" : "No matching guests"}
            </div>
          ) : (
            filtered.map((guest) => (
              <div key={guest._id} className="card-dist-item">
                <div className="card-dist-info">
                  <span className="card-dist-name">{guest.name}</span>
                  <span className="card-dist-village">{guest.village}</span>
                </div>
                <button
                  className="card-dist-mark-btn"
                  onClick={() => handleMark(guest._id)}
                  disabled={loading === guest._id}
                >
                  {loading === guest._id ? "..." : "✓ Mark"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDistributionModal;
