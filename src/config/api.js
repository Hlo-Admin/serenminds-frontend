// API Configuration
// This file centralizes the API base URL from environment variables
// Change REACT_APP_API_BASE_URL in .env to switch between production and localhost

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

export default API_BASE_URL;
