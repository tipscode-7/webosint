import React from 'react';
import { Link } from 'react-router-dom';
import LangSwitcher from '../components/LangSwitcher';

const ContactUs = () => {
  return (
    <div className="auth-page legal-page">
      <LangSwitcher />
      <div className="legal-wrapper">
        <div className="legal-container contact-container">
          <div className="legal-header">
            <h1>Свяжитесь с нами</h1>
            <p className="legal-meta">Мы всегда рады ответить на ваши вопросы и помочь с любыми проблемами.</p>
            <hr />
          </div>
          <div className="contact-body">
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <div>
                <h3>Электронная почта</h3>
                <p><a href="mailto:supportacronicteam@mail.ru">supportacronicteam@mail.ru</a></p>
              </div>
            </div>
            <div className="contact-item">
              <i className="fas fa-clock"></i>
              <div>
                <h3>Часы работы</h3>
                <p>Пн–Пт: 10:00 – 18:00 (МСК)</p>
              </div>
            </div>
            <div className="contact-item">
              <i className="fas fa-globe"></i>
              <div>
                <h3>Веб-сайт</h3>
                <p><a href="/">www.acronic.com</a></p>
              </div>
            </div>
            <div className="contact-note">
              <p>Мы стараемся отвечать на все запросы в течение 24 часов в рабочие дни.</p>
              <p>Для вопросов, связанных с персональными данными, используйте тему письма «Конфиденциальность».</p>
            </div>
          </div>
          <div className="legal-footer">
            <Link to="/login" className="legal-back-link"><i className="fas fa-arrow-left"></i> Вернуться на сайт</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;