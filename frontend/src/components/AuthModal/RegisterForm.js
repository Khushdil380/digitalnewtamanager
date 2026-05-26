import React from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";

const RegisterForm = ({ form, errors, loading, onChange, onSubmit, onSwitch }) => {
  return (
    <form onSubmit={onSubmit} className="auth-form">
      <div className="auth-form-row full-width">
        <InputField
          label="Email"
          type="email"
          placeholder="your@email.com"
          name="email"
          value={form.email}
          onChange={onChange}
          error={errors.email}
          required
        />
      </div>
      <div className="auth-form-row">
        <InputField
          label="Full Name"
          type="text"
          placeholder="John Doe"
          name="fullName"
          value={form.fullName}
          onChange={onChange}
          error={errors.fullName}
          required
        />
        <InputField
          label="Phone Number"
          type="tel"
          placeholder="+91 98765 43210"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={onChange}
          error={errors.phoneNumber}
          required
        />
      </div>
      <div className="auth-form-row">
        <InputField
          label="Password"
          type="password"
          placeholder="••••••••"
          name="password"
          value={form.password}
          onChange={onChange}
          error={errors.password}
          required
        />
        <InputField
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword}
          required
        />
      </div>

      <Button type="submit" variant="primary" className="auth-btn-submit" disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </Button>

      <div className="auth-footer-links">
        <span>Already have an account?</span>
        <button type="button" onClick={onSwitch} className="auth-link">
          Sign In
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
