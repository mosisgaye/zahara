'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '@/types/product';

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  showToast: boolean;
  toastMessage: string;
  addToCart: (product: Partial<Product> & { id: string | number; name: string; price: number; image: string }, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  items: CartItem[];
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('zaharashop-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('zaharashop-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Partial<Product> & { id: string | number; name: string; price: number; image: string }, quantity = 1, size?: string, color?: string) => {
    const existingItem = cartItems.find(
      item => item.id === product.id && item.color === color && item.size === size
    );
    
    const message = existingItem 
      ? `Quantité mise à jour dans le panier`
      : `${product.name} ajouté au panier`;
    
    // Show toast notification
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    
    setCartItems(prevItems => {

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id && item.color === color && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      const newItem: CartItem = {
        ...product,
        category: product.category || '',
        quantity,
        color,
        size
      };
      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (productId: string | number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const getTotalPrice = () => totalPrice;

  return (
    <CartContext.Provider value={{
      cartItems,
      totalItems,
      totalPrice,
      isCartOpen,
      setIsCartOpen,
      showToast,
      toastMessage,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      items: cartItems,
      getTotalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}