import api from '../api.js';

// Проверка авторизации
if (!localStorage.getItem('access_token')) {
  window.location.href = '/login.html';
}

// --- Обработка кнопок подписки (новый класс .subscribe-btn) ---
const buttons = document.querySelectorAll('.subscribe-btn');
buttons.forEach(btn => {
  btn.addEventListener('click', async () => {
    const plan = btn.dataset.plan; // day, week, month, year
    try {
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
let currentLang = 'ru';

function setLanguage(lang) {
  currentLang = lang;
  langBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

  const texts = {
    ru: {
      welcome: 'Добро пожаловать, ',
      username: 'Иван Петров', // можно заменить на реальное имя из localStorage
      desc: 'Jeos — Платформа для поиска и анализа разной информации о человеке и его деятельности из открытых источников.',
      dayTitle: 'Доступ на день',
      weekTitle: 'Доступ на неделю',
      monthTitle: 'Доступ на месяц',
      yearTitle: 'Доступ на год',
      dayBtn: 'Приобрести за 2999₽',
      weekBtn: 'Приобрести за 4999₽',
      monthBtn: 'Приобрести за 9999₽',
      yearBtn: 'Приобрести за 19999₽',
    },
    en: {
      welcome: 'Welcome, ',
      username: 'Ivan Petrov',
      desc: 'Jeos — Platform for searching and analyzing various information about a person and their activities from open sources.',
      dayTitle: 'Day Access',
      weekTitle: 'Week Access',
      monthTitle: 'Month Access',
      yearTitle: 'Year Access',
      dayBtn: 'Buy for 2999₽',
      weekBtn: 'Buy for 4999₽',
      monthBtn: 'Buy for 9999₽',
      yearBtn: 'Buy for 19999₽',
    }
  };

  const t = texts[lang] || texts.ru;

  // Обновление приветственного блока
  const welcomeH1 = document.querySelector('.welcome-text h1');
  if (welcomeH1) {
    welcomeH1.innerHTML = `${t.welcome}<span class="username-highlight">${t.username}</span>`;
  }
  const welcomeDesc = document.querySelector('.welcome-desc');
  if (welcomeDesc) welcomeDesc.textContent = t.desc;

  // Обновление заголовков карточек и кнопок
  const cards = document.querySelectorAll('.pricing-card-new');
  const titles = [t.dayTitle, t.weekTitle, t.monthTitle, t.yearTitle];
  const btnTexts = [t.dayBtn, t.weekBtn, t.monthBtn, t.yearBtn];
  cards.forEach((card, index) => {
    const titleEl = card.querySelector('.card-top h2');
    if (titleEl && titles[index]) titleEl.textContent = titles[index];
    const btn = card.querySelector('.subscribe-btn');
    if (btn && btnTexts[index]) btn.textContent = btnTexts[index];
  });
}

// Инициализация активной кнопки языка
langBtns.forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

// Устанавливаем язык по умолчанию (ru)
setLanguage('ru');

// Кнопка выхода (если есть, но в новом дизайне её нет – оставляем на всякий случай)
const logoutBtn = document.getElementById('logoutTopBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login.html';
  });
}