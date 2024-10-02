'use client'

import React, { useState } from 'react'
import { Trophy, Zap, TrendingUp, Package } from "lucide-react"
import ScrollingText from './ScrollingText'

type LeaderboardCategory = 'daily' | 'weekly' | 'all-time';
type LeaderboardMetric = 'score' | 'sales' | 'profit';

interface Dealer {
  name: string;
  score: number;
  sales: number;
  profit: number;
}

const generateMockData = (category: LeaderboardCategory): Dealer[] => {
  const multiplier = category === 'daily' ? 1 : category === 'weekly' ? 7 : 30;
  return [
    { name: "Shadow", score: 10000 * multiplier, sales: 100 * multiplier, profit: 5000 * multiplier },
    { name: "Viper", score: 9500 * multiplier, sales: 95 * multiplier, profit: 4750 * multiplier },
    { name: "Ghost", score: 9000 * multiplier, sales: 90 * multiplier, profit: 4500 * multiplier },
    { name: "Phantom", score: 8500 * multiplier, sales: 85 * multiplier, profit: 4250 * multiplier },
    { name: "Specter", score: 8000 * multiplier, sales: 80 * multiplier, profit: 4000 * multiplier },
  ];
};

export function Leaderboard() {
  const [category, setCategory] = useState<LeaderboardCategory>('daily');
  const [metric, setMetric] = useState<LeaderboardMetric>('score');
  const dealers = generateMockData(category);

  const getMetricIcon = (metricType: LeaderboardMetric) => {
    switch (metricType) {
      case 'score': return <Trophy className="text-green-400" size={16} />;
      case 'sales': return <Package className="text-green-400" size={16} />;
      case 'profit': return <TrendingUp className="text-green-400" size={16} />;
    }
  };

  return (
    <div className="relative space-y-4">
      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center ">
        <div className="text-white text-4xl font-bold mt-40">Coming Soon</div>
      </div>

      {/* Apply blur effect to the leaderboard */}
      <div className="blur-sm z-10">
        <h2 className="text-lg font-bold">Leaderboard</h2>
        <ScrollingText text={`Top Player: ${dealers[0].name} - ${metric.charAt(0).toUpperCase() + metric.slice(1)}: ${dealers[0][metric]}`} />
        
        <div className="flex justify-between mb-4">
          <div className="space-x-2">
            {(['daily', 'weekly', 'all-time'] as LeaderboardCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-2 py-1 border ${category === cat ? 'bg-green-400 text-black' : 'border-green-400 text-green-400'}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <div className="space-x-2">
            {(['score', 'sales', 'profit'] as LeaderboardMetric[]).map((met) => (
              <button
                key={met}
                onClick={() => setMetric(met)}
                className={`px-2 py-1 border ${metric === met ? 'bg-green-400 text-black' : 'border-green-400 text-green-400'}`}
              >
                {met.charAt(0).toUpperCase() + met.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {dealers.map((dealer, index) => (
            <div key={index} className="flex justify-between items-center border border-green-400 p-2">
              <div className="flex items-center space-x-2">
                {index < 3 ? (
                  <Trophy className="text-green-400" size={16} />
                ) : (
                  <Zap className="text-green-400" size={16} />
                )}
                <div>
                  <p className="text-sm">{dealer.name}</p>
                  <p className="text-xs">Rank #{index + 1}</p>
                </div>
              </div>
              <div className="flex items-center text-green-400">
                {getMetricIcon(metric)}
                <span className="text-sm font-bold ml-1">{dealer[metric]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
