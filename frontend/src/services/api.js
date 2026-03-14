import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Debug: show which API base URL is being used at runtime
try {
  // eslint-disable-next-line no-console
  console.info('[api] baseURL:', API_BASE_URL);
} catch (e) {
  // ignore
}

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // Debug: log outgoing request URL when debugging
  try {
    // eslint-disable-next-line no-console
    console.debug('[api] request:', config.method, config.url);
  } catch (e) {}
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Debug: surface server error payloads in console to aid troubleshooting
    try {
      // eslint-disable-next-line no-console
      console.error('[api] response error:', error.response?.status, error.response?.data || error.message);
    } catch (e) {}

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
