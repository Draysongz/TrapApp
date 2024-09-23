// components/Earn.tsx

'use client';

import React, { useState } from 'react';
import { useBalance } from '../contexts/BalanceContext';
import DailyRewards from './DailyRewards';
import DrugLabClicker from './DrugLabClicker';
import SlotMachine from './SlotMachine';
import MarketTrends from './MarketTrends';
import DrugDealSimulator from './DrugDealSimulator';
import TerritoryExpansion from './TerritoryExpansion';
import { gameDescriptions } from './GameInfo';

const games: Array<{
  name: string;
  component: React.ComponentType;
  icon: string;
}> = [
  { name: 'Drug Lab', component: DrugLabClicker, icon: '🧪' },
  { name: 'Slots', component: SlotMachine, icon: '🎰' },
  { name: 'Market', component: MarketTrends, icon: '📈' },
  { name: 'Deals', component: DrugDealSimulator, icon: '🤝' },
  { name: 'Territory', component: TerritoryExpansion, icon: '🏙️' },
];

const EarnContent: React.FC = () => {
  const [currentGame, setCurrentGame] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const { balance } = useBalance();
  
  const GameComponent = games[currentGame].component;

  return (
    <div className="flex flex-col h-full">
      <DailyRewards />
      <div className="mt-6"></div>
      <div className="flex-grow overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-2 px-2">
          <h2 className="text-lg font-bold text-green-400">Earn</h2>
          <div className="text-green-400 font-bold">Balance: ${balance.toFixed(2)}</div>
        </div>
        <div className="grid grid-cols-5 gap-1 mb-4">
          {games.map((game, index) => (
            <button
              key={game.name}
              onClick={() => {
                setCurrentGame(index);
                setShowInfo(true);
              }}
              className={`px-2 py-1 text-xs transition-all duration-300 ${
                currentGame === index
                  ? 'bg-green-400 text-black'
                  : 'bg-green-900 text-green-400 hover:bg-green-800'
              }`}
            >
              <span className="mr-1">{game.icon}</span>
              {game.name}
            </button>
          ))}
        </div>
        <div className="flex-grow overflow-y-auto border border-green-400 p-2 relative">
          {showInfo && (
            <div className="absolute inset-0 bg-black bg-opacity-90 z-10 flex items-center justify-center">
              <div className="bg-green-900 border border-green-400 p-4 max-w-md">
                <h3 className="font-bold mb-2 text-green-300">{games[currentGame].name}</h3>
                <p className="text-green-200 mb-4">{gameDescriptions[games[currentGame].name]}</p>
                <button
                  onClick={() => setShowInfo(false)}
                  className="w-full py-2 px-4 bg-green-700 text-green-200 hover:bg-green-600"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          <GameComponent />
        </div>
      </div>
    </div>
  );
};

const Earn: React.FC = () => {
  return (
    <EarnContent />
  );
};

export default Earn;