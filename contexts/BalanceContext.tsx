'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Pusher from 'pusher-js'; // Import Pusher client

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
  refillEnergy: () => Promise<void>;
  updateClickerInventory: (amount: number) => Promise<void>;
  fetchBalances: () => Promise<void>;
}

    const pusher = new Pusher('d70648a990c9399479e1', {
      cluster: 'eu',
    });

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};

interface BalanceProviderProps {
  userId: string; // Accept userId as a prop
  children: React.ReactNode;
}

export const BalanceProvider: React.FC<BalanceProviderProps>  = ({ userId, children }) => {
  const [mainBalance, setMainBalance] = useState<number>(0);
  const [drugMoneyBalance, setDrugMoneyBalance] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(100);
  const [clickerInventory, setClickerInventory] = useState<number>(0);
  const maxEnergy = 100;

  // const telegramUserId = '2146305061'
  const telegramUserId = userId
  alert(userId)
  

  // Function to fetch balances using the API route
  const fetchBalances = useCallback(async () => {
    try {
      
      if (!telegramUserId) {
        console.error('Telegram user ID not found');
        return;
      }

      // Use the new API route to fetch balances
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

  // Initialize Pusher and subscribe to balance updates
  useEffect(() => {


    // const telegramWebApp = window.Telegram?.WebApp;
    // const telegramUserId = telegramWebApp?.initDataUnsafe?.user?.id;
    
    if (telegramUserId) {
      // Subscribe to the user's channel for real-time updates
      const channel = pusher.subscribe(`user-${telegramUserId}`);

      // Listen for 'balance-updated' event
      channel.bind('balance-updated', (data: any) => {
        if (data.mainBalance !== undefined) setMainBalance(Number(data.mainBalance));
        if (data.drugMoneyBalance !== undefined) setDrugMoneyBalance(Number(data.drugMoneyBalance));
        if (data.energy !== undefined) setEnergy(Number(data.energy));
        if (data.clickerInventory !== undefined) setClickerInventory(Number(data.clickerInventory));
      });
    }

    // Clean up the Pusher connection when the component unmounts
    return () => {
      if (telegramUserId) {
        pusher.unsubscribe(`user-${telegramUserId}`);
      }
      pusher.disconnect();
    };
  }, []);

  // Function to update the main balance
  const updateMainBalance = useCallback(async (amount: number) => {
    try {
      // const telegramWebApp = window.Telegram?.WebApp;
      // const telegramUserId = telegramWebApp?.initDataUnsafe?.user?.id;

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

  // Function to update drug money balance
  const updateDrugMoneyBalance = useCallback(async (amount: number) => {
    try {
      // const telegramWebApp = window.Telegram?.WebApp;
      // const telegramUserId = telegramWebApp?.initDataUnsafe?.user?.id;

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
    await fetchBalances();
  }, [updateDrugMoneyBalance, updateMainBalance, fetchBalances]);

  // Function to update energy
  const updateEnergy = useCallback(async (amount: number) => {
    try {
      // const telegramWebApp = window.Telegram?.WebApp;
      // const telegramUserId = telegramWebApp?.initDataUnsafe?.user?.id;

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

  // Function to refill energy
  const refillEnergy = useCallback(async () => {
    const energyToRefill = maxEnergy - energy;
    if (energyToRefill > 0) {
      await updateEnergy(energyToRefill);
    }
  }, [energy, maxEnergy, updateEnergy]);

  // Function to update clicker inventory
  const updateClickerInventory = useCallback(async (amount: number) => {
    try {
      // const telegramWebApp = window.Telegram?.WebApp;
      // const telegramUserId = telegramWebApp?.initDataUnsafe?.user?.id;

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
      refillEnergy,
      updateClickerInventory,
      fetchBalances
    }}>
      {children}
    </BalanceContext.Provider>
  );
};
