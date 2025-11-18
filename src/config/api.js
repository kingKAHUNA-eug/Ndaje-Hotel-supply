// src/config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://ndaje-hotel-supply-backend.onrender.com'
    : 'http://localhost:10000');

export default API_BASE_URL;