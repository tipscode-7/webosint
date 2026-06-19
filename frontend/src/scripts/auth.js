import api from '../api.js';

// --- Логика авторизации (была) ---

// Проверка авторизации
export function checkAuth() {
  const token = localStorage.getItem('access_token');
  if (token && window.location.pathname !== '/dashboard.html') {
    window.location.href = '/dashboard.html';
  }
}

// Страница входа
document.addEventListener('DOMContentLoaded', () => {
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
      // Получаем профиль пользователя
      const profileRes = await api.get('/profile/');
      const user = profileRes.data;
      // Проверяем подписку
      const subscription = user.subscription_type || 'free';
      const until = user.subscription_until ? new Date(user.subscription_until) : null;
      const now = new Date();
      const isActive = until ? until > now : false;
      // Сохраняем данные в localStorage для быстрого доступа
      localStorage.setItem('subscription_type', subscription);
      localStorage.setItem('subscription_until', user.subscription_until || '');
      // Если подписка активна или пользователь admin - пускаем
      if (subscription === 'admin' || (subscription !== 'free' && isActive)) {
        window.location.href = '/dashboard.html';
      } else {
        window.location.href = '/pricing.html';
      }
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
      const password2 = document.getElementById('password2');
      if (password2 && password !== password2.value) {
        alert('Пароли не совпадают');
        return;
      }
      try {
        await api.post('/register/', { email, username, password });
        alert('Регистрация успешна! Теперь войдите.');
        window.location.href = '/login.html';
      } catch (err) {
        alert('Ошибка регистрации: ' + (err.response?.data?.detail || 'Неизвестная ошибка'));
      }
    });
  }

  // --- Переключение языков на страницах логина/регистрации ---
  const langBtns = document.querySelectorAll('.lang-btn');
  let currentLang = 'ru';

  function setLanguage(lang) {
    currentLang = lang;
    langBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

    const texts = {
      ru: {
        emailPlaceholder: 'Email...',
        passwordPlaceholder: 'Пароль...',
        passwordAgainPlaceholder: 'Повторите пароль...',
        usernamePlaceholder: 'Имя пользователя...',
        loginBtn: 'Войти',
        registerBtn: 'Зарегистрироваться',
        forgot: 'Забыл пароль?',
        registerLink: 'Зарегистрироваться',
        already: 'Уже есть аккаунт? Войти',
        agree: 'Я принимаю пользовательское соглашение Terms of Service и политику конфиденциальности проекта.',
        footerCopy: '2026 Jeos. All rights reserved.',
        footerTerms: 'Terms of Use',
        footerPrivacy: 'Privacy Policy',
        footerContact: 'Contact Us',
        forgotTitle: 'Восстановление пароля',
        forgotEmailPlaceholder: 'Email...',
        forgotBtn: 'Восстановить пароль',
        forgotBack: 'Вернуться ко входу',
      },
      en: {
        emailPlaceholder: 'Email...',
        passwordPlaceholder: 'Password...',
        passwordAgainPlaceholder: 'Password again...',
        usernamePlaceholder: 'Username...',
        loginBtn: 'Login',
        registerBtn: 'Register',
        forgot: 'Forgot password?',
        registerLink: 'Register',
        already: 'Already have an account? Login',
        agree: 'I accept the Terms of Service and Privacy Policy.',
        footerCopy: '2026 Jeos. All rights reserved.',
        footerTerms: 'Terms of Use',
        footerPrivacy: 'Privacy Policy',
        footerContact: 'Contact Us',
        forgotTitle: 'Password recovery',
        forgotEmailPlaceholder: 'Email...',
        forgotBtn: 'Recover password',
        forgotBack: 'Back to login',
      }
    };

    const t = texts[lang] || texts.ru;

    // Placeholders
    document.querySelectorAll('.input-group input[type="email"]').forEach(el => el.placeholder = t.emailPlaceholder);
    document.querySelectorAll('.input-group input[type="password"]').forEach(el => {
      if (el.id === 'password') el.placeholder = t.passwordPlaceholder;
      if (el.id === 'password2') el.placeholder = t.passwordAgainPlaceholder;
    });
    document.querySelectorAll('.input-group input[type="text"]').forEach(el => el.placeholder = t.usernamePlaceholder);

    // Кнопки
    const loginBtn = document.querySelector('#loginForm button[type="submit"]');
    if (loginBtn) loginBtn.textContent = t.loginBtn;
    const registerBtn = document.querySelector('#registerForm button[type="submit"]');
    if (registerBtn) registerBtn.textContent = t.registerBtn;

    // Ссылки
    const forgotLink = document.querySelector('.forgot-link');
    if (forgotLink) forgotLink.textContent = t.forgot;
    const registerLink = document.querySelector('.register-link');
    if (registerLink) registerLink.textContent = t.registerLink;
    const bottomLink = document.querySelector('.bottom-link a');
    if (bottomLink) bottomLink.textContent = t.already;

    // Чекбокс
    const checkboxLabel = document.querySelector('.checkbox-group label span');
    if (checkboxLabel) checkboxLabel.textContent = t.agree;

    // Футер
    const footerCopy = document.querySelector('.footer .copyright');
    if (footerCopy) footerCopy.textContent = t.footerCopy;
    const footerLinks = document.querySelectorAll('.footer-links a');
    if (footerLinks.length >= 3) {
      footerLinks[0].textContent = t.footerTerms;
      footerLinks[1].textContent = t.footerPrivacy;
      footerLinks[2].textContent = t.footerContact;
    }
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  // Установить язык по умолчанию (ru)
  setLanguage('ru');
  // Для страницы forgot-password
const forgotTitle = document.querySelector('.container h2');
if (forgotTitle) forgotTitle.textContent = t.forgotTitle;
const forgotEmail = document.querySelector('#forgotForm input[type="email"]');
if (forgotEmail) forgotEmail.placeholder = t.forgotEmailPlaceholder;
const forgotBtn = document.querySelector('.forgot-btn');
if (forgotBtn) forgotBtn.textContent = t.forgotBtn;
const forgotBackLink = document.querySelector('.bottom-link a');
if (forgotBackLink) forgotBackLink.textContent = t.forgotBack;
});

// Кнопка выхода (верхняя правая)
const logoutTopBtn = document.getElementById('logoutTopBtn');
if (logoutTopBtn) {
  logoutTopBtn.addEventListener('click', () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login.html';
  });
}

// --- Восстановление пароля ---
const forgotForm = document.getElementById('forgotForm');
if (forgotForm) {
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    try {
      // Здесь будет реальный запрос к API /api/forgot-password/
      // Пока делаем заглушку:
      // await api.post('/forgot-password/', { email });
      alert('Инструкция по восстановлению пароля отправлена на ваш email (если он зарегистрирован).');
      // Можно перенаправить на логин через пару секунд
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 2000);
    } catch (err) {
      alert('Ошибка: ' + (err.response?.data?.detail || 'Неизвестная ошибка'));
    }
  });
}