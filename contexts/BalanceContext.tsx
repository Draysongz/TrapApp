'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface BalanceContextType {
  balance: number;
  energy: number;
  maxEnergy: number;
  updateBalance: (amount: number) => void;
  updateEnergy: (amount: number) => void;
  fetchBalance: () => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};

export const BalanceProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [energy, setEnergy] = useState(100);
  const maxEnergy = 100;

  const updateBalance = (amount: number) => {
    setBalance(prevBalance => prevBalance + amount);
  };

  const updateEnergy = (amount: number) => {
    setEnergy(prevEnergy => Math.max(0, Math.min(maxEnergy, prevEnergy + amount)));
  };

  const fetchBalance = () => {
    // Here you would typically fetch the balance from an API
    // For now, we'll just set a default balance
    setBalance(1000);
    setEnergy(100);
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <BalanceContext.Provider value={{ balance, energy, maxEnergy, updateBalance, updateEnergy, fetchBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};