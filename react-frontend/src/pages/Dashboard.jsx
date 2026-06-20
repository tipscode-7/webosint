import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useLanguage } from '../context/LanguageContext';
import MainPage from '../components/MainPage';
import SearchPage from '../components/SearchPage';
import logo from '../assets/logo.png';
import profileIcon from '../assets/profile-icon.png';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { isActive } = useSubscription();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('main');

  useEffect(() => {
   if (!isActive() && user?.subscription_type !== 'admin') {
     navigate('/pricing');
   }
  }, [isActive, user, navigate]);
  
 if (!user) return <div>Загрузка...</div>;

  const renderContent = () => {
    switch (activeTab) {
      case 'main':
        return <MainPage />;
      case 'search':
        return <SearchPage />;
      default:
        return <div style={{ color: '#929292', fontSize: '20px', textAlign: 'center', marginTop: '50px' }}>В разработке</div>;
    }
  };

  const menuItems = [
    { id: 'main', icon: 'fa-home', label: 'Главная' },
    { id: 'search', icon: 'fa-search', label: 'Поиск' },
    { id: 'profiles', icon: 'fa-user', label: 'Профили' },
    { id: 'phones', icon: 'fa-phone', label: 'Телефоны' },
    { id: 'social', icon: 'fa-share-alt', label: 'Соц. сети' },
    { id: 'address', icon: 'fa-map-marker-alt', label: 'Адрес' },
    { id: 'documents', icon: 'fa-file', label: 'Документ' },
    { id: 'finance', icon: 'fa-coins', label: 'Финансы' },
    { id: 'transport', icon: 'fa-car', label: 'Транспорт' },
    { id: 'courts', icon: 'fa-gavel', label: 'Судебные дела' },
    { id: 'databases', icon: 'fa-database', label: 'Базы данных' },
    { id: 'monitoring', icon: 'fa-eye', label: 'Мониторинг' },
  ];

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="sidebar-top">
          <img src={logo} alt="Logo" className="sidebar-logo" />
        </div>
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <i className={`fas ${item.icon}`}></i> {item.label}
            </button>
          ))}
        </nav>

        <div className="subscription-block">
          <div className="sub-header">
            <span className="sub-label">ТАРИФ:</span>
            <span className="sub-plan">{user.subscription_type.toUpperCase()}</span>
          </div>
          <div className="sub-days">
            <span className="sub-days-label">Осталось дней:</span>
            <span className="sub-days-count">134</span>
            <span className="sub-days-total">/500</span>
          </div>
          <div className="sub-progress">
            <div className="sub-progress-bar" style={{ width: '26.8%' }}></div>
          </div>
          <button className="sub-upgrade-btn" onClick={() => navigate('/pricing')}>Улучшить тариф</button>
        </div>

        <div className="profile-block">
          <img src={profileIcon} alt="Profile" className="profile-avatar" />
          <div className="profile-info">
            <div className="profile-username">{user.username || 'Иван Петров'}</div>
            <div className="profile-role">{user.subscription_type === 'admin' ? 'Администратор' : 'Пользователь'}</div>
          </div>
        </div>

        <div className="sidebar-bottom">
          <button className="icon-btn" onClick={() => alert('Смена темы (заглушка)')}><i className="fas fa-moon"></i></button>
          <button className="icon-btn" onClick={() => alert('Настройки (заглушка)')}><i className="fas fa-cog"></i></button>
          <button className="icon-btn" onClick={logout}><i className="fas fa-sign-out-alt"></i></button>
        </div>
        <div className="sidebar-version">version:0.0.1</div>
      </aside>

      <main className="main-content">
        <div className="center-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;