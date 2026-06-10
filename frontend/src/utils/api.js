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

// Auto-retry on network errors or 503 (cold start / DB not ready)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Only retry once, and only for recoverable errors
    if (config._retried) return Promise.reject(error);

    const isNetworkError = !error.response;
    const isServerColdStart = error.response?.status === 503;
    const isTimeout = error.code === "ECONNABORTED";

    if (isNetworkError || isServerColdStart || isTimeout) {
      config._retried = true;
      // Wait 2 seconds for serverless cold start to finish
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api;
