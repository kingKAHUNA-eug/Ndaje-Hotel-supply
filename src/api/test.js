import axios from 'axios';

const API_BASE = 'http://localhost:4000'; // or your deployed backend URL

export const getQuotes = async () => {
  try {
    const res = await axios.get(`${API_BASE}/api/quotes`);
    console.log(res.data); // You can return this instead if you want to use it elsewhere
    return res.data;
  } catch (err) {
    console.error('API error:', err);
    throw err;
  }
};
