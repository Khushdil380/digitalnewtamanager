import axios from "axios";

const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Add auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-retry on network errors or 503/500 (cold start / DB not ready)
// Auto-logout on 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // If token is expired/invalid, clear it and reload (auto-logout)
    const isAuthError = error.response?.status === 401;
    if (isAuthError && !config.url?.includes("/api/auth/login")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
      return Promise.reject(error);
    }

    // Only retry once, and only for recoverable errors
    if (config._retried) return Promise.reject(error);

    const isNetworkError = !error.response;
    const isServerColdStart = error.response?.status === 503;
    const isServerError = error.response?.status === 500;
    const isTimeout = error.code === "ECONNABORTED";

    if (isNetworkError || isServerColdStart || isServerError || isTimeout) {
      config._retried = true;
      // Wait 2 seconds for serverless cold start to finish
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api;
