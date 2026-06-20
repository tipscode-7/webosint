import React, { useState } from 'react';

const MainPage = () => {
  const [query, setQuery] = useState('');
  const [notifications] = useState(3);

  const handleSearch = () => {
    if (!query.trim()) {
      alert('Введите поисковый запрос');
      return;
    }
    alert(`🔍 Поиск: "${query}" (заглушка)`);
  };

  return (
    <>
      <div className="main-search-block">
        <div className="main-search-input-group">
          <i className="fas fa-search search-icon-left"></i>
          <input
            type="text"
            className="main-search-input"
            placeholder="Введите что хотите найти..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="main-search-btn" onClick={handleSearch}>
            <i className="fas fa-search"></i> Искать
          </button>
        </div>
        <button className="main-notif-btn" onClick={() => alert('🔔 У вас 3 новых уведомления (заглушка)')}>
          <i className="fas fa-bell"></i>
          <span className="notif-badge">{notifications}</span>
        </button>
      </div>
      <div style={{ color: '#929292', fontSize: '20px', textAlign: 'center', marginTop: '50px' }}>
        Здесь будет контент главной страницы
      </div>
    </>
  );
};

export default MainPage;