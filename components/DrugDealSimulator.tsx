import React, { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useSounds } from './SoundEffects';
import { useBalance } from '../contexts/BalanceContext'; // Import useBalance

interface Scenario {
  id: number;
  text: string;
  options: Option[];
}

interface Option {
  text: string;
  outcome: Outcome;
}

interface Outcome {
  text: string;
  money: number;
  reputation: number;
  nextScenario?: number;
}

const scenarios: Scenario[] = [
  {
    id: 1,
    text: "A potential buyer approaches you in a dark alley. They look nervous. What do you do?",
    options: [
      {
        text: "Approach confidently",
        outcome: {
          text: "Your confidence puts the buyer at ease. They buy a small amount to test.",
          money: 100,
          reputation: 5,
          nextScenario: 2
        }
      },
      {
        text: "Wait for them to approach",
        outcome: {
          text: "The buyer gets spooked and leaves. No deal today.",
          money: 0,
          reputation: -5,
          nextScenario: 3
        }
      },
      {
        text: "Leave the area",
        outcome: {
          text: "You play it safe, but miss out on a potential sale.",
          money: 0,
          reputation: 0,
          nextScenario: 4
        }
      }
    ]
  },
  // Add more scenarios here
];

const DrugDealSimulator: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<Scenario>(scenarios[0]);
  const [reputation, setReputation] = useState(50);
  const { addNotification } = useNotifications();
  const { playClick, playSuccess } = useSounds();
  const { mainBalance, updateMainBalance, fetchBalances } = useBalance(); // Use mainBalance instead of balance

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const handleChoice = async (outcome: Outcome) => {
    playClick();
    await updateMainBalance(outcome.money); // Use updateMainBalance instead of updateBalance
    setReputation((prev) => Math.min(100, Math.max(0, prev + outcome.reputation)));
    addNotification(outcome.text);

    if (outcome.nextScenario) {
      const nextScenario = scenarios.find((s) => s.id === outcome.nextScenario);
      if (nextScenario) {
        setCurrentScenario(nextScenario);
      }
    }

    if (outcome.money > 0 || outcome.reputation > 0) {
      playSuccess();
    }

    // Fetch updated balances after the choice
    fetchBalances();
  };

  return (
    <div className="border border-green-400 p-4 space-y-4">
      <h2 className="text-lg font-bold text-center">Drug Deal Simulator</h2>
      <div className="flex justify-between mb-4">
        <p>Balance: ${typeof mainBalance === 'number' ? mainBalance.toFixed(2) : '0.00'}</p>
        <p>Reputation: {reputation}</p>
      </div>
      <p className="mb-4">{currentScenario.text}</p>
      <div className="space-y-2">
        {currentScenario.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleChoice(option.outcome)}
            className="w-full py-2 px-4 bg-green-900 text-green-400 hover:bg-green-800 transition-colors duration-200"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DrugDealSimulator;