import axios from 'axios';

// Central API configuration — change REACT_APP_API_URL in .env for production
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_URL = API_BASE;
export const SOCKET_URL = API_BASE;

export default axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});
