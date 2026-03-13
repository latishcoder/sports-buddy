import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle unauthorized errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const matchService = {
  getAll: (params) => api.get("/matches", { params }),
  getOne: (id) => api.get(`/matches/${id}`),
  create: (data) => api.post("/matches", data),
  join: (id) => api.post(`/matches/${id}/join`),
  leave: (id) => api.post(`/matches/${id}/leave`),
  delete: (id) => api.delete(`/matches/${id}`),
};

export default api;