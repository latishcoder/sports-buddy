import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const matchService = {
  getAll: (params) => api.get('/matches', { params }),
  getOne: (id) => api.get(`/matches/${id}`),
  create: (data) => api.post('/matches', data),
  join: (id) => api.post(`/matches/${id}/join`),
  leave: (id) => api.post(`/matches/${id}/leave`),
  delete: (id) => api.delete(`/matches/${id}`),
};

export default api;
