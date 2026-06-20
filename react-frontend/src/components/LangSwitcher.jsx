import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import ruFlag from '../assets/ru-flag.png';
import enFlag from '../assets/en-flag.png';

const LangSwitcher = () => {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <div className="lang-switcher">
      <button
        className={`lang-btn ${lang === 'ru' ? 'active' : ''}`}
        onClick={() => toggleLanguage('ru')}
      >
        <img src={ruFlag} alt="RU" width="15" height="10" />
      </button>
      <button
        className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
        onClick={() => toggleLanguage('en')}
      >
        <img src={enFlag} alt="EN" width="15" height="10" />
      </button>
    </div>
  );
};

export default LangSwitcher;