'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';
import { ShoppingBag, Check } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export default function AddToCartButton({ product, className = '' }: AddToCartButtonProps) {
  const [selectedColor, setSelectedColor] = useState('Noir');
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    
    // Animation effect when clicked
    setIsClicked(true);
    setIsAdded(true);
    
    // Open cart drawer
    setTimeout(() => {
      setIsCartOpen(true);
    }, 300);
    
    // Reset animations
    setTimeout(() => {
      setIsClicked(false);
      setIsAdded(false);
    }, 2000);
  };

  return (
    <button 
      onClick={handleAddToCart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full bg-black text-white py-4 px-6 rounded-lg font-medium text-base
                transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
                hover:bg-gray-800 relative overflow-hidden group ${className}
                ${isClicked ? 'animate-pulse' : ''}`}
    >
      <span className="relative z-10 flex items-center justify-center">
        {isAdded ? (
          <>
            <Check className="w-5 h-5 mr-2 animate-bounce" />
            Ajouté au panier !
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Ajouter au Panier
          </>
        )}
      </span>
      
      {/* Hover effect background */}
      <span className={`absolute top-0 left-0 w-full h-0 bg-gray-800 transition-all duration-300 ${
        isHovered ? 'h-full' : 'h-0'
      }`}></span>
      
      {/* Success ripple effect */}
      {isClicked && (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        bg-white rounded-full opacity-20 animate-ping w-8 h-8"></span>
      )}
    </button>
  );
}