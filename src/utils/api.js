import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://127.0.0.1:8000";

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    const { response, request, message } = error;

    // Handle different error scenarios
    if (response) {
      // Server responded with error status
      const { status, data } = response;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            window.location.href = "/account/login";
          }
          break;
        case 403:
          console.error(
            "Access forbidden:",
            data?.message ||
              "You do not have permission to access this resource",
          );
          break;
        case 404:
          console.error(
            "Resource not found:",
            data?.message || "The requested resource was not found",
          );
          break;
        case 422:
          console.error(
            "Validation error:",
            data?.message || data?.detail || "Invalid data provided",
          );
          break;
        case 500:
          console.error(
            "Server error:",
            data?.message || "Internal server error occurred",
          );
          break;
        default:
          console.error(
            `HTTP ${status}:`,
            data?.message || data?.detail || "An error occurred",
          );
      }

      // Return structured error
      return Promise.reject({
        status,
        message:
          data?.message ||
          data?.detail ||
          data?.error ||
          `HTTP ${status} Error`,
        data: data,
        isApiError: true,
      });
    } else if (request) {
      // Network error
      console.error("Network error:", message);
      return Promise.reject({
        status: 0,
        message: "Network error. Please check your connection and try again.",
        isNetworkError: true,
      });
    } else {
      // Request setup error
      console.error("Request error:", message);
      return Promise.reject({
        status: 0,
        message: message || "An unexpected error occurred",
        isRequestError: true,
      });
    }
  },
);

// Helper functions for common API operations
export const fetchWithAuth = async (endpoint, options = {}) => {
  try {
    const response = await api.get(endpoint, options);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postWithAuth = async (endpoint, data = {}, options = {}) => {
  try {
    const response = await api.post(endpoint, data, options);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putWithAuth = async (endpoint, data = {}, options = {}) => {
  try {
    const response = await api.put(endpoint, data, options);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patchWithAuth = async (endpoint, data = {}, options = {}) => {
  try {
    const response = await api.patch(endpoint, data, options);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteWithAuth = async (endpoint, options = {}) => {
  try {
    const response = await api.delete(endpoint, options);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Helper for paginated requests
export const fetchAllPages = async (endpoint, maxPages = 50) => {
  let allData = [];
  let nextPage = endpoint;
  let pageCount = 0;

  try {
    while (nextPage && pageCount < maxPages) {
      const response = await api.get(nextPage);
      const data = response.data;

      if (data.results) {
        allData = allData.concat(data.results);
        nextPage = data.next;
      } else if (Array.isArray(data)) {
        allData = allData.concat(data);
        nextPage = null;
      } else {
        allData.push(data);
        nextPage = null;
      }

      pageCount++;
    }

    if (pageCount >= maxPages) {
      console.warn(`Reached max page limit (${maxPages}) for ${endpoint}`);
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }

  return allData;
};

// Helper for handling API responses with toast notifications
export const handleApiResponse = (response, successMessage = null) => {
  if (response && !response.isApiError) {
    if (successMessage) {
      toast.success(successMessage);
    }
    return response;
  }
  throw response;
};

// Helper for handling API errors with toast notifications
export const handleApiError = (error, customMessage = null) => {
  const message = customMessage || error?.message || "An error occurred";

  if (error?.isNetworkError) {
    toast.error(
      "Network connection error. Please check your internet connection.",
    );
  } else if (error?.status === 422) {
    toast.error(message);
  } else if (error?.status >= 500) {
    toast.error("Server error. Please try again later.");
  } else {
    toast.error(message);
  }

  console.error("API Error:", error);
  return error;
};

export default api;
