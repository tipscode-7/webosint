import React, { createContext, useState, useContext, useEffect } from 'react';

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  // Инициализация из localStorage
  const getInitialState = () => {
    const type = localStorage.getItem('subscription_type') || 'free';
    const until = localStorage.getItem('subscription_until') || null;
    return { type, until };
  };

  const [subscription, setSubscription] = useState(getInitialState);

  // Сохраняем в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('subscription_type', subscription.type);
    localStorage.setItem('subscription_until', subscription.until || '');
  }, [subscription]);

  const updateSubscription = (type, until) => {
    setSubscription({ type, until });
  };

  const isActive = () => {
    if (subscription.type === 'admin') return true;
    if (subscription.type === 'free') return false;
    if (!subscription.until) return false;
    const untilDate = new Date(subscription.until);
    return untilDate > new Date();
  };

  return (
    <SubscriptionContext.Provider value={{ subscription, updateSubscription, isActive }}>
      {children}
    </SubscriptionContext.Provider>
  );
};