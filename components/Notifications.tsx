import React, { useEffect, useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();
  const [currentNotification, setCurrentNotification] = useState<{ id: number; message: string } | null>(null);

  useEffect(() => {
    if (notifications.length > 0 && !currentNotification) {
      setCurrentNotification(notifications[0]);
    }
  }, [notifications, currentNotification]);

  useEffect(() => {
    if (currentNotification) {
      const timer = setTimeout(() => {
        removeNotification(currentNotification.id);
        setCurrentNotification(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentNotification, removeNotification]);

  if (!currentNotification) return null;

  return (
    <div className="fixed top-16 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <div className="bg-green-900 border border-green-400 text-green-400 px-4 py-2 rounded-lg shadow-lg text-sm pixelated animate-slideDown">
        {currentNotification.message}
      </div>
    </div>
  );
};

export default Notifications;