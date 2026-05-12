import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Important: Send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
