// components/SlotMachine.tsx

'use client';

import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useSounds } from './SoundEffects';
import { useBalance } from '../contexts/BalanceContext'; // Import useBalance

const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];

const payoutCombos = [
  { combo: '🍒🍒🍒', payout: 5 },
  { combo: '🍋🍋🍋', payout: 10 },
  { combo: '🍊🍊🍊', payout: 15 },
  { combo: '🍇🍇🍇', payout: 20 },
  { combo: '💎💎💎', payout: 50 },
  { combo: '7️⃣7️⃣7️⃣', payout: 100 },
];

const SlotMachine: React.FC = () => {
  const [reels, setReels] = useState(['🍒', '🍒', '🍒']);
  const [spinning, setSpinning] = useState(false);
  const { addNotification } = useNotifications();
  const { playClick, playSuccess } = useSounds();
  const { mainBalance, updateMainBalance } = useBalance(); // Use mainBalance and updateMainBalance

  const spin = async () => {
    if (mainBalance === null || mainBalance < 10) {
      addNotification("Not enough credits to spin!");
      return;
    }
    playClick();
    setSpinning(true);
    await updateMainBalance(-10); // Use updateMainBalance
    
    const newReels = reels.map(() => symbols[Math.floor(Math.random() * symbols.length)]);
    
    setTimeout(() => {
      setReels(newReels);
      setSpinning(false);
      checkWin(newReels);
    }, 2000);
  };

  const checkWin = async (currentReels: string[]) => {
    if (currentReels[0] === currentReels[1] && currentReels[1] === currentReels[2]) {
      const winningCombo = payoutCombos.find(combo => combo.combo === currentReels.join(''));
      if (winningCombo) {
        const winAmount = winningCombo.payout * 10;
        await updateMainBalance(winAmount); // Use updateMainBalance
        playSuccess();
        addNotification(`You won ${winAmount} credits!`);
      }
    }
  };

  return (
    <div className="border border-green-400 p-4 space-y-4">
      <h2 className="text-lg font-bold text-center">Slot Machine</h2>
      <p className="text-center">Balance: ${typeof mainBalance === 'number' ? mainBalance.toFixed(2) : '0.00'}</p>
      <div className="flex justify-center space-x-2">
        {reels.map((symbol, index) => (
          <div key={index} className="w-16 h-16 border border-green-400 flex items-center justify-center">
            <div className={`text-4xl ${spinning ? 'animate-pulse' : ''}`}>
              {symbol}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={spin}
        disabled={spinning || mainBalance === null || mainBalance < 10}
        className="w-full py-2 px-4 bg-green-600 text-black hover:bg-green-500 transition-colors duration-200 disabled:bg-green-800 disabled:text-green-200"
      >
        {spinning ? 'Spinning...' : 'Spin (10 credits)'}
      </button>
      
      <div className="mt-6 border-t border-green-400 pt-4">
        <h3 className="text-lg font-bold mb-2">Payout Combinations</h3>
        <div className="grid grid-cols-2 gap-2">
          {payoutCombos.map((combo, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{combo.combo}</span>
              <span>{combo.payout}x</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;