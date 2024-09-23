// components/DrugLabClicker.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useBalance } from '../contexts/BalanceContext';

interface Upgrade {
  name: string;
  cost: number;
  productionIncrease: number;
}

const upgrades: Upgrade[] = [
  { name: "Better Beakers", cost: 100, productionIncrease: 1 },
  { name: "Automated Mixer", cost: 500, productionIncrease: 5 },
  { name: "Industrial Furnace", cost: 2000, productionIncrease: 20 },
  { name: "Chemistry AI", cost: 10000, productionIncrease: 100 },
];

const RetroBeakerIcon: React.FC = () => (
  <div className="w-8 h-8 relative mx-auto mb-2">
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-400"></div>
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-green-400"></div>
    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black"></div>
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-400"></div>
  </div>
);

const EnergyBar: React.FC<{ energy: number; maxEnergy: number }> = ({ energy, maxEnergy }) => (
  <div className="w-full h-4 bg-green-900 border border-green-400 relative">
    <div 
      className="h-full bg-green-500" 
      style={{ width: `${(energy / maxEnergy) * 100}%` }}
    ></div>
    <div className="absolute inset-0 flex items-center justify-center text-xs text-green-200">
      {energy}/{maxEnergy}
    </div>
  </div>
);

const DrugLabClicker: React.FC = () => {
  const [productionPerClick, setProductionPerClick] = useState(1);
  const [autoProduction, setAutoProduction] = useState(0);
  const { addNotification } = useNotifications();
  const { balance, energy, maxEnergy, updateBalance, updateEnergy, fetchBalance } = useBalance();

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateEnergy(1); // Regenerate 1 energy every second
    }, 1000);
    return () => clearInterval(interval);
  }, [updateEnergy]);

  const handleClick = () => {
    if (energy >= 5) {
      updateBalance(productionPerClick);
      updateEnergy(-5); // Consume 5 energy per click
    } else {
      addNotification("Not enough energy!");
    }
  };

  const buyUpgrade = (upgrade: Upgrade) => {
    if (balance >= upgrade.cost) {
      updateBalance(-upgrade.cost);
      setProductionPerClick((prev) => prev + upgrade.productionIncrease);
      setAutoProduction((prev) => prev + upgrade.productionIncrease / 2);
      addNotification(`Purchased ${upgrade.name}!`);
    } else {
      addNotification("Not enough money for this upgrade!");
    }
  };

  return (
    <div className="space-y-4 p-4 border border-green-400">
      <RetroBeakerIcon />
      <h2 className="text-lg font-bold text-center">Drug Lab Clicker</h2>
      <div className="text-center">
        <p>Balance: ${balance.toFixed(2)}</p>
        <p>Production per click: {productionPerClick}</p>
        <p>Auto production: {autoProduction}/second</p>
      </div>
      <EnergyBar energy={energy} maxEnergy={maxEnergy} />
      <button
        onClick={handleClick}
        className={`w-full py-2 px-4 ${
          energy >= 5
            ? 'bg-green-600 text-black hover:bg-green-500'
            : 'bg-green-900 text-green-400 cursor-not-allowed'
        } transition-colors duration-200 pixelated`}
        disabled={energy < 5}
      >
        Produce Drugs (5 energy)
      </button>
      <div className="space-y-2">
        <h3 className="font-bold">Upgrades:</h3>
        {upgrades.map((upgrade, index) => (
          <button
            key={index}
            onClick={() => buyUpgrade(upgrade)}
            className="w-full py-1 px-2 bg-green-900 text-green-400 hover:bg-green-800 transition-colors duration-200 pixelated"
          >
            {upgrade.name} - ${upgrade.cost}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DrugLabClicker;