import React, { useState } from 'react';

const SearchPage = () => {
  const [consoleMessages, setConsoleMessages] = useState([
    { timestamp: new Date(), text: 'Добро пожаловать в консоль поиска. Введите данные и нажмите "Найти".' }
  ]);
  const [fields, setFields] = useState(
    Array(19).fill('').map((_, i) => ({
      placeholder: ['Введите ФИО...', 'Введите почту...', 'Введите ссылку на соц сеть...', 'Введите ссылку на соц сеть...', 'Введите город...', 'Введите страну...', 'Введите место работы/учебы...', 'Введите дату рождения...', 'Введите домен...', 'Введите SteamID...', 'Введите ссылку на соц сеть...', 'Введите ссылку на соц сеть...', 'Введите IP...', 'Введите номер телефона...', 'Введите ник...', 'Введите провайдер...', 'Введите ссылку на соц сеть...', 'Введите ссылку на соц сеть...', 'Введите ссылку на соц сеть...'][i] || '',
      icon: ['fa-user', 'fa-envelope', 'fa-link', 'fa-link', 'fa-city', 'fa-flag', 'fa-building', 'fa-calendar', 'fa-globe', 'fa-gamepad', 'fa-link', 'fa-link', 'fa-network-wired', 'fa-phone', 'fa-user-tag', 'fa-wifi', 'fa-link', 'fa-link', 'fa-link'][i] || 'fa-link',
      value: ''
    }))
  );

  const addConsoleMessage = (text) => {
    const timestamp = new Date();
    setConsoleMessages(prev => [...prev, { timestamp, text }]);
  };

  const handleSearch = () => {
    const filled = fields.filter(f => f.value.trim() !== '');
    if (filled.length === 0) {
      addConsoleMessage('⚠️ Вы не ввели ни одного параметра для поиска.');
      return;
    }
    const values = filled.map(f => f.value.trim());
    addConsoleMessage(`🔍 Запуск поиска по: ${values.join(', ')}`);
    setTimeout(() => {
      addConsoleMessage('✅ Поиск завершён. Найдено 0 результатов (заглушка).');
    }, 1500);
  };

  const formatTimestamp = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${y}/${m}/${d}:${h}/${min}/${s}`;
  };

  return (
    <div className="search-wrapper">
      <div className="search-fields">
        {fields.map((field, idx) => (
          <div key={idx} className="search-field">
            <i className={`fas ${field.icon}`}></i>
            <input
              type="text"
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e) => {
                const newFields = [...fields];
                newFields[idx].value = e.target.value;
                setFields(newFields);
              }}
            />
          </div>
        ))}
      </div>
      <div className="search-right">
        <div className="console-wrapper">
          <div className="console-header">
            <i className="fas fa-terminal"></i>
            <span className="console-title">Console</span>
            <span className="console-subtitle">Your information output</span>
          </div>
          <div className="console-output">
            {consoleMessages.map((msg, i) => (
              <div key={i} className="console-line">
                <span className="timestamp">{formatTimestamp(msg.timestamp)} </span>
                <span className="message">{msg.text}</span>
              </div>
            ))}
          </div>
        </div>
        <button className="search-btn" onClick={handleSearch}>Найти</button>
      </div>
    </div>
  );
};

export default SearchPage;