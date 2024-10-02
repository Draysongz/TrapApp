'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Package, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import BlinkingText from './BlinkingText'
import { useNotifications } from '../contexts/NotificationContext';
import { useSounds } from './SoundEffects';

interface Product {
  name: string;
  price: number;
  trend: "up" | "down";
  stock: number;
}

export function Shop() {
  const { addNotification } = useNotifications();
  const { playClick, playSuccess, playError } = useSounds();
  const [cash, setCash] = useState(10000)
  const [products, setProducts] = useState<Product[]>([
    { name: "Purple Haze", price: 500, trend: "up", stock: 10 },
    { name: "Crystal Blue", price: 800, trend: "down", stock: 5 },
    { name: "Green Machine", price: 600, trend: "up", stock: 8 },
  ])
  const [specialProduct, setSpecialProduct] = useState<Product>({ name: "Daily Special", price: 1000, trend: "up", stock: 3 })
  const prevPrices = useRef<{[key: string]: number}>({})

  useEffect(() => {
    const interval = setInterval(() => {
      setProducts(prevProducts => 
        prevProducts.map(product => {
          const newPrice = Math.max(100, product.price + (Math.random() > 0.5 ? 50 : -50))
          const newTrend = newPrice > product.price ? "up" : "down"
          return {
            ...product,
            price: newPrice,
            trend: newTrend
          }
        })
      )
      setSpecialProduct(prev => {
        const newPrice = Math.max(100, prev.price + (Math.random() > 0.5 ? 50 : -50))
        const newTrend = newPrice > prev.price ? "up" : "down"
        return { ...prev, price: newPrice, trend: newTrend }
      })
    }, 10000)  // Update prices every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const buyProduct = (product: Product, quantity: number) => {
    playClick();
    if (cash >= product.price * quantity && product.stock >= quantity) {
      setCash(prevCash => prevCash - product.price * quantity);
      if (product.name === specialProduct.name) {
        setSpecialProduct(prev => ({ ...prev, stock: prev.stock - quantity }));
      } else {
        setProducts(prevProducts => 
          prevProducts.map(p => 
            p.name === product.name 
              ? {...p, stock: p.stock - quantity} 
              : p
          )
        );
      }
      playSuccess();
      addNotification(`Bought ${quantity} ${product.name} for $${product.price * quantity}`);
    } else {
      playError();
      addNotification("Not enough cash or stock!");
    }
  }

  const PriceDisplay: React.FC<{product: Product}> = ({ product }) => {
    const [isBlinking, setIsBlinking] = useState(false)
    const [blinkCount, setBlinkCount] = useState(0)
    const prevPrice = prevPrices.current[product.name]
    
    useEffect(() => {
      if (prevPrice !== undefined && prevPrice !== product.price) {
        setIsBlinking(true)
        setBlinkCount(0)
      }
      prevPrices.current[product.name] = product.price
    }, [product.name, product.price, prevPrice])

    useEffect(() => {
      if (isBlinking) {
        const timer = setTimeout(() => {
          if (blinkCount < 3) {
            setBlinkCount(prev => prev + 1)
          } else {
            setIsBlinking(false)
            setBlinkCount(0)
          }
        }, 300)  // Blink every 300ms
        return () => clearTimeout(timer)
      }
    }, [isBlinking, blinkCount])

    return isBlinking ? (
      <BlinkingText text={`${product.price}`} />
    ) : (
      <span>{product.price}</span>
    )
  }

  return (
    <div className="relative flex flex-col h-full">
      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center text-green-400">
        <div className="text-4xl font-bold mt-40 text-green-400 ">Coming Soon</div>
      </div>
      



      <div className="blur-sm z-10">
      <h2 className="text-lg font-bold">Re-up Shop</h2>
      <div className="flex items-center justify-between border border-green-400 p-2 mb-4">
        <span>Cash:</span>
        <span className="flex items-center">
          <DollarSign size={16} className="mr-1" />
          {cash}
        </span>
      </div>
      <div className="border border-green-400 p-2 mb-4">
        <h3 className="text-sm font-bold mb-2">Daily Special</h3>
        <div className="flex justify-between items-center">
          <span>{specialProduct.name}</span>
          <div className="flex items-center">
            <PriceDisplay product={specialProduct} />
            <button 
              onClick={() => buyProduct(specialProduct, 1)}
              className="ml-2 px-2 py-1 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-colors duration-300 pixelated"
            >
              Buy
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {products.map((product, index) => (
          <div key={index} className="flex justify-between items-center border border-green-400 p-2">
            <div className="flex items-center space-x-2">
              <Package className="text-green-400" size={16} />
              <div>
                <p className="text-sm">{product.name}</p>
                <p className="text-xs">Stock: {product.stock}</p>
              </div>
            </div>
            <div className="flex items-center">
              <PriceDisplay product={product} />
              {product.trend === "up" ? (
                <TrendingUp className="text-green-400 ml-1" size={16} />
              ) : (
                <TrendingDown className="text-green-400 ml-1" size={16} />
              )}
              <button 
                onClick={() => buyProduct(product, 1)}
                className="ml-2 px-2 py-1 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-colors duration-300 pixelated"
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}