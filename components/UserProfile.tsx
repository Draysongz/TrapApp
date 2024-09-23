import React, { useEffect, useState } from 'react';
import { User, Settings } from 'lucide-react';
import Inventory from './Inventory';
import { TelegramWebApp } from '../telegram'; // Add this import

// Remove the global declaration

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: { name: string; quantity: number }[];
  triggerEasterEgg: () => void;
}

interface UserData {
  id: number;
  
  username: string;
  firstName: string;
  lastName: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose, inventory, triggerEasterEgg }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const telegramWebApp = window.Telegram?.WebApp as TelegramWebApp | undefined;
        const telegramUserId = telegramWebApp?.initDataUnsafe?.user?.id;
        if (!telegramUserId) {
          throw new Error('Telegram user ID not found');
        }
        const response = await fetch('/api/user/check-or-create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId: telegramUserId }),
        });
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

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
              <User size={64} className="mx-auto mb-2 text-green-400" />
              <h3 className="text-green-400 text-xl">{userData.firstName} {userData.lastName}</h3>
              <p className="text-green-600">@{userData.username}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-green-400 mb-2">Inventory</h4>
              <Inventory items={inventory} isOpen={true} onClose={() => {}} triggerEasterEgg={triggerEasterEgg} />
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