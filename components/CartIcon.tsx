'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartIcon() {
  const { totalItems, isCartOpen, setIsCartOpen } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevTotalItems, setPrevTotalItems] = useState(totalItems);

  useEffect(() => {
    if (totalItems > prevTotalItems) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
    setPrevTotalItems(totalItems);
  }, [totalItems, prevTotalItems]);

  return (
    <button
      onClick={() => setIsCartOpen(!isCartOpen)}
      className="group relative p-3 hover:bg-gray-50 rounded-full transition-all duration-300"
      aria-label="Panier"
    >
      <ShoppingBag 
        className="h-5 w-5 text-gray-700 group-hover:text-black transition-colors" 
      />
      {totalItems > 0 && (
        <span 
          className={`absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium
                    transition-all duration-300 ${isAnimating ? 'animate-bounce scale-110' : ''}`}
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
      
      {/* Pulse effect when items are added */}
      {isAnimating && (
        <span className="absolute -top-1 -right-1 bg-black rounded-full h-5 w-5 animate-ping opacity-20"></span>
      )}
    </button>
  );
}