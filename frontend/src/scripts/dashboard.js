import api from '../api.js';

// --- Проверка авторизации ---
if (!localStorage.getItem('access_token')) {
  window.location.href = '/login.html';
}

// --- Элементы ---
const consoleDiv = document.getElementById('console');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Функция добавления строки в консоль (оставлена для будущего)
function addConsoleLine(text, type = 'info') {
  if (!consoleDiv) return;
  const line = document.createElement('div');
  line.className = `line ${type}`;
  line.textContent = `> ${text}`;
  consoleDiv.appendChild(line);
  consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

// --- Время сессии ---
const startTime = Date.now();
const sessionTimeEl = document.getElementById('sessionTime');

function updateSessionTime() {
  if (!sessionTimeEl) return;
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;
  // Определяем текущий язык (если есть)
  const lang = document.querySelector('.lang-btn.active')?.dataset.lang || 'ru';
  const prefix = lang === 'ru' ? 'сессия' : 'session';
  sessionTimeEl.textContent =
    `${prefix}: ${hours}h:${String(minutes).padStart(2, '0')}min:${String(seconds).padStart(2, '0')}sec`;
}

updateSessionTime();
setInterval(updateSessionTime, 1000);

// --- Поиск (заглушка) ---
async function performSearch(query) {
  if (!query.trim()) {
    addConsoleLine('Введите данные для поиска.', 'warning');
    return;
  }
  addConsoleLine(`Запуск поиска по: "${query}"...`, 'info');
  await new Promise(resolve => setTimeout(resolve, 1000));
  addConsoleLine('Результат: Информация по запросу будет здесь.', 'success');
}

if (searchBtn) {
  searchBtn.addEventListener('click', () => performSearch(searchInput.value));
}
if (searchInput) {
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch(searchInput.value);
  });
}

// --- Выход ---
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login.html';
  });
}

// --- Переключение языков на дашборде ---
const langBtns = document.querySelectorAll('.lang-btn');
let currentLang = 'ru';

function setDashboardLanguage(lang) {
  currentLang = lang;
  langBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

  const texts = {
    ru: {
      search: 'поиск',
      monitor: 'слежка',
      history: 'история поиска',
      settings: 'настройки',
      logout: 'выйти',
      username: 'Иван Петров',
      role: 'Администратор',
    },
    en: {
      search: 'search',
      monitor: 'monitor',
      history: 'search history',
      settings: 'settings',
      logout: 'logout',
      username: 'Ivan Petrov',
      role: 'Administrator',
    }
  };

  const t = texts[lang] || texts.ru;
  document.querySelector('.username').textContent = t.username;
  document.querySelector('.user-role').textContent = t.role;

  const menuBtns = document.querySelectorAll('.menu-btn');
  const btnTexts = [t.search, t.monitor, t.history, t.settings, t.logout];
  menuBtns.forEach((btn, i) => {
    const icon = btn.querySelector('i');
    if (icon) {
      btn.innerHTML = '';
      btn.appendChild(icon);
      btn.appendChild(document.createTextNode(' ' + btnTexts[i]));
    }
  });
  // Обновить время сессии (префикс)
  updateSessionTime();
}

langBtns.forEach(btn => {
  btn.addEventListener('click', () => setDashboardLanguage(btn.dataset.lang));
});

// Установить язык по умолчанию (ru)
setDashboardLanguage('ru');

// Проверка авторизации и подписки
if (!localStorage.getItem('access_token')) {
  window.location.href = '/login.html';
}
const subType = localStorage.getItem('subscription_type') || 'free';
const until = localStorage.getItem('subscription_until');
const isActive = until ? new Date(until) > new Date() : false;
if (subType !== 'admin' && (subType === 'free' || !isActive)) {
  window.location.href = '/pricing.html';
}