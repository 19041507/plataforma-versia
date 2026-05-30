'use client';

import { useState, useEffect } from 'react';

export function useNotifications() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTooltip, setNotificationTooltip] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('versia_notifications_enabled');
    if (saved !== null) {
      setNotificationsEnabled(saved === 'true');
    }
  }, []);

  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem('versia_notifications_enabled', String(newState));
    
    setNotificationTooltip(newState ? "Notificações ativadas" : "Notificações desativadas");
    
    // Auto-hide tooltip
    setTimeout(() => setNotificationTooltip(null), 2000);
  };

  return {
    notificationsEnabled,
    notificationTooltip,
    toggleNotifications
  };
}