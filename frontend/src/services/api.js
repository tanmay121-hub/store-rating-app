import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  updatePassword: (passwords) => api.put("/auth/update-password", passwords),
};

// User APIs
export const userAPI = {
  getUsers: (filters) => api.get("/users", { params: filters }),
  createUser: (userData) => api.post("/users", userData),
  getUserById: (id) => api.get(`/users/${id}`),
};

// Store APIs
export const storeAPI = {
  getStores: (filters) => api.get("/stores", { params: filters }),
  createStore: (storeData) => api.post("/stores", storeData),
  getMyRatings: () => api.get("/stores/my-ratings"),
};

// Rating APIs
export const ratingAPI = {
  submitRating: (ratingData) => api.post("/ratings", ratingData),
  getDashboardStats: () => api.get("/ratings/dashboard-stats"),
};

export default api;
