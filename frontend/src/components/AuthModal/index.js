import React, { useState } from "react";
import api from "../../utils/api";
import Modal from "../common/Modal";
import WelcomeModal from "../common/WelcomeModal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import OtpForm from "./OtpForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import "../../styles/auth/AuthModal.css";

const VIEWS = { LOGIN: "login", REGISTER: "register", OTP: "otp", FORGOT: "forgot", RESET: "reset" };

const AuthModal = ({ isOpen, onClose }) => {
  const [view, setView] = useState(VIEWS.LOGIN);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showWelcome, setShowWelcome] = useState(false);
  const [newUser, setNewUser] = useState(null);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "", email: "", phoneNumber: "", password: "", confirmPassword: "",
  });
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetForm, setResetForm] = useState({
    email: "", otp: "", newPassword: "", confirmPassword: "",
  });

  const clearState = () => { setErrors({}); setMessage(""); };
  const switchView = (v) => { clearState(); setView(v); };

  const handleFormChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLogin = async (e) => {
    e.preventDefault(); clearState();
    if (!loginForm.email || !loginForm.password) { setErrors({ general: "Email and password are required" }); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", loginForm);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage("Login successful!");
      setTimeout(() => { onClose(); window.location.href = "/dashboard"; }, 1500);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Login failed" });
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); clearState();
    const errs = {};
    if (!registerForm.fullName) errs.fullName = "Full name is required";
    if (!registerForm.email) errs.email = "Email is required";
    if (!registerForm.phoneNumber) errs.phoneNumber = "Phone number is required";
    if (!registerForm.password) errs.password = "Password is required";
    if (registerForm.password !== registerForm.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/register", registerForm);
      setMessage(data.message);
      setOtpEmail(registerForm.email);
      setOtp("");
      setView(VIEWS.OTP);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Registration failed" });
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); clearState();
    if (!otp) { setErrors({ general: "OTP is required" }); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/verify-otp", { email: otpEmail, otp });
      setNewUser(data.user);
      setShowWelcome(true);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "OTP verification failed" });
    } finally { setLoading(false); }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault(); clearState();
    if (!forgotEmail) { setErrors({ general: "Email is required" }); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/forgot-password", { email: forgotEmail });
      setMessage(data.message);
      setResetForm({ email: forgotEmail, otp: "", newPassword: "", confirmPassword: "" });
      setView(VIEWS.RESET);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Request failed" });
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault(); clearState();
    const errs = {};
    if (!resetForm.otp) errs.otp = "OTP is required";
    if (!resetForm.newPassword) errs.newPassword = "New password is required";
    if (resetForm.newPassword !== resetForm.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/reset-password", resetForm);
      setMessage(data.message);
      setTimeout(() => switchView(VIEWS.LOGIN), 2000);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Password reset failed" });
    } finally { setLoading(false); }
  };

  const handleModalClose = () => {
    setView(VIEWS.LOGIN);
    setLoginForm({ email: "", password: "" });
    setRegisterForm({ fullName: "", email: "", phoneNumber: "", password: "", confirmPassword: "" });
    setOtp(""); setForgotEmail("");
    setResetForm({ email: "", otp: "", newPassword: "", confirmPassword: "" });
    clearState();
    onClose();
  };

  const headers = {
    [VIEWS.LOGIN]: { title: "Welcome Back", subtitle: "Sign in to manage your weddings" },
    [VIEWS.REGISTER]: { title: "Create Account", subtitle: "Join us to get started" },
    [VIEWS.OTP]: { title: "Verify Email", subtitle: `Enter the OTP sent to ${otpEmail}` },
    [VIEWS.FORGOT]: { title: "Reset Password", subtitle: "Enter your email to receive reset instructions" },
    [VIEWS.RESET]: { title: "Reset Password", subtitle: "Enter the OTP and your new password" },
  };
  const header = headers[view];

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleModalClose} size="medium">
        <div className="auth-content-wrapper">
          <div className="auth-modal-header">
            <h2 className="auth-modal-title">{header.title}</h2>
            <p className="auth-modal-subtitle">{header.subtitle}</p>
          </div>
          {errors.general && <div className="auth-error-message">{errors.general}</div>}
          {message && <div className="auth-success-message">{message}</div>}

          {view === VIEWS.LOGIN && <LoginForm form={loginForm} errors={errors} loading={loading} onChange={handleFormChange(setLoginForm)} onSubmit={handleLogin} onForgot={() => switchView(VIEWS.FORGOT)} onSwitch={() => switchView(VIEWS.REGISTER)} />}
          {view === VIEWS.REGISTER && <RegisterForm form={registerForm} errors={errors} loading={loading} onChange={handleFormChange(setRegisterForm)} onSubmit={handleRegister} onSwitch={() => switchView(VIEWS.LOGIN)} />}
          {view === VIEWS.OTP && <OtpForm email={otpEmail} otp={otp} loading={loading} onOtpChange={setOtp} onSubmit={handleVerifyOtp} onBack={() => switchView(VIEWS.REGISTER)} />}
          {view === VIEWS.FORGOT && <ForgotPasswordForm email={forgotEmail} loading={loading} onEmailChange={setForgotEmail} onSubmit={handleForgotPassword} onBack={() => switchView(VIEWS.LOGIN)} />}
          {view === VIEWS.RESET && <ResetPasswordForm form={resetForm} errors={errors} loading={loading} onChange={handleFormChange(setResetForm)} onSubmit={handleResetPassword} onBack={() => switchView(VIEWS.LOGIN)} />}
        </div>
      </Modal>

      <WelcomeModal isOpen={showWelcome} user={newUser} onClose={() => { setShowWelcome(false); setLoginForm({ email: newUser?.email || "", password: "" }); setNewUser(null); switchView(VIEWS.LOGIN); }} />
    </>
  );
};

export default AuthModal;
