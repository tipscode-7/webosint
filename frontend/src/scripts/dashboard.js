import api from '../api.js';

// --- Проверка авторизации ---
if (!localStorage.getItem('access_token')) {
  window.location.href = '/login.html';
}

// --- Проверка подписки ---
const subType = localStorage.getItem('subscription_type') || 'free';
const until = localStorage.getItem('subscription_until');
const isActive = until ? new Date(until) > new Date() : false;
if (subType !== 'admin' && (subType === 'free' || !isActive)) {
  window.location.href = '/pricing.html';
}

// --- Рендеринг главной страницы (только поиск и уведомления) ---
function renderMainPage() {
  const contentArea = document.getElementById('content-area');
  if (!contentArea) return;

  contentArea.innerHTML = '';

  // --- Блок поиска и уведомлений ---
  const searchBlock = document.createElement('div');
  searchBlock.className = 'main-search-block';

  // Поле ввода
  const inputGroup = document.createElement('div');
  inputGroup.className = 'main-search-input-group';

  const searchIcon = document.createElement('i');
  searchIcon.className = 'fas fa-search search-icon-left';
  inputGroup.appendChild(searchIcon);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Введите что хотите найти...';
  searchInput.className = 'main-search-input';
  inputGroup.appendChild(searchInput);

  const searchBtn = document.createElement('button');
  searchBtn.className = 'main-search-btn';
  searchBtn.innerHTML = '<i class="fas fa-search"></i> Искать';
  inputGroup.appendChild(searchBtn);

  searchBlock.appendChild(inputGroup);

  // Кнопка уведомлений
  const notifBtn = document.createElement('button');
  notifBtn.className = 'main-notif-btn';
  notifBtn.innerHTML = '<i class="fas fa-bell"></i>';
  const badge = document.createElement('span');
  badge.className = 'notif-badge';
  badge.textContent = '3'; // заглушка, позже можно заменить на реальное число
  notifBtn.appendChild(badge);
  searchBlock.appendChild(notifBtn);

  contentArea.appendChild(searchBlock);

  // --- Обработчики для поиска и уведомлений ---
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) {
      alert('Введите поисковый запрос');
      return;
    }
    alert(`🔍 Поиск: "${query}" (заглушка)`);
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
  });

  notifBtn.addEventListener('click', () => {
    alert('🔔 У вас 3 новых уведомления (заглушка)');
  });
}

// --- Рендеринг страницы "Поиск" ---
function renderSearchPage() {
  const contentArea = document.getElementById('content-area');
  if (!contentArea) return;

  contentArea.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'search-wrapper';

  const fieldsContainer = document.createElement('div');
  fieldsContainer.className = 'search-fields';

  const fieldsData = [
    { placeholder: 'Введите ФИО...', icon: 'fa-user' },
    { placeholder: 'Введите почту...', icon: 'fa-envelope' },
    { placeholder: 'Введите ссылку на соц сеть...', icon: 'fa-link' },
    { placeholder: 'Введите ссылку на соц сеть...', icon: 'fa-link' },
    { placeholder: 'Введите город...', icon: 'fa-city' },
    { placeholder: 'Введите страну...', icon: 'fa-flag' },
    { placeholder: 'Введите место работы/учебы...', icon: 'fa-building' },
    { placeholder: 'Введите дату рождения...', icon: 'fa-calendar' },
    { placeholder: 'Введите домен...', icon: 'fa-globe' },
    { placeholder: 'Введите SteamID...', icon: 'fa-gamepad' },
    { placeholder: 'Введите ссылку на соц сеть...', icon: 'fa-link' },
    { placeholder: 'Введите ссылку на соц сеть...', icon: 'fa-link' },
    { placeholder: 'Введите IP...', icon: 'fa-network-wired' },
    { placeholder: 'Введите номер телефона...', icon: 'fa-phone' },
    { placeholder: 'Введите ник...', icon: 'fa-user-tag' },
    { placeholder: 'Введите провайдер...', icon: 'fa-wifi' },
    { placeholder: 'Введите ссылку на соц сеть...', icon: 'fa-link' },
    { placeholder: 'Введите ссылку на соц сеть...', icon: 'fa-link' },
    { placeholder: 'Введите ссылку на соц сеть...', icon: 'fa-link' }
  ];

  fieldsData.forEach(field => {
    const div = document.createElement('div');
    div.className = 'search-field';

    const icon = document.createElement('i');
    icon.className = `fas ${field.icon}`;
    div.appendChild(icon);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = field.placeholder;
    input.className = 'search-input';
    div.appendChild(input);

    fieldsContainer.appendChild(div);
  });

  wrapper.appendChild(fieldsContainer);

  const rightBlock = document.createElement('div');
  rightBlock.style.display = 'flex';
  rightBlock.style.flexDirection = 'column';
  rightBlock.style.alignItems = 'flex-start';
  rightBlock.style.gap = '10px';

  const consoleWrapper = document.createElement('div');
  consoleWrapper.className = 'console-wrapper';

  const header = document.createElement('div');
  header.className = 'console-header';
  header.innerHTML = `
    <i class="fas fa-terminal"></i>
    <span class="console-title">Console</span>
    <span class="console-subtitle">Your information output</span>
  `;
  consoleWrapper.appendChild(header);

  const output = document.createElement('div');
  output.className = 'console-output';
  output.id = 'consoleOutput';
  consoleWrapper.appendChild(output);

  rightBlock.appendChild(consoleWrapper);

  const searchBtn = document.createElement('button');
  searchBtn.className = 'search-btn';
  searchBtn.textContent = 'Найти';
  searchBtn.id = 'searchActionBtn';
  rightBlock.appendChild(searchBtn);

  wrapper.appendChild(rightBlock);
  contentArea.appendChild(wrapper);

  addConsoleMessage('Добро пожаловать в консоль поиска. Введите данные и нажмите "Найти".');

  searchBtn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('.search-input');
    const values = [];
    inputs.forEach(inp => {
      if (inp.value.trim() !== '') {
        values.push(inp.value.trim());
      }
    });
    if (values.length === 0) {
      addConsoleMessage('⚠️ Вы не ввели ни одного параметра для поиска.');
      return;
    }
    addConsoleMessage(`🔍 Запуск поиска по: ${values.join(', ')}`);
    setTimeout(() => {
      addConsoleMessage('✅ Поиск завершён. Найдено 0 результатов (заглушка).');
    }, 1500);
  });
}

function addConsoleMessage(text) {
  const output = document.getElementById('consoleOutput');
  if (!output) return;

  const line = document.createElement('div');
  line.className = 'console-line';

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timestamp = `${year}/${month}/${day}:${hours}/${minutes}/${seconds}`;

  const timestampSpan = document.createElement('span');
  timestampSpan.className = 'timestamp';
  timestampSpan.textContent = `${timestamp} `;

  const messageSpan = document.createElement('span');
  messageSpan.className = 'message';
  messageSpan.textContent = text;

  line.appendChild(timestampSpan);
  line.appendChild(messageSpan);
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

// --- Обработка иконок (луна, настройки, выход) ---
document.getElementById('themeToggle')?.addEventListener('click', () => {
  alert('Смена темы (заглушка)');
});

document.getElementById('settingsBtn')?.addEventListener('click', () => {
  alert('Настройки (заглушка)');
});

document.getElementById('logoutSidebarBtn')?.addEventListener('click', () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login.html';
});

// --- Переключение вкладок меню ---
const menuBtns = document.querySelectorAll('.menu-btn');
const contentArea = document.getElementById('content-area');

menuBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    menuBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const page = btn.dataset.page;
    console.log(`Переключено на: ${page}`);

    switch (page) {
      case 'main':
        renderMainPage();
        break;
      case 'search':
        renderSearchPage();
        break;
      case 'profiles':
        contentArea.innerHTML = `<div style="color:#929292; font-size:20px; text-align:center; margin-top:50px;">👤 Профили (в разработке)</div>`;
        break;
      case 'phones':
        contentArea.innerHTML = `<div style="color:#929292; font-size:20px; text-align:center; margin-top:50px;">📱 Телефоны (в разработке)</div>`;
        break;
      case 'social':
        contentArea.innerHTML = `<div style="color:#929292; font-size:20px; text-align:center; margin-top:50px;">🌐 Соц. сети (в разработке)</div>`;
        break;
      case 'address':
        contentArea.innerHTML = `<div style="color:#929292; font-size:20px; text-align:center; margin-top:50px;">📍 Адрес (в разработке)</div>`;
        break;
      case 'documents':
        contentArea.innerHTML = `<div style="color:#929292; font-size:20px; text-align:center; margin-top:50px;">📄 Документы (в разработке)</div>`;
        break;
      case 'finance':
        contentArea.innerHTML = `<div style="color:#929292; font-size:20px; text-align:center; margin-top:50px;">💰 Финансы (в разработке)</div>`;
        break;
      case 'transport':
        contentArea.innerHTML = `<div style="color:#929292; font-size:20px; text-align:center; margin-top:50px;">🚗 Транспорт (в разработке)</div>`;
        break;
      case 'courts':
        contentArea.innerHTML = `<div style="color:#929292; font-size:20px; text-align:center; margin-top:50px;">⚖️ Судебные дела (в разработке)</div>`;
        break;
      case 'databases':
        contentArea.innerHTML = `<div style="color:#929292; font-size:20px; text-align:center; margin-top:50px;">🗄️ Базы данных (в разработке)</div>`;
        break;
      case 'monitoring':
        contentArea.innerHTML = `<div style="color:#929292; font-size:20px; text-align:center; margin-top:50px;">👁️ Мониторинг (в разработке)</div>`;
        break;
      default:
        contentArea.innerHTML = '';
    }
  });
});

// --- Инициализация: показываем главное меню ---
renderMainPage();