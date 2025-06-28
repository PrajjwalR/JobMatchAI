// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://localhost:3001"
    : "https://jobmatchai-v59r.onrender.com");

export const config = {
  API_BASE_URL,
  // Add other configuration variables here as needed
};
