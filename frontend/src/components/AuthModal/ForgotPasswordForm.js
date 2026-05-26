import React from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";

const ForgotPasswordForm = ({ email, loading, onEmailChange, onSubmit, onBack }) => {
  return (
    <form onSubmit={onSubmit} className="auth-form">
      <InputField
        label="Email"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
      />

      <Button type="submit" variant="primary" className="auth-btn-submit" disabled={loading}>
        {loading ? "Sending OTP..." : "Send OTP"}
      </Button>

      <div className="auth-footer-links">
        <button type="button" onClick={onBack} className="auth-link">
          Back to Login
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
