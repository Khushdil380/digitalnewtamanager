import React from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";

const ResetPasswordForm = ({ form, errors, loading, onChange, onSubmit, onBack }) => {
  return (
    <form onSubmit={onSubmit} className="auth-form">
      <InputField
        label="OTP"
        type="text"
        placeholder="000000"
        maxLength="6"
        name="otp"
        value={form.otp}
        onChange={onChange}
        error={errors.otp}
        required
      />
      <InputField
        label="New Password"
        type="password"
        placeholder="Enter new password"
        name="newPassword"
        value={form.newPassword}
        onChange={onChange}
        error={errors.newPassword}
        required
      />
      <InputField
        label="Confirm Password"
        type="password"
        placeholder="Confirm new password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={onChange}
        error={errors.confirmPassword}
        required
      />

      <Button type="submit" variant="primary" className="auth-btn-submit" disabled={loading}>
        {loading ? "Resetting..." : "Reset Password"}
      </Button>

      <div className="auth-footer-links">
        <button type="button" onClick={onBack} className="auth-link">
          Back to Login
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
