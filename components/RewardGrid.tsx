import React from 'react';

interface Reward {
  day: number;
  reward: number;
  description: string;
}

interface Props {
  rewards: Reward[];
  currentStreak: number;
  canClaim: boolean;
}

const RewardGrid: React.FC<Props> = ({ rewards, currentStreak, canClaim }) => {
  return (
    <div className="grid grid-cols-7 gap-1 mb-4">
      {rewards.map((reward, index) => (
        <div 
          key={index} 
          className={`
            aspect-square flex flex-col items-center justify-center text-xs
            border border-green-400 pixelated
            ${index < currentStreak % 7 
              ? 'bg-green-900 text-green-400' 
              : 'bg-black text-green-600'
            }
            ${index === currentStreak % 7 && canClaim
              ? 'animate-pulse'
              : ''
            }
          `}
        >
          <span className="font-bold">Day {reward.day}</span>
          <span className="text-[8px]">${reward.reward}</span>
        </div>
      ))}
    </div>
  );
};

export default RewardGrid;