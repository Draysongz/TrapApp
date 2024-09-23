import { TelegramWebApp } from '../telegram';

const getTelegramWebApp = (): TelegramWebApp | undefined => {
  return (window as Window & typeof globalThis).Telegram?.WebApp;
};

export const impactOccurred = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
  getTelegramWebApp()?.HapticFeedback.impactOccurred(style);
};

export const notificationOccurred = (type: 'error' | 'success' | 'warning') => {
  getTelegramWebApp()?.HapticFeedback.notificationOccurred(type);
};

export const selectionChanged = () => {
  getTelegramWebApp()?.HapticFeedback.selectionChanged();
};