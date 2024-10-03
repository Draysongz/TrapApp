'use client';

import React, { useState, useEffect } from 'react'
import { Trophy, Star, Zap, Users, User, Satellite } from "lucide-react"
import { Shop } from './shop'
import { Referrals } from './referrals'
import { Leaderboard } from './leaderboard'
import LandingScreen from './LandingScreen'
import Notifications from './Notifications'
import { NotificationProvider } from '../contexts/NotificationContext'
import RetroChat from './RetroChat'
import WeedLeafEasterEgg from './WeedLeafEasterEgg'
import UserProfile from './UserProfile'
import { Feedback } from './Feedback'
import Earn from './Earn';
import { InventoryItem } from '../types/inventory';
import { BalanceProvider } from '../contexts/BalanceContext';
import { TelegramWebApp } from '../telegram';
import { useBalance } from '../contexts/BalanceContext';

// Custom RetroBattery component
const RetroBattery = () => (
  <div className="relative w-6 h-3 border border-green-400 mr-1">
    <div className="absolute top-0 right-0 w-0.5 h-2 bg-green-400 -mr-1 mt-0.5"></div>
    <div className="flex h-full">
      <div className="w-1/4 h-full bg-green-400 mr-px"></div>
      <div className="w-1/4 h-full bg-green-400 mr-px"></div>
      <div className="w-1/4 h-full bg-green-400 mr-px"></div>
      <div className="w-1/4 h-full bg-transparent"></div>
    </div>
  </div>
)

export function AppComponent() {
  const [currentPage, setCurrentPage] = useState('earn')
  const [isOn, setIsOn] = useState(false)
  const [showLanding, setShowLanding] = useState(true)
  const [isClosing, setIsClosing] = useState(false)
  const [inventory, /* setInventory */] = useState<InventoryItem[]>([]);
  const [isEasterEggActive, setIsEasterEggActive] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userId, setUserId] = useState("")

  const { fetchBalances } = useBalance();

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      if (now.getHours() === 16 && now.getMinutes() === 20) {
        setIsEasterEggActive(true);
        setTimeout(() => setIsEasterEggActive(false), 60000); // Deactivate after 1 minute
      }
    };

    const interval = setInterval(checkTime, 1000); // Check every second
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const isTelegramWebAppAvailable = window.Telegram?.WebApp;
      console.log('Is Telegram WebApp available:', isTelegramWebAppAvailable);

      if (isTelegramWebAppAvailable && window.Telegram?.WebApp) {
        const telegramWebApp = window.Telegram.WebApp;
        telegramWebApp.ready();
        telegramWebApp.expand();
        
        console.log('Telegram WebApp:', telegramWebApp);
        console.log('Telegram WebApp initData:', telegramWebApp.initData);
        console.log('Telegram WebApp initDataUnsafe:', telegramWebApp.initDataUnsafe);
      } else {
        console.warn('Telegram WebApp not found. Running in standalone mode.');
      }
    } catch (error) {
      console.error('Error initializing Telegram WebApp:', error);
    }
  }, []);


  useEffect(()=>{
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id
    if(telegramId){
      setUserId(telegramId.toString())
    }
    
  })

  // const userId= '2146305061'
  const handleEnter = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShowLanding(false)
      setIsOn(true)
      setCurrentPage('earn')
    }, 500)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'rating':
        return <Leaderboard />
      case 'shop':
        return <Shop />
      case 'earn':
        return <Earn />
      case 'friends':
        return (
          <div className="space-y-8">
            <Referrals userId={userId}/>
            <RetroChat />
          </div>
        )
      default:
        return <Earn />
    }
  }

  const triggerEasterEgg = () => {
    setIsEasterEggActive(true);
    setTimeout(() => setIsEasterEggActive(false), 60000); // Deactivate after 1 minute
  };

  const handleNavClick = (label: string) => {
    if (label === 'Profile') {
      setIsProfileOpen(true);
    } else {
      setCurrentPage(label.toLowerCase());
    }
  };

  if (showLanding) {
    return <LandingScreen onEnter={handleEnter} isClosing={isClosing} />
  }

  return (
    <BalanceProvider>
      <NotificationProvider>
        <Feedback>
          <div className={`flex flex-col h-screen bg-black text-green-400 font-nokia relative overflow-hidden ${isOn ? 'turn-on' : ''}`}>
            {/* Header - Fixed */}
            <header className="bg-green-900 p-2 text-center border-b border-green-400 flex justify-between items-center">
              <div className="w-16 flex items-center space-x-1">
                <div className="flex items-center">
                  <Satellite className="w-5 h-5 retro-icon no-drag" />
                  <div className="flex space-x-px items-end ml-1" style={{ height: '20px' }}>
                    <div className="w-1 bg-green-400 opacity-50" style={{ height: '25%' }}></div>
                    <div className="w-1 bg-green-400" style={{ height: '50%' }}></div>
                    <div className="w-1 bg-green-400" style={{ height: '75%' }}></div>
                    <div className="w-1 bg-green-400" style={{ height: '100%' }}></div>
                  </div>
                </div>
              </div>
              <h1 className="text-xl font-bold pixelated glow flex-grow text-center">TrapLine</h1>
              <div className="w-16 flex items-center space-x-1 justify-end">
                <RetroBattery />
                <span className="text-xs">75%</span>
              </div>
            </header>

            {/* Notifications - Fixed position */}
            <Notifications />

            {/* Main content area - Scrollable */}
            <main className="flex-1 overflow-y-auto">
              <div className="p-2 pixelated screen-content flicker">
                {renderPage()}
              </div>
            </main>

            {/* Navigation menu - Fixed */}
            <nav className="bg-green-900 p-2 border-t border-green-400">
              <ul className="flex justify-around">
                {[
                  { icon: Trophy, label: 'Rating' },
                  { icon: Users, label: 'Friends' },
                  { icon: Zap, label: 'Earn' },
                  { icon: Star, label: 'Shop' },
                  { icon: User, label: 'Profile' },
                ].map(({ icon: Icon, label }) => (
                  <li key={label} className="flex-1">
                    <button 
                      onClick={() => handleNavClick(label)}
                      className={`w-full flex flex-col items-center justify-center p-3 rounded pixelated transition-all duration-300 ${
                        currentPage === label.toLowerCase() 
                          ? 'text-green-400 glow-text' 
                          : 'text-green-600 hover:text-green-400 hover:glow-text'
                      }`}
                    >
                      <Icon size={24} />
                      <span className="text-xs mt-1">{label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <UserProfile 
            isOpen={isProfileOpen} 
            onClose={() => setIsProfileOpen(false)} 
            inventory={inventory}
            triggerEasterEgg={triggerEasterEgg}
          />
          <WeedLeafEasterEgg isActive={isEasterEggActive} />
        </Feedback>
      </NotificationProvider>
    </BalanceProvider>
  )
}