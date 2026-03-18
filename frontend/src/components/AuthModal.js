import React, { useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import InputField from "./InputField";
import Button from "./Button";
import WelcomeModal from "./WelcomeModal";
import "../styles/AuthModal.css";

const AuthModal = ({ isOpen, onClose }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showWelcome, setShowWelcome] = useState(false);
  const [newUser, setNewUser] = useState(null);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [otpForm, setOtpForm] = useState({ email: "", otp: "" });
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordResetOtp, setShowPasswordResetOtp] = useState(false);
  const [resetPasswordForm, setResetPasswordForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const API_BASE_URL = (
    process.env.REACT_APP_API_URL || "http://localhost:5000"
  ).replace(/\/$/, "");

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    if (!loginForm.email || !loginForm.password) {
      setErrors({ general: "Email and password are required" });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        loginForm,
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setMessage("Login successful!");
      setTimeout(() => {
        onClose();
        window.location.href = "/dashboard";
      }, 1500);
    } catch (error) {
      setErrors({ general: error.response?.data?.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const newErrors = {};
    if (!registerForm.fullName) newErrors.fullName = "Full name is required";
    if (!registerForm.email) newErrors.email = "Email is required";
    if (!registerForm.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";
    if (!registerForm.password) newErrors.password = "Password is required";
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        registerForm,
      );
      setMessage(response.data.message);
      setOtpForm({ email: registerForm.email, otp: "" });
      setShowOtpVerification(true);
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    if (!otpForm.email || !otpForm.otp) {
      setErrors({ general: "Email and OTP are required" });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/verify-otp`,
        otpForm,
      );
      setNewUser(response.data.user);
      setShowWelcome(true);
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || "OTP verification failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    if (!forgotPasswordEmail) {
      setErrors({ general: "Email is required" });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/forgot-password`,
        {
          email: forgotPasswordEmail,
        },
      );
      setMessage(response.data.message);
      setShowPasswordResetOtp(true);
      setResetPasswordForm({
        ...resetPasswordForm,
        email: forgotPasswordEmail,
      });
    } catch (error) {
      setErrors({ general: error.response?.data?.message || "Request failed" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetChange = (e) => {
    const { name, value } = e.target;
    setResetPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const newErrors = {};
    if (!resetPasswordForm.otp) newErrors.otp = "OTP is required";
    if (!resetPasswordForm.newPassword)
      newErrors.newPassword = "New password is required";
    if (resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/reset-password`,
        {
          email: resetPasswordForm.email,
          otp: resetPasswordForm.otp,
          newPassword: resetPasswordForm.newPassword,
          confirmPassword: resetPasswordForm.confirmPassword,
        },
      );
      setMessage(response.data.message);
      setTimeout(() => {
        setShowForgotPassword(false);
        setShowPasswordResetOtp(false);
        setForgotPasswordEmail("");
        setResetPasswordForm({
          email: "",
          otp: "",
          newPassword: "",
          confirmPassword: "",
        });
      }, 2000);
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || "Password reset failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowRegister(false);
    setLoginForm({ email: "", password: "" });
    setRegisterForm({
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    });
    setOtpForm({ email: "", otp: "" });
    setShowOtpVerification(false);
    setShowForgotPassword(false);
    setErrors({});
    setMessage("");
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleModalClose} size="medium">
        <div className="auth-content-wrapper">
          {!showOtpVerification && !showForgotPassword ? (
            <>
              <div className="auth-modal-header">
                <h2 className="auth-modal-title">
                  {showRegister ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="auth-modal-subtitle">
                  {showRegister
                    ? "Join us to get started"
                    : "Sign in to manage your weddings"}
                </p>
              </div>

              {errors.general && (
                <div className="auth-error-message">{errors.general}</div>
              )}
              {message && <div className="auth-success-message">{message}</div>}

              {!showRegister ? (
                <form onSubmit={handleLoginSubmit} className="auth-form">
                  <InputField
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    error={errors.email}
                    required
                  />
                  <InputField
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    error={errors.password}
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    className="auth-btn-submit"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>

                  <div className="auth-footer-links">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="auth-link"
                    >
                      Forgot Password?
                    </button>
                    <span className="auth-divider">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRegister(true);
                        setErrors({});
                        setMessage("");
                      }}
                      className="auth-link"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="auth-form">
                  <div className="auth-form-row full-width">
                    <InputField
                      label="Email"
                      type="email"
                      placeholder="your@email.com"
                      name="email"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
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
                      value={registerForm.fullName}
                      onChange={handleRegisterChange}
                      error={errors.fullName}
                      required
                    />
                    <InputField
                      label="Phone Number"
                      type="tel"
                      placeholder="+91 98765 43210"
                      name="phoneNumber"
                      value={registerForm.phoneNumber}
                      onChange={handleRegisterChange}
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
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      error={errors.password}
                      required
                    />
                    <InputField
                      label="Confirm Password"
                      type="password"
                      placeholder="••••••••"
                      name="confirmPassword"
                      value={registerForm.confirmPassword}
                      onChange={handleRegisterChange}
                      error={errors.confirmPassword}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="auth-btn-submit"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>

                  <div className="auth-footer-links">
                    <span>Already have an account?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRegister(false);
                        setErrors({});
                        setMessage("");
                      }}
                      className="auth-link"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : showForgotPassword ? (
            <>
              <div className="auth-modal-header">
                <h2 className="auth-modal-title">Reset Password</h2>
                <p className="auth-modal-subtitle">
                  Enter your email to receive reset instructions
                </p>
              </div>

              {errors.general && (
                <div className="auth-error-message">{errors.general}</div>
              )}
              {message && <div className="auth-success-message">{message}</div>}

              <form onSubmit={handleForgotPassword} className="auth-form">
                <InputField
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="auth-btn-submit"
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>

                <div className="auth-footer-links">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="auth-link"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </>
          ) : showPasswordResetOtp ? (
            <>
              <div className="auth-modal-header">
                <h2 className="auth-modal-title">Reset Password</h2>
                <p className="auth-modal-subtitle">
                  Enter the OTP and your new password
                </p>
              </div>

              {errors.general && (
                <div className="auth-error-message">{errors.general}</div>
              )}
              {message && <div className="auth-success-message">{message}</div>}

              <form onSubmit={handlePasswordReset} className="auth-form">
                <InputField
                  label="OTP"
                  type="text"
                  placeholder="000000"
                  maxLength="6"
                  name="otp"
                  value={resetPasswordForm.otp}
                  onChange={handlePasswordResetChange}
                  error={errors.otp}
                  required
                />

                <InputField
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  name="newPassword"
                  value={resetPasswordForm.newPassword}
                  onChange={handlePasswordResetChange}
                  error={errors.newPassword}
                  required
                />

                <InputField
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm new password"
                  name="confirmPassword"
                  value={resetPasswordForm.confirmPassword}
                  onChange={handlePasswordResetChange}
                  error={errors.confirmPassword}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="auth-btn-submit"
                  disabled={loading}
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </Button>

                <div className="auth-footer-links">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setShowPasswordResetOtp(false);
                      setResetPasswordForm({
                        email: "",
                        otp: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setForgotPasswordEmail("");
                      setMessage("");
                    }}
                    className="auth-link"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="auth-modal-header">
                <h2 className="auth-modal-title">Verify Email</h2>
                <p className="auth-modal-subtitle">
                  Enter the OTP sent to {otpForm.email}
                </p>
              </div>

              {errors.general && (
                <div className="auth-error-message">{errors.general}</div>
              )}
              {message && <div className="auth-success-message">{message}</div>}

              <form onSubmit={handleOtpVerification} className="auth-form">
                <InputField
                  label="OTP"
                  type="text"
                  placeholder="000000"
                  maxLength="6"
                  value={otpForm.otp}
                  onChange={(e) =>
                    setOtpForm((prev) => ({ ...prev, otp: e.target.value }))
                  }
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="auth-btn-submit"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>

                <div className="auth-footer-links">
                  <button
                    type="button"
                    onClick={() => setShowOtpVerification(false)}
                    className="auth-link"
                  >
                    Back to Register
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </Modal>
      <WelcomeModal
        isOpen={showWelcome}
        user={newUser}
        onClose={() => {
          setShowWelcome(false);
          setShowOtpVerification(false);
          setShowRegister(false);
          setOtpForm({ email: "", otp: "" });
          setLoginForm({ email: newUser?.email, password: "" });
          setNewUser(null);
        }}
      />
    </>
  );
};

export default AuthModal;
