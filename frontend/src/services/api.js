import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('sentinel.token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function safeRequest(requestFactory, fallbackValue) {
  try {
    const response = await requestFactory();
    return response.data?.data ?? response.data;
  } catch {
    return fallbackValue;
  }
}

export default api;