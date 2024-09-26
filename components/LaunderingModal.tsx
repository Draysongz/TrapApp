import React, { useState, useEffect } from 'react';
import WashingMachine from './WashingMachine';
import { useBalance } from '../contexts/BalanceContext';

interface LaunderingModalProps {
  isOpen: boolean;
  onClose: () => void;
  drugMoneyBalance: number;
  lastLaunderTime: number;
  hasLaunderedBefore: boolean;
  setHasLaunderedBefore: (value: boolean) => void;
}

const LaunderingModal: React.FC<LaunderingModalProps> = ({ 
  isOpen, 
  onClose, 
  drugMoneyBalance, 
  lastLaunderTime, 
  hasLaunderedBefore,
  setHasLaunderedBefore
}) => {
  const [amount, setAmount] = useState('');
  const [isLaundering, setIsLaundering] = useState(false);
  const [fee, setFee] = useState(0.2);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const { updateDrugMoneyBalance, updateMainBalance, fetchBalances } = useBalance();

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setIsLaundering(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hasLaunderedBefore) {
      interval = setInterval(() => {
        const timeSinceLastLaunder = Date.now() - lastLaunderTime;
        const cooldownTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const remaining = Math.max(0, cooldownTime - timeSinceLastLaunder);
        setCooldownRemaining(remaining);
      }, 1000);
    } else {
      setCooldownRemaining(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lastLaunderTime, hasLaunderedBefore]);

  const calculateFee = (launderAmount: number) => {
    if (launderAmount < 1000) return 0.2;
    if (launderAmount < 5000) return 0.15;
    if (launderAmount < 10000) return 0.1;
    return 0.05;
  };

  const calculateTimeBonus = () => {
    if (!hasLaunderedBefore) return 0;
    const daysSinceLastLaunder = (Date.now() - lastLaunderTime) / (1000 * 60 * 60 * 24);
    return Math.min(daysSinceLastLaunder * 0.01, 0.05);
  };

  const handleLaunder = async () => {
    const launderAmount = parseFloat(amount);
    if (isNaN(launderAmount) || launderAmount <= 0 || launderAmount > drugMoneyBalance) {
      alert('Invalid amount');
      return;
    }
    
    if (hasLaunderedBefore && cooldownRemaining > 0) {
      alert('Laundering is on cooldown. Please wait.');
      return;
    }

    const baseFee = calculateFee(launderAmount);
    const timeBonus = calculateTimeBonus();
    const finalFee = Math.max(baseFee - timeBonus, 0.05);
    setFee(finalFee);

    setIsLaundering(true);
    setTimeout(async () => {
      const launderedAmount = launderAmount * (1 - finalFee);
      await updateDrugMoneyBalance(-launderAmount);
      await updateMainBalance(launderedAmount);
      setIsLaundering(false);
      if (!hasLaunderedBefore) {
        setHasLaunderedBefore(true);
      }
      await fetchBalances();
      onClose();
    }, 3000);
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-green-900 border-2 border-green-400 p-6 rounded-lg w-80 ${isLaundering ? 'animate-shake' : ''}`}>
        <h2 className="text-xl font-bold mb-4 text-green-400 text-center">Money Laundering</h2>
        {!isLaundering ? (
          <>
            <p className="mb-2 text-green-400">Available: ${drugMoneyBalance.toFixed(2)}</p>
            <p className="mb-2 text-green-400">Current Fee: {(fee * 100).toFixed(1)}%</p>
            {hasLaunderedBefore && cooldownRemaining > 0 && (
              <p className="mb-2 text-yellow-400">Cooldown: {formatTime(cooldownRemaining)}</p>
            )}
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setFee(calculateFee(parseFloat(e.target.value)));
              }}
              className="w-full bg-green-800 text-green-400 border border-green-400 p-2 mb-4"
              placeholder="Amount to launder"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLaunder}
                className="px-4 py-2 bg-green-600 text-white rounded"
                disabled={hasLaunderedBefore && cooldownRemaining > 0}
              >
                Launder
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-40">
            <div className="mb-4">
              <WashingMachine />
            </div>
            <p className="text-green-400">Laundering in progress...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaunderingModal;