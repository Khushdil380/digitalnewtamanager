import React from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";

const LoginForm = ({ form, errors, loading, onChange, onSubmit, onForgot, onSwitch }) => {
  return (
    <form onSubmit={onSubmit} className="auth-form">
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

      <Button type="submit" variant="primary" className="auth-btn-submit" disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </Button>

      <div className="auth-footer-links">
        <button type="button" onClick={onForgot} className="auth-link">
          Forgot Password?
        </button>
        <span className="auth-divider">•</span>
        <button type="button" onClick={onSwitch} className="auth-link">
          Create Account
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
