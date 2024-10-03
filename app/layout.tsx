import React, { useEffect } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { BalanceProvider } from '../contexts/BalanceContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { useState } from 'react';

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
  const [userId, setUserId] = useState("")


    useEffect(()=>{
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id
    if(telegramId){
      setUserId(telegramId.toString())
    }
    
  })

  return (
    <html lang="en">
      <body className={inter.className}>
        <BalanceProvider userId={userId}>
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