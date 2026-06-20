import React, { createContext, useState, useContext } from 'react';

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState({
    type: 'free',
    until: null,
  });

  const updateSubscription = (type, until) => {
    setSubscription({ type, until });
    localStorage.setItem('subscription_type', type);
    localStorage.setItem('subscription_until', until || '');
  };

  // Проверка активности
  const isActive = () => {
    if (subscription.type === 'admin') return true;
    if (subscription.type === 'free') return false;
    const untilDate = new Date(subscription.until);
    return untilDate > new Date();
  };

  return (
    <SubscriptionContext.Provider value={{ subscription, updateSubscription, isActive }}>
      {children}
    </SubscriptionContext.Provider>
  );
};