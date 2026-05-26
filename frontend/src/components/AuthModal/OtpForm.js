import React from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";

const OtpForm = ({ email, otp, loading, onOtpChange, onSubmit, onBack }) => {
  return (
    <form onSubmit={onSubmit} className="auth-form">
      <InputField
        label="OTP"
        type="text"
        placeholder="000000"
        maxLength="6"
        value={otp}
        onChange={(e) => onOtpChange(e.target.value)}
        required
      />

      <Button type="submit" variant="primary" className="auth-btn-submit" disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </Button>

      <div className="auth-footer-links">
        <button type="button" onClick={onBack} className="auth-link">
          Back to Register
        </button>
      </div>
    </form>
  );
};

export default OtpForm;
