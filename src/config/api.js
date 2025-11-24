// src/config/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://ndaje-hotel-supply-backend.onrender.com'
    : 'http://localhost:10000');

export default API_BASE_URL;