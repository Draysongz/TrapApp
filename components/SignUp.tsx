import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const { addNotification } = useNotifications();

  const handleSignUp = async () => {
    try {
      const response = await fetch('/api/user/check-or-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, referralCode }),
      });

      if (!response.ok) throw new Error('Failed to sign up');
      const data = await response.json();
      addNotification(`Welcome, ${data.user.username}!`);
    } catch (error) {
      console.error('Error during sign-up:', error);
      addNotification('Failed to sign up. Please try again.');
    }
  };

  return (
    <div className="border border-green-400 p-4 space-y-4">
      <h2 className="text-lg font-bold text-center">Sign Up</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full bg-green-900 text-green-400 border border-green-400 p-2"
        placeholder="Username"
      />
      <input
        type="text"
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
        className="w-full bg-green-900 text-green-400 border border-green-400 p-2"
        placeholder="Referral Code (optional)"
      />
      <button
        onClick={handleSignUp}
        className="w-full py-2 px-4 bg-green-600 text-black hover:bg-green-500 transition-colors duration-200"
      >
        Sign Up
      </button>
    </div>
  );
};

export default SignUp;