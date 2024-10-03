// components/DrugLabClicker.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useBalance } from '../contexts/BalanceContext';
import LaunderingModal from './LaunderingModal';

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

const RetroBowlIcon: React.FC<{ isShaking: boolean; isFlipping: boolean }> = ({ isShaking, isFlipping }) => (
  <div className={`w-20 h-20 relative ${isShaking ? 'animate-shake' : ''}`}>
    {/* Bowl */}
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-10 bg-green-400 rounded-b-full"></div>
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-18 h-2 bg-green-400"></div>
    
    {/* Bowl contents */}
    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-14 h-8 bg-green-700 rounded-b-full"></div>
    
    {/* Spoon/Fork handle and head */}
    <div className={`absolute bottom-4 left-1/2 w-1 h-12 bg-green-200 origin-bottom ${isFlipping ? 'animate-stir' : ''}`} style={{ transform: 'translateX(-50%) rotate(45deg)' }}>
      <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-green-200 transform -translate-x-1/2"></div>
    </div>
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
  const [riskLevel, setRiskLevel] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showLaunderModal, setShowLaunderModal] = useState(false);
  const [newEnergy, setNewEnergy] = useState(0)
  const [lastLaunderTime, setLastLaunderTime] = useState(Date.now());
  const [hasLaunderedBefore, setHasLaunderedBefore] = useState(false);
  const { 
    drugMoneyBalance, 
    updateDrugMoneyBalance, 
      energy,
      maxEnergy,
    updateEnergy, 
    refillEnergy, 
    fetchBalances, 
    clickerInventory, 
    updateClickerInventory 
  } = useBalance();
  const { addNotification } = useNotifications();
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(()=>{
    setNewEnergy(energy)
  }, [energy])

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const confirmSell = useCallback(async () => {
    if (clickerInventory > 0) {
      const saleAmount = clickerInventory * 10;
      await updateDrugMoneyBalance(saleAmount);
      await updateClickerInventory(-clickerInventory);
      setRiskLevel(0);
      addNotification(`Sold ${clickerInventory} drugs for $${saleAmount}!`);
      setShowSellModal(false);
      await fetchBalances();
    } else {
      addNotification("No drugs to sell!");
    }
  }, [clickerInventory, updateDrugMoneyBalance, updateClickerInventory, addNotification, fetchBalances]);

  const handleClick = useCallback(async () => {
    if (energy >= 5) {
      await updateClickerInventory(productionPerClick);
      await updateEnergy(-5);
      addNotification(`Produced ${productionPerClick} drugs!`);
      setIsShaking(true);
      setIsFlipping(true);
      setTimeout(() => {
        setIsShaking(false);
        setIsFlipping(false);
      }, 500);
    } else {
      addNotification("Not enough energy!");
    }
  }, [energy, productionPerClick, updateClickerInventory, updateEnergy, addNotification]);

  const sellDrugs = useCallback(() => {
    setShowSellModal(true);
  }, []);

  const buyUpgrade = useCallback((upgrade: Upgrade) => {
    if (drugMoneyBalance >= upgrade.cost) {
      updateDrugMoneyBalance(-upgrade.cost);
      setProductionPerClick(prev => prev + upgrade.productionIncrease);
      setAutoProduction(prev => prev + upgrade.productionIncrease / 2);
      addNotification(`Purchased ${upgrade.name}!`);
    } else {
      addNotification("Not enough money for this upgrade!");
    }
  }, [drugMoneyBalance, updateDrugMoneyBalance, addNotification]);

  const triggerBust = () => {
    if (drugMoneyBalance !== null) {
      const lostAmount = Math.floor(drugMoneyBalance * 0.3);
      updateDrugMoneyBalance(-lostAmount);
      addNotification(`Debug: Triggered bust! Lost $${lostAmount} in drug money.`);
    }
  };

  const triggerRaid = () => {
    if (drugMoneyBalance !== null) {
      const raidedAmount = Math.floor(drugMoneyBalance * 0.3);
      updateDrugMoneyBalance(-raidedAmount);
      setLastLaunderTime(Date.now());
      addNotification(`Debug: Triggered police raid! Lost $${raidedAmount} in drug money.`);
    }
  };

  const triggerReputationEvent = () => {
    if (drugMoneyBalance !== null) {
      const eventAmount = Math.floor(drugMoneyBalance * 0.1);
      if (Math.random() < 0.5) {
        updateDrugMoneyBalance(eventAmount);
        addNotification(`Debug: Triggered positive reputation event! Gained $${eventAmount}.`);
      } else {
        updateDrugMoneyBalance(-eventAmount);
        addNotification(`Debug: Triggered negative reputation event! Lost $${eventAmount}.`);
      }
    }
  };

  // Add this useEffect for energy refill
  useEffect(() => {
    const interval = setInterval(() => {
      refillEnergy();
    }, 60000); // Refill energy every minute

    return () => clearInterval(interval);
  }, [refillEnergy]);

  return (
    <div className="flex flex-col h-full space-y-4 p-4 bg-black text-green-400 font-mono">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Drug Lab</h2>
        <div className="text-right">
          <p className="text-sm">Drug Money: ${drugMoneyBalance.toFixed(2)}</p>
          <p className="text-sm">Inventory: {clickerInventory}</p>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-center items-center">
        <button
          onClick={handleClick}
          className={`w-36 h-36 rounded-full shadow-lg flex items-center justify-center ${
            energy >= 5
              ? 'bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 active:from-gray-950 active:to-gray-900'
              : 'bg-gradient-to-br from-gray-800 to-gray-900 cursor-not-allowed'
          } transition-all duration-200 transform active:scale-95 focus:outline-none border-4 border-green-700`}
          disabled={energy < 5}
        >
          <RetroBowlIcon isShaking={isShaking} isFlipping={isFlipping} />
        </button>
        <p className="mt-2 text-sm">Production: {productionPerClick}/click</p>
        <p className="text-sm">Auto: {autoProduction}/sec</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Energy:</span>
          <span>{newEnergy}/{maxEnergy}</span>
        </div>
        <EnergyBar energy={newEnergy} maxEnergy={maxEnergy} />
        
        <div className="flex justify-between text-sm">
          <span>Risk:</span>
          <span>{riskLevel.toFixed(1)}%</span>
        </div>
        <div className="w-full h-4 bg-green-900 border border-green-400 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-500 transition-all duration-500" 
            style={{ width: `${riskLevel}%` }}
          ></div>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={sellDrugs}
          className="flex-1 py-3 bg-yellow-600 text-black rounded-lg shadow hover:bg-yellow-500 active:bg-yellow-700 transition-colors duration-200"
        >
          Sell Drugs
        </button>
        <button
          onClick={() => setShowLaunderModal(true)}
          className="flex-1 py-3 bg-purple-600 text-black rounded-lg shadow hover:bg-purple-500 active:bg-purple-700 transition-colors duration-200"
        >
          Launder Money
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-lg">Upgrades</h3>
        <div className="grid grid-cols-2 gap-2">
          {upgrades.map((upgrade, index) => (
            <button
              key={index}
              onClick={() => buyUpgrade(upgrade)}
              className="py-2 px-3 bg-green-900 text-green-400 rounded shadow hover:bg-green-800 transition-colors duration-200 text-sm"
            >
              {upgrade.name}<br />${upgrade.cost}
            </button>
          ))}
        </div>
      </div>

      {showSellModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-green-900 border border-green-400 p-4 rounded">
            <h3 className="text-lg font-bold mb-2">Confirm Sale</h3>
            <p>Sell {clickerInventory} drugs for ${clickerInventory * 10}?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowSellModal(false)}
                className="mr-2 px-4 py-2 bg-red-600 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmSell}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <LaunderingModal
        isOpen={showLaunderModal}
        onClose={() => setShowLaunderModal(false)}
        drugMoneyBalance={drugMoneyBalance}
        lastLaunderTime={lastLaunderTime}
        hasLaunderedBefore={hasLaunderedBefore}
        setHasLaunderedBefore={setHasLaunderedBefore}
      />
      <div className="mt-4 p-2 bg-red-900 rounded">
        <h3 className="text-white font-bold mb-2">Debug Controls</h3>
        <div className="flex space-x-2 mb-2">
          <button onClick={() => setLastLaunderTime(Date.now())} className="px-2 py-1 bg-blue-500 text-white rounded">Reset Launder Time</button>
          <button onClick={triggerBust} className="px-2 py-1 bg-yellow-500 text-black rounded">Trigger Bust</button>
          <button onClick={triggerRaid} className="px-2 py-1 bg-red-500 text-white rounded">Trigger Raid</button>
          <button onClick={triggerReputationEvent} className="px-2 py-1 bg-green-500 text-black rounded">Trigger Rep Event</button>
        </div>
      </div>
    </div>
  );
};

export default DrugLabClicker;