import axios from "axios";
import { tokenStorage } from "../../utils/storage";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

let unauthorizedHandler = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while token is being refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Try to refresh token or handle logout
      try {
        // For now, just trigger logout. In future, implement refresh token logic
        if (unauthorizedHandler) {
          unauthorizedHandler();
        }
        processQueue(null);
        return Promise.reject(error);
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (unauthorizedHandler) {
          unauthorizedHandler();
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const normalizedError = new Error(error.response?.data?.message || "Koneksi ke server gagal.");
    normalizedError.status = error.response?.status;
    normalizedError.errors = error.response?.data?.errors || [];
    normalizedError.response = error.response;

    return Promise.reject(normalizedError);
  }
);

export default api;
