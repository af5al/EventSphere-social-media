import axios from "axios";
import { API_BASE_URL } from "../config/api";

const safeGetToken = (storageKey) => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    return raw.startsWith("{") || raw.startsWith('"') || raw.startsWith("[")
      ? JSON.parse(raw)
      : raw;
  } catch (e) {
    return localStorage.getItem(storageKey);
  }
};

const createApiClient = (tokenKey) => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
  });

  instance.interceptors.request.use(
    (config) => {
      const token = safeGetToken(tokenKey);
      if (token) {
        config.headers.Authorization = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // If server responded with 4xx or 5xx, return the response so components
      // checking res.data.error receive the server's payload seamlessly
      if (error.response) {
        return error.response;
      }
      return Promise.reject(error);
    }
  );

  return (options) => instance(options);
};

export const userRequest = createApiClient("UserToken");
export const eventRequest = createApiClient("eventToken");
export const adminRequest = createApiClient("adminToken");

export default createApiClient("UserToken");
