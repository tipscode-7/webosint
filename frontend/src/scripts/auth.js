import api from '../api.js';

// Функция проверки авторизации – если пользователь уже залогинен, редиректим на дашборд
export function checkAuth() {
  const token = localStorage.getItem('access_token');
  if (token && window.location.pathname !== '/dashboard.html') {
    window.location.href = '/dashboard.html';
  }
}

// Логика для страницы входа
document.addEventListener('DOMContentLoaded', () => {
  // Если на странице логина и уже есть токен – редирект
  if (window.location.pathname.includes('login') && localStorage.getItem('access_token')) {
    window.location.href = '/dashboard.html';
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      try {
        const res = await api.post('/login/', { email, password });
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        window.location.href = '/dashboard.html';
      } catch (err) {
        alert('Ошибка входа: ' + (err.response?.data?.detail || 'Неизвестная ошибка'));
      }
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      try {
        await api.post('/register/', { email, username, password });
        alert('Регистрация успешна! Теперь войдите.');
        window.location.href = '/login.html';
      } catch (err) {
        alert('Ошибка регистрации: ' + (err.response?.data?.detail || 'Неизвестная ошибка'));
      }
    });
  }
});