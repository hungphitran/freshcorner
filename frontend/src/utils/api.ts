import axios from 'axios';

const DEFAULT_DEV_API_BASE_URL = 'http://localhost:5000/api';

function resolveApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (process.env.NODE_ENV === 'development') {
    if (!configured) {
      return DEFAULT_DEV_API_BASE_URL;
    }
    return configured;
  }

  if (configured) {
    return configured;
  }

  return '/api';
}

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
});

// Attach token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

export default api; 