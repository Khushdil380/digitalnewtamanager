// Utility function to ensure clean API URLs
export const getApiUrl = () => {
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  
  // Remove trailing slash if present
  return baseUrl.replace(/\/$/, "");
};

// Helper function to construct API endpoints
export const apiEndpoint = (path) => {
  const baseUrl = getApiUrl();
  // Ensure path starts with /
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};
