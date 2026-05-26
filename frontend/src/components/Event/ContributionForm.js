import React from "react";
import useContributionForm from "./useContributionForm";
import "../../styles/event/ContributionForm.css";

const ContributionForm = ({ weddingId, userId, onContributionRecorded }) => {
  const {
    formData, setFormData, suggestions, loading, message, error,
    handleNameChange, handleSelectName, handleVillageChange, handleSelectVillage, handleSubmit,
  } = useContributionForm(weddingId, userId, onContributionRecorded);

  return (
    <div className="contribution-form-container">
      <form onSubmit={handleSubmit} className="contribution-form">
        <div className="form-group">
          <label>Name *</label>
          <div className="input-with-suggestions">
            <input type="text" placeholder="Enter guest name" value={formData.guestName} onChange={(e) => handleNameChange(e.target.value)} className="form-input" />
            {suggestions.names.length > 0 && (
              <div className="suggestions-list">
                {suggestions.names.map((name, i) => (
                  <div key={i} className="suggestion-item" onClick={() => handleSelectName(name)}>{name}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Village/City *</label>
          <div className="input-with-suggestions">
            <input type="text" placeholder="Enter village/city" value={formData.village} onChange={(e) => handleVillageChange(e.target.value)} className="form-input" />
            {suggestions.villages.length > 0 && (
              <div className="suggestions-list">
                {suggestions.villages.map((v, i) => (
                  <div key={i} className="suggestion-item" onClick={() => handleSelectVillage(v)}>{v}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Amount *</label>
          <input type="number" placeholder="Enter amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="form-input" min="0" />
        </div>

        <div className="form-group">
          <label>Payment Type *</label>
          <div className="radio-group">
            <label className="radio-label"><input type="radio" checked={formData.type === "cash"} onChange={() => setFormData({ ...formData, type: "cash" })} />💵 Cash</label>
            <label className="radio-label"><input type="radio" checked={formData.type === "upi"} onChange={() => setFormData({ ...formData, type: "upi" })} />🔗 UPI</label>
          </div>
        </div>

        <div className="form-group">
          <label>Given By:</label>
          <div className="radio-group">
            <label className="radio-label"><input type="radio" checked={formData.givenPersonally} onChange={() => setFormData({ ...formData, givenPersonally: true, givenBy: "" })} />Personally</label>
            <label className="radio-label"><input type="radio" checked={!formData.givenPersonally} onChange={() => setFormData({ ...formData, givenPersonally: false })} />By Someone</label>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Recording..." : "✓ Record Contribution"}
        </button>
      </form>
    </div>
  );
};

export default ContributionForm;
