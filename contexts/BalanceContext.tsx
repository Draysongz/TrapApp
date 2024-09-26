'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface BalanceContextType {
  mainBalance: number;
  drugMoneyBalance: number;
  energy: number;
  maxEnergy: number;
  clickerInventory: number;
  updateMainBalance: (amount: number) => Promise<void>;
  updateDrugMoneyBalance: (amount: number) => Promise<void>;
  updateBothBalances: (drugMoneyAmount: number, mainAmount: number) => Promise<void>;
  updateEnergy: (amount: number) => Promise<void>;
  refillEnergy: () => Promise<void>; // Add this line
  updateClickerInventory: (amount: number) => Promise<void>;
  fetchBalances: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};

export const BalanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mainBalance, setMainBalance] = useState<number>(0);
  const [drugMoneyBalance, setDrugMoneyBalance] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(100);
  const [clickerInventory, setClickerInventory] = useState<number>(0);
  const maxEnergy = 100;

  const fetchBalances = useCallback(async () => {
    try {
      const telegramWebApp = window.Telegram?.WebApp;
      const telegramUserId = telegramWebApp?.initDataUnsafe?.user?.id;
      if (!telegramUserId) {
        console.error('Telegram user ID not found');
        return;
      }
      const response = await fetch(`/api/user/balances?telegramId=${telegramUserId}`);
      
      if (response.ok) {
        const data = await response.json();
        setMainBalance(Number(data.mainBalance));
        setDrugMoneyBalance(Number(data.drugMoneyBalance));
        setEnergy(Number(data.energy));
        setClickerInventory(Number(data.clickerInventory));
      } else {
        console.error('Failed to fetch balances');
      }
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  }, []);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const updateMainBalance = useCallback(async (amount: number) => {
    try {
      const telegramWebApp = window.Telegram?.WebApp;
      const telegramUserId = telegramWebApp?.initDataUnsafe?.user?.id;
      if (!telegramUserId) {
        console.error('Telegram user ID not found');
        return;
      }
      const response = await fetch('/api/user/update-main-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: telegramUserId, amount }),
      });
      if (response.ok) {
        const data = await response.json();
        setMainBalance(data.newBalance);
      } else {
        console.error('Failed to update main balance');
      }
    } catch (error) {
      console.error('Error updating main balance:', error);
    }
  }, []);

  const updateDrugMoneyBalance = useCallback(async (amount: number) => {
    try {
      const telegramWebApp = window.Telegram?.WebApp;
      const telegramUserId = telegramWebApp?.initDataUnsafe?.user?.id;
      if (!telegramUserId) {
        console.error('Telegram user ID not found');
        return;
      }
      const response = await fetch('/api/user/update-drug-money-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: telegramUserId, amount }),
      });
      if (response.ok) {
        const data = await response.json();
        setDrugMoneyBalance(data.newBalance);
      } else {
        console.error('Failed to update drug money balance');
      }
    } catch (error) {
      console.error('Error updating drug money balance:', error);
    }
  }, []);

  const updateBothBalances = useCallback(async (drugMoneyAmount: number, mainAmount: number) => {
    await updateDrugMoneyBalance(drugMoneyAmount);
    await updateMainBalance(mainAmount);
    await fetchBalances(); // Add this line to refresh balances after updating
  }, [updateDrugMoneyBalance, updateMainBalance, fetchBalances]);

  const updateEnergy = useCallback(async (amount: number) => {
    try {
      const telegramWebApp = window.Telegram?.WebApp;
      const telegramUserId = telegramWebApp?.initDataUnsafe?.user?.id;
      if (!telegramUserId) {
        console.error('Telegram user ID not found');
        return;
      }
      const response = await fetch('/api/user/update-energy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: telegramUserId, amount }),
      });
      if (response.ok) {
        const data = await response.json();
        setEnergy(data.newEnergy);
      } else {
        console.error('Failed to update energy');
      }
    } catch (error) {
      console.error('Error updating energy:', error);
    }
  }, []);

  const refillEnergy = useCallback(async () => {
    const energyToRefill = maxEnergy - energy;
    if (energyToRefill > 0) {
      await updateEnergy(energyToRefill);
    }
  }, [energy, maxEnergy, updateEnergy]);

  const updateClickerInventory = useCallback(async (amount: number) => {
    try {
      const telegramWebApp = window.Telegram?.WebApp;
      const telegramUserId = telegramWebApp?.initDataUnsafe?.user?.id;
      if (!telegramUserId) {
        console.error('Telegram user ID not found');
        return;
      }
      const response = await fetch('/api/user/update-clicker-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: telegramUserId, amount }),
      });
      if (response.ok) {
        const data = await response.json();
        setClickerInventory(data.newInventory);
      } else {
        console.error('Failed to update clicker inventory');
      }
    } catch (error) {
      console.error('Error updating clicker inventory:', error);
    }
  }, []);

  return (
    <BalanceContext.Provider value={{ 
      mainBalance, 
      drugMoneyBalance, 
      energy, 
      maxEnergy, 
      clickerInventory,
      updateMainBalance, 
      updateDrugMoneyBalance,
      updateBothBalances, 
      updateEnergy,
      refillEnergy, // Add this line
      updateClickerInventory,
      fetchBalances 
    }}>
      {children}
    </BalanceContext.Provider>
  );
};