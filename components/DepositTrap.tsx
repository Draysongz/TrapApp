import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
// Import your Solana wallet integration here

const DepositTrap: React.FC = () => {
  const [amount, setAmount] = useState('');
  const { addNotification } = useNotifications();

  const handleDeposit = async () => {
    try {
      // Implement Solana wallet interaction here
      // For example:
      // const result = await sendTrapTokens(amount);
      
      // If successful, update the user's balance
      const response = await fetch('/api/user/update-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      if (response.ok) {
        addNotification(`Successfully deposited ${amount} $TRAP`);
        setAmount('');
      } else {
        throw new Error('Failed to update balance');
      }
    } catch (error) {
      console.error('Error depositing TRAP:', error);
      addNotification('Failed to deposit $TRAP. Please try again.');
    }
  };

  return (
    <div className="border border-green-400 p-4 space-y-4">
      <h2 className="text-lg font-bold text-center">Deposit $TRAP</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full bg-green-900 text-green-400 border border-green-400 p-2"
        placeholder="Amount of $TRAP"
      />
      <button
        onClick={handleDeposit}
        className="w-full py-2 px-4 bg-green-600 text-black hover:bg-green-500 transition-colors duration-200"
      >
        Deposit
      </button>
    </div>
  );
};

export default DepositTrap;