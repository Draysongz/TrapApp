import React from 'react';

export const gameDescriptions: { [key: string]: string } = {
  'Drug Lab': "Click to produce drugs. Upgrade your lab to increase production. Manage your resources wisely!",
  'Slots': "Try your luck with the slot machine. Win big or lose it all. Remember, the house always wins in the long run!",
  'Market': "Invest in different drugs. Watch market trends and buy low, sell high. Be careful of market crashes!",
  'Deals': "Navigate through various drug deal scenarios. Make smart choices to increase your money and reputation.",
  'Territory': "Expand your territory by investing in different areas. More territory means more income, but also more risk!"
};

const GameInfo: React.FC<{ name: string; description: string }> = ({ name, description }) => {
  return (
    <div className="bg-green-900 border border-green-400 p-3 text-sm">
      <h3 className="font-bold mb-1 text-green-300">{name}</h3>
      <p className="text-green-200">{description}</p>
    </div>
  );
};

export default GameInfo;