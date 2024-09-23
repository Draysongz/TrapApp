import React from 'react';
import { Package } from 'lucide-react';

interface InventoryItem {
  name: string;
  quantity: number;
}

interface InventoryProps {
  items: InventoryItem[];
  isOpen: boolean;
  onClose: () => void;
  triggerEasterEgg: () => void;
}

const Inventory: React.FC<InventoryProps> = ({ items, isOpen, triggerEasterEgg }) => {
  if (!isOpen) return null;

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between items-center border border-green-400 p-2">
          <div className="flex items-center space-x-2">
            <Package className="text-green-400" size={16} />
            <span className="text-green-400">{item.name}</span>
          </div>
          <span className="text-green-400">{item.quantity}</span>
        </div>
      ))}
      <button 
        onClick={triggerEasterEgg}
        className="w-full px-2 py-1 bg-green-900 text-green-400 text-xs hover:bg-green-800 transition-colors duration-200"
      >
        Trigger 4:20
      </button>
    </div>
  );
};

export default Inventory;