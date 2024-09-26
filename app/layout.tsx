import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { BalanceProvider } from '../contexts/BalanceContext';
import { NotificationProvider } from '../contexts/NotificationContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TrapLine',
  description: 'Underground economy simulator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BalanceProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </BalanceProvider>
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id="retro-filter">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="atop" />
            </filter>
          </defs>
        </svg>
      </body>
    </html>
  );
}