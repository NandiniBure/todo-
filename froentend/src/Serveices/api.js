import axios from "axios";

const api = axios.create({
  baseURL: "https://todo-rho-wheat-88.vercel.app/api", // Backend API URL
});

// Add Authorization Token Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
