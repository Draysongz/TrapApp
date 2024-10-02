import React, { useEffect, useState } from 'react';
import { User, Settings, Share2 } from 'lucide-react';
import Inventory from './Inventory';
import { TelegramWebApp } from '../telegram';
import { useBalance } from '../contexts/BalanceContext';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: { name: string; quantity: number }[];
  triggerEasterEgg: () => void;
}

interface UserData {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  photo_url: string | null;
  referral_code: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose, inventory, triggerEasterEgg }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { mainBalance, drugMoneyBalance, clickerInventory } = useBalance();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const telegramWebApp = window.Telegram?.WebApp as TelegramWebApp | undefined;
        const user = telegramWebApp?.initDataUnsafe?.user;
         const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id
        
        console.log('Telegram User:', user);

        // const userId= '2146305061'


       const response = await fetch('/api/user/fetchUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({telegramId : userId}),
      });

      const data = await response.json();
      console.log(data)
        console.log('Received user data:', data.user);
        setUserData(data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0) : '';
    const lastInitial = lastName ? lastName.charAt(0) : '';
    return (firstInitial + lastInitial).toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-black border-2 border-green-400 p-4 rounded-lg w-11/12 max-w-md max-h-[90vh] overflow-y-auto">
        {loading ? (
          <p className="text-green-400">Loading user data...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : userData ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-green-400">User Profile</h2>
              <button onClick={onClose} className="text-green-400 hover:text-green-300">
                <Settings size={24} />
              </button>
            </div>

            <div className="mb-6 text-center">
              <div className="w-24 h-24 rounded-full border-2 border-green-400 mx-auto mb-2 overflow-hidden flex items-center justify-center">
                {userData.photo_url ? (
                  <img 
                    src={userData.photo_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Error loading profile picture:', e);
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-green-900 flex items-center justify-center text-green-400 text-2xl font-bold">
                    {getInitials(userData.first_name, userData.last_name)}
                  </div>
                )}
              </div>
              <h3 className="text-green-400 text-xl">{userData.first_name} {userData.last_name}</h3>
              <p className="text-green-600">@{userData.username}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-green-400 mb-2">Inventory</h4>
              <Inventory items={inventory} isOpen={true} onClose={() => {}} triggerEasterEgg={triggerEasterEgg} />
            </div>

            <div className="mb-6">
              <h4 className="text-green-400 mb-2">Referral Code</h4>
              <div className="flex items-center justify-between bg-green-900 bg-opacity-20 p-1">
                <code className="text-sm">{userData.referral_code}</code>
                <button className="text-green-400">
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-green-400 mb-2">Balances</h4>
              <p>Main Balance: ${typeof mainBalance === 'number' ? mainBalance.toFixed(2) : '0.00'}</p>
              <p>Drug Money: ${typeof drugMoneyBalance === 'number' ? drugMoneyBalance.toFixed(2) : '0.00'}</p>
              <p>Drug Inventory: {clickerInventory}</p>
            </div>
          </>
        ) : (
          <p className="text-red-400">No user data available</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;