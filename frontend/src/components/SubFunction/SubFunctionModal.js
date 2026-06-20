import { useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import api from "../../utils/api";
import SubFunctionTabs from "./SubFunctionTabs";
import SubFunctionGuestList from "./SubFunctionGuestList";
import SubFunctionExport from "./SubFunctionExport";
import "../../styles/common/Modal.css";
import "../../styles/subFunction/SubFunctionModal.css";

const SubFunctionModal = ({ isOpen, onClose, weddingId, guests, weddingInfo }) => {
  const [subFunctions, setSubFunctions] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("all");
  const [loading, setLoading] = useState(false);

  const activeGuests = useMemo(() => guests.filter((g) => !g.isDeleted), [guests]);

  const fetchSubFunctions = useCallback(async () => {
    if (!weddingId) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/api/sub-functions/wedding/${weddingId}`);
      const list = data.subFunctions || [];
      setSubFunctions(list);
      if (!activeTab && list.length > 0) setActiveTab(list[0]._id);
    } catch (err) {
      console.error("Failed to fetch sub-functions:", err);
    } finally {
      setLoading(false);
    }
  }, [weddingId, activeTab]);

  useEffect(() => {
    if (isOpen) fetchSubFunctions();
  }, [isOpen, fetchSubFunctions]);

  const currentFunction = useMemo(() => {
    return subFunctions.find((sf) => sf._id === activeTab) || null;
  }, [subFunctions, activeTab]);

  const invitedSet = useMemo(() => {
    return new Set((currentFunction?.invitedGuests || []).map((id) => id.toString()));
  }, [currentFunction]);

  const attendedSet = useMemo(() => {
    return new Set((currentFunction?.attendedGuests || []).map((id) => id.toString()));
  }, [currentFunction]);

  const filteredGuests = useMemo(() => {
    if (!currentFunction) return [];
    let list;
    if (view === "invited") {
      list = activeGuests.filter((g) => invitedSet.has(g._id) && !attendedSet.has(g._id));
    } else if (view === "attended") {
      list = activeGuests.filter((g) => attendedSet.has(g._id));
    } else {
      list = activeGuests.filter((g) => !invitedSet.has(g._id));
    }
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((g) => g.name.toLowerCase().includes(q) || g.village.toLowerCase().includes(q));
  }, [currentFunction, view, activeGuests, invitedSet, attendedSet, search]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const { data } = await api.post("/api/sub-functions", { weddingId, name: newName.trim() });
      if (data.success) {
        setSubFunctions((prev) => [...prev, data.subFunction]);
        setActiveTab(data.subFunction._id);
        setNewName("");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error creating function");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this function?")) return;
    try {
      await api.delete(`/api/sub-functions/${id}`);
      setSubFunctions((prev) => prev.filter((sf) => sf._id !== id));
      if (activeTab === id) {
        const remaining = subFunctions.filter((sf) => sf._id !== id);
        setActiveTab(remaining.length > 0 ? remaining[0]._id : null);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const updateLocal = (sfId, field, guestId, action) => {
    setSubFunctions((prev) => prev.map((sf) => {
      if (sf._id !== sfId) return sf;
      const arr = [...(sf[field] || [])];
      if (action === "add" && !arr.includes(guestId)) arr.push(guestId);
      if (action === "remove") return { ...sf, [field]: arr.filter((id) => id.toString() !== guestId) };
      return { ...sf, [field]: arr };
    }));
  };

  const handleInvite = (guestId) => {
    updateLocal(activeTab, "invitedGuests", guestId, "add");
    api.patch(`/api/sub-functions/${activeTab}/invite`, { guestId }).catch(() => {
      updateLocal(activeTab, "invitedGuests", guestId, "remove");
    });
  };

  const handleUninvite = (guestId) => {
    updateLocal(activeTab, "invitedGuests", guestId, "remove");
    updateLocal(activeTab, "attendedGuests", guestId, "remove");
    api.patch(`/api/sub-functions/${activeTab}/uninvite`, { guestId }).catch(() => fetchSubFunctions());
  };

  const handleMarkAttended = (guestId) => {
    updateLocal(activeTab, "attendedGuests", guestId, "add");
    api.patch(`/api/sub-functions/${activeTab}/attend`, { guestId }).catch(() => {
      updateLocal(activeTab, "attendedGuests", guestId, "remove");
    });
  };

  const handleUnmarkAttended = (guestId) => {
    updateLocal(activeTab, "attendedGuests", guestId, "remove");
    api.patch(`/api/sub-functions/${activeTab}/unattend`, { guestId }).catch(() => {
      updateLocal(activeTab, "attendedGuests", guestId, "add");
    });
  };

  const handleClose = () => {
    setSearch("");
    setView("all");
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-container modal-large sf-container">
        <button className="modal-close" onClick={handleClose}>✕</button>
        <div className="sf-modal">
          <h2 className="sf-title">🎪 Sub Functions</h2>

          {/* Create new function */}
          <div className="sf-create-row">
            <input
              type="text"
              className="sf-name-input"
              placeholder="Function name (e.g., Haldi)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              maxLength={50}
            />
            <button className="sf-create-btn" onClick={handleCreate} disabled={!newName.trim()}>Create</button>
          </div>

          {/* Search + View toggles */}
          <div className="sf-toolbar">
            <input
              type="text"
              className="sf-search-input"
              placeholder="🔍 Search guest..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="sf-view-btns">
              <button className={`sf-view-btn ${view === "invited" ? "active" : ""}`} onClick={() => setView("invited")}>
                Invited ({invitedSet.size - attendedSet.size})
              </button>
              <button className={`sf-view-btn ${view === "attended" ? "active" : ""}`} onClick={() => setView("attended")}>
                Attended ({attendedSet.size})
              </button>
            </div>
          </div>

          {/* Function tabs + Export */}
          <SubFunctionTabs
            subFunctions={subFunctions}
            activeTab={activeTab}
            onTabClick={(id) => { setActiveTab(id); setView("all"); }}
            onDelete={handleDelete}
            exportNode={currentFunction && (
              <SubFunctionExport
                guests={activeGuests}
                invitedSet={invitedSet}
                attendedSet={attendedSet}
                functionName={currentFunction.name}
                weddingInfo={weddingInfo}
              />
            )}
          />

          {/* Guest list */}
          <SubFunctionGuestList
            loading={loading}
            currentFunction={currentFunction}
            view={view}
            displayGuests={filteredGuests}
            onInvite={handleInvite}
            onUninvite={handleUninvite}
            onMarkAttended={handleMarkAttended}
            onUnmarkAttended={handleUnmarkAttended}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SubFunctionModal;
