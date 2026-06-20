import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import LangSwitcher from '../components/LangSwitcher';
import api from '../services/api';
import earth from '../assets/earth.png';

const Pricing = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { updateSubscription } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
   if (!user) navigate('/login');
 }, [user, navigate]);

  const texts = {
    ru: {
      welcome: 'Добро пожаловать, ',
      desc: 'ACRONIC — Платформа для поиска и анализа разной информации о человеке и его деятельности из открытых источников.',
      day: 'Доступ на день',
      week: 'Доступ на неделю',
      month: 'Доступ на месяц',
      year: 'Доступ на год',
      dayBtn: 'Приобрести за 2999₽',
      weekBtn: 'Приобрести за 4999₽',
      monthBtn: 'Приобрести за 9999₽',
      yearBtn: 'Приобрести за 19999₽',
    },
    en: {
      welcome: 'Welcome, ',
      desc: 'ACRONIC — Platform for searching and analyzing various information about a person and their activities from open sources.',
      day: 'Day Access',
      week: 'Week Access',
      month: 'Month Access',
      year: 'Year Access',
      dayBtn: 'Buy for 2999₽',
      weekBtn: 'Buy for 4999₽',
      monthBtn: 'Buy for 9999₽',
      yearBtn: 'Buy for 19999₽',
    },
  };

  const t = texts[lang] || texts.ru;

  const handleSubscribe = async (plan) => {
    try {
      const res = await api.post('/subscribe/', { plan });
      if (res.data.success) {
        updateSubscription(res.data.subscription_type, res.data.subscription_until);
        navigate('/dashboard');
      }
    } catch (error) {
      alert('Ошибка оформления подписки: ' + (error.response?.data?.detail || 'Попробуйте позже'));
    }
  };

  return (
    <div className="auth-page pricing-new">
      <LangSwitcher />
      <div className="pricing-wrapper-new">
        <div className="welcome-block">
          <div className="welcome-text">
            <h1>{t.welcome}<span className="username-highlight">{user?.username || 'Иван Петров'}</span></h1>
            <p className="welcome-desc">{t.desc}</p>
          </div>
          <div className="welcome-image">
            <img src={earth} alt="Earth" />
          </div>
        </div>
        <div className="pricing-grid-new">
          {[
            { plan: 'day', title: t.day, btn: t.dayBtn },
            { plan: 'week', title: t.week, btn: t.weekBtn },
            { plan: 'month', title: t.month, btn: t.monthBtn },
            { plan: 'year', title: t.year, btn: t.yearBtn },
          ].map((item, idx) => (
            <div key={idx} className={`pricing-card-new card-${item.plan}`}>
              <div className="card-top"><h2>{item.title}</h2></div>
              <div className="card-body">
                <p className="card-description">
                  🔍 Открой мир, скрытый за пикселями. Мы превращаем хаос данных в стройную картину мира. С нашей подпиской ты получишь ключи к цифровому следу, который оставляет каждый.<br /><br />
                  🚀 Молниеносный парсинг<br />
                  🕵️ Глубокая аналитика связей<br />
                  📊 Эксклюзивные дашборды<br />
                  🔒 Приватность и анонимность<br /><br />
                  Стань детективом нового поколения. 👁️
                </p>
              </div>
              <div className="card-footer">
                <button className="subscribe-btn" onClick={() => handleSubscribe(item.plan)}>{item.btn}</button>
              </div>
              <img src={earth} alt="" className={`earth-deco deco-${item.plan}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;