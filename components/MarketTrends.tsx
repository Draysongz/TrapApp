import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

interface Product {
  name: string;
  price: number;
  change: number;
  invested: number;
}

const MarketTrends: React.FC = () => {
  const { addNotification } = useNotifications();
  const [products, setProducts] = useState<Product[]>([
    { name: 'Purple Haze', price: 500, change: 0, invested: 0 },
    { name: 'Crystal Blue', price: 800, change: 0, invested: 0 },
    { name: 'Green Machine', price: 600, change: 0, invested: 0 },
    { name: 'Red Devil', price: 700, change: 0, invested: 0 },
    { name: 'Golden Ticket', price: 1000, change: 0, invested: 0 },
  ]);
  const [cash, setCash] = useState(5000);

  useEffect(() => {
    const interval = setInterval(() => {
      setProducts(prevProducts => 
        prevProducts.map(product => {
          const changePercent = (Math.random() - 0.5) * 0.1; // -5% to +5%
          const newPrice = Math.max(100, product.price * (1 + changePercent));
          return {
            ...product,
            price: Math.round(newPrice),
            change: changePercent * 100,
          };
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const invest = (product: Product) => {
    if (cash >= 100) {
      setCash(prev => prev - 100);
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.name === product.name
            ? { ...p, invested: p.invested + 100 }
            : p
        )
      );
      addNotification(`Invested $100 in ${product.name}`);
    } else {
      addNotification("Not enough cash to invest!");
    }
  };

  const sellInvestment = (product: Product) => {
    if (product.invested > 0) {
      const profit = product.invested * (product.price / 500 - 1);
      setCash(prev => prev + product.invested + profit);
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.name === product.name
            ? { ...p, invested: 0 }
            : p
        )
      );
      addNotification(`Sold investment in ${product.name}. Profit: $${profit.toFixed(2)}`);
    }
  };

  return (
    <div className="border border-green-400 p-4">
      <h2 className="text-lg font-bold mb-4 text-center">Street Value</h2>
      <p className="text-center mb-4">Cash: ${cash.toFixed(2)}</p>
      <div className="space-y-2">
        {products.map((product, index) => (
          <div key={index} className="flex justify-between items-center border-b border-green-400 py-2">
            <span className="text-sm">{product.name}</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm">${product.price}</span>
              <span className={`text-xs ${product.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {product.change >= 0 ? (
                  <TrendingUp size={16} className="inline mr-1" />
                ) : (
                  <TrendingDown size={16} className="inline mr-1" />
                )}
                {Math.abs(product.change).toFixed(2)}%
              </span>
              <button
                onClick={() => invest(product)}
                className="px-2 py-1 bg-green-900 text-green-400 text-xs hover:bg-green-800"
              >
                Invest $100
              </button>
              {product.invested > 0 && (
                <button
                  onClick={() => sellInvestment(product)}
                  className="px-2 py-1 bg-red-900 text-red-400 text-xs hover:bg-red-800"
                >
                  Sell ${product.invested}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketTrends;