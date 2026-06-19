import api from '../api.js';

// Проверка авторизации – если нет токена, редирект на логин
if (!localStorage.getItem('access_token')) {
  window.location.href = '/login.html';
}

// Элементы
const consoleDiv = document.getElementById('console');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Функция добавления строки в консоль
function addConsoleLine(text, type = 'info') {
  const line = document.createElement('div');
  line.className = `line ${type}`;
  line.textContent = `> ${text}`;
  consoleDiv.appendChild(line);
  consoleDiv.scrollTop = consoleDiv.scrollHeight; // автоскролл вниз
}

// Обработчик поиска (пока заглушка)
async function performSearch(query) {
  if (!query.trim()) {
    addConsoleLine('Введите данные для поиска.', 'warning');
    return;
  }
  addConsoleLine(`Запуск поиска по: "${query}"...`, 'info');
  // Здесь позже будет вызов бэкенда и получение результатов
  // Сейчас просто симулируем задержку
  await new Promise(resolve => setTimeout(resolve, 1000));
  addConsoleLine('Результат: Информация по запросу будет здесь.', 'success');
  // В будущем: отправка POST на /api/search и получение task_id, затем WebSocket/SSE
}

searchBtn.addEventListener('click', () => performSearch(searchInput.value));
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') performSearch(searchInput.value);
});

// Выход
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login.html';
});

// Добавляем приветствие
addConsoleLine('Система готова к работе. Введите IP, телефон или ссылку.', 'info');