import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://swiftconnect-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include tokens dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token"); // Adjust based on how you store the token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
