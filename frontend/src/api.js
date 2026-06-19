import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // все запросы будут идти на /api/...
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен в каждый запрос, если он есть
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Обработка ошибки 401 (токен просрочен) – попробуем обновить
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        const res = await axios.post('/api/token/refresh/', { refresh });
        localStorage.setItem('access_token', res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (e) {
        // Если не удалось обновить – выходим из системы
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login.html';
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;