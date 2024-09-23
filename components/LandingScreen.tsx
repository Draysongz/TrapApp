import React from 'react';
import { Satellite } from "lucide-react";
import SnakeGame from './SnakeGame';
import DealMessages from './DealMessages';

interface LandingScreenProps {
  onEnter: () => void;
  isClosing: boolean;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onEnter, isClosing }) => {
  const handleEnter = () => {
    onEnter();
  };

  return (
    <div className={`landing-screen flex flex-col items-center justify-center min-h-screen bg-black text-green-400 font-nokia relative overflow-hidden ${isClosing ? 'closing' : ''}`}>
      <div className="absolute inset-0 bg-scanlines pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 to-green-900/5 pointer-events-none"></div>
      <div className="absolute inset-0 static pointer-events-none"></div>
      <DealMessages />
      <div className="relative z-10 flex flex-col items-center p-8 bg-black">
        <div className="flex items-center mb-4">
          <Satellite className="w-6 h-6 retro-icon mr-2" />
          <div className="flex space-x-px items-end" style={{ height: '24px' }}>
            <div className="w-1 bg-green-400 opacity-50" style={{ height: '25%' }}></div>
            <div className="w-1 bg-green-400" style={{ height: '50%' }}></div>
            <div className="w-1 bg-green-400" style={{ height: '75%' }}></div>
            <div className="w-1 bg-green-400" style={{ height: '100%' }}></div>
          </div>
        </div>
        <h1 className="text-4xl mb-8 pixelated glow">TrapLine</h1>
        <div className="mb-4 pixelated text-center">
          <p className="mb-2">Welcome to the underground</p>
          <p>Are you ready to enter?</p>
        </div>
        <div className="mb-8">
          <SnakeGame />
        </div>
        <button 
          onClick={handleEnter}
          className="px-4 py-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-colors duration-300 pixelated"
        >
          ENTER
        </button>
      </div>
    </div>
  );
};

export default LandingScreen;