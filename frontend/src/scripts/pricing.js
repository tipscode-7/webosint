import api from '../api.js';

if (!localStorage.getItem('access_token')) {
  window.location.href = '/login.html';
}

// Обработка кнопок (обе кнопки)
const buttons = document.querySelectorAll('.card-btn-large');
buttons.forEach(btn => {
  btn.addEventListener('click', async () => {
    const plan = btn.dataset.plan;
    try {
      // В реальности здесь POST на /api/subscribe/
      const res = await api.post('/subscribe/', { plan });
      if (res.data.success) {
        localStorage.setItem('subscription_type', res.data.subscription_type);
        localStorage.setItem('subscription_until', res.data.subscription_until);
        window.location.href = '/dashboard.html';
      }
    } catch (err) {
      alert('Ошибка оформления подписки: ' + (err.response?.data?.detail || 'Попробуйте позже'));
    }
  });
});

// --- Переключение языков ---
const langBtns = document.querySelectorAll('.lang-btn');
function setLanguage(lang) {
  langBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
  const texts = {
    ru: {
      title: 'Выберите тариф',
      monthBtn: 'Подключить за 499₽ В месяц',
      yearBtn: 'Подключить за 4999₽ В год',
      logout: 'Выйти',
    },
    en: {
      title: 'Choose a plan',
      monthBtn: 'Subscribe for 499₽ per month',
      yearBtn: 'Subscribe for 4999₽ per year',
      logout: 'Logout',
    }
  };
  const t = texts[lang] || texts.ru;
  document.querySelector('.container h2').textContent = t.title;
  // Обновляем текст кнопок
  const btns = document.querySelectorAll('.card-btn-large');
  if (btns.length >= 2) {
    btns[0].textContent = t.monthBtn;
    btns[1].textContent = t.yearBtn;
  }
  // Ссылка "Выйти"
  const logoutLink = document.querySelector('.bottom-link a');
  if (logoutLink) logoutLink.textContent = t.logout;
}

// Кнопка выхода (верхняя правая)
const logoutTopBtn = document.getElementById('logoutTopBtn');
if (logoutTopBtn) {
  logoutTopBtn.addEventListener('click', () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login.html';
  });
}

langBtns.forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});
setLanguage('ru');