import "../../styles/subFunction/SubFunctionGuestList.css";

const SubFunctionGuestList = ({ loading, currentFunction, view, displayGuests, onInvite, onUninvite, onMarkAttended, onUnmarkAttended }) => {
  if (loading) return <div className="sf-empty">Loading...</div>;
  if (!currentFunction) return <div className="sf-empty">Create a function to get started</div>;

  if (displayGuests.length === 0) {
    const msg = view === "all" ? "All guests are already invited"
      : view === "invited" ? "No invited guests yet"
      : "No attended guests yet";
    return <div className="sf-empty">{msg}</div>;
  }

  return (
    <div className="sf-guest-list">
      {displayGuests.map((guest) => (
        <div key={guest._id} className="sf-guest-item">
          <div className="sf-guest-info">
            <span className="sf-guest-name">{guest.name}</span>
            <span className="sf-guest-sep">•</span>
            <span className="sf-guest-village">{guest.village}</span>
          </div>
          {view === "all" && (
            <button className="sf-action-btn sf-invite-btn" onClick={() => onInvite(guest._id)}>✓</button>
          )}
          {view === "invited" && (
            <div className="sf-action-group">
              <button className="sf-action-btn sf-attend-btn" onClick={() => onMarkAttended(guest._id)}>✓</button>
              <button className="sf-action-btn sf-remove-btn" onClick={() => onUninvite(guest._id)}>✕</button>
            </div>
          )}
          {view === "attended" && (
            <button className="sf-action-btn sf-undo-btn" onClick={() => onUnmarkAttended(guest._id)}>↩</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubFunctionGuestList;
