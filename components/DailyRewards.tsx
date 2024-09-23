import React, { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { ChevronDown, ChevronUp } from 'lucide-react';
import RewardGrid from './RewardGrid';

const rewards = [
  { day: 1, reward: 100, description: "100 Cash" },
  { day: 2, reward: 200, description: "200 Cash" },
  { day: 3, reward: 300, description: "300 Cash" },
  { day: 4, reward: 400, description: "400 Cash" },
  { day: 5, reward: 500, description: "500 Cash" },
  { day: 6, reward: 600, description: "600 Cash" },
  { day: 7, reward: 1000, description: "1000 Cash" },
];

const DailyRewards: React.FC = () => {
  const [lastClaimDate, setLastClaimDate] = useState<Date | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const storedDate = localStorage.getItem('lastClaimDate');
    const storedStreak = localStorage.getItem('currentStreak');
    if (storedDate) {
      setLastClaimDate(new Date(storedDate));
    }
    if (storedStreak) {
      setCurrentStreak(parseInt(storedStreak));
    }
  }, []);

  useEffect(() => {
    if (lastClaimDate) {
      const now = new Date();
      const timeDiff = now.getTime() - lastClaimDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      setCanClaim(daysDiff >= 1);
      if (daysDiff > 1) {
        setCurrentStreak(0);
      }
    } else {
      setCanClaim(true);
    }
  }, [lastClaimDate]);

  const claimReward = () => {
    if (canClaim) {
      const now = new Date();
      setLastClaimDate(now);
      localStorage.setItem('lastClaimDate', now.toISOString());
      
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      localStorage.setItem('currentStreak', newStreak.toString());
      
      const reward = rewards[(newStreak - 1) % 7];
      addNotification(`Claimed daily reward: ${reward.description}`);
      setCanClaim(false);
    }
  };

  return (
    <div className={`border border-green-400 transition-all duration-300 ease-in-out ${isExpanded ? 'h-auto' : 'h-12'} overflow-hidden`}>
      <div 
        className="flex justify-between items-center p-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-bold">Daily Rewards</h2>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} className="animate-bounce" />}
      </div>
      <div className="p-2">
        <p className="mb-2">Current Streak: {currentStreak} days</p>
        <RewardGrid rewards={rewards} currentStreak={currentStreak} canClaim={canClaim} />
        {canClaim ? (
          <button 
            onClick={claimReward}
            className="w-full px-4 py-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-colors duration-300 pixelated"
          >
            Claim Reward
          </button>
        ) : (
          <p className="text-center">Next reward available in {24 - new Date().getHours()} hours</p>
        )}
      </div>
    </div>
  );
};

export default DailyRewards;