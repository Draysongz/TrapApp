import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

interface Territory {
  name: string;
  cost: number;
  income: number;
}

const territories: Territory[] = [
  { name: 'Street Corner', cost: 1000, income: 100 },
  { name: 'Back Alley', cost: 5000, income: 500 },
  { name: 'Abandoned Warehouse', cost: 20000, income: 2000 },
  { name: 'Nightclub', cost: 50000, income: 5000 },
];

const TerritoryExpansion: React.FC = () => {
  const { addNotification } = useNotifications();
  const [money, setMoney] = useState(10000);
  const [ownedTerritories, setOwnedTerritories] = useState<Territory[]>([]);

  const buyTerritory = (territory: Territory) => {
    if (money >= territory.cost) {
      setMoney(prev => prev - territory.cost);
      setOwnedTerritories(prev => [...prev, territory]);
      addNotification(`Expanded to ${territory.name}`);
    } else {
      addNotification('Not enough money to expand!');
    }
  };

  return (
    <div className="space-y-4 border border-green-400 p-4">
      <h2 className="text-lg font-bold">Territory Expansion</h2>
      <p>Money: ${money}</p>
      <div className="space-y-2">
        {territories.map((territory, index) => (
          <button
            key={index}
            onClick={() => buyTerritory(territory)}
            className="w-full py-2 px-4 bg-green-900 text-green-400 hover:bg-green-800"
            disabled={ownedTerritories.includes(territory)}
          >
            {territory.name} - Cost: ${territory.cost} - Income: ${territory.income}/day
          </button>
        ))}
      </div>
      <div>
        <h3 className="font-bold">Owned Territories:</h3>
        <ul>
          {ownedTerritories.map((territory, index) => (
            <li key={index}>{territory.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TerritoryExpansion;