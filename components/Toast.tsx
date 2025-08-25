'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Check, ShoppingBag } from 'lucide-react';

export default function Toast() {
  const { showToast, toastMessage } = useCart();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (showToast) {
      setProgress(100);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 30); // 3000ms / 100 = 30ms per 1% progress

      return () => clearInterval(interval);
    }
  }, [showToast]);

  if (!showToast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div className="bg-black text-white px-6 py-4 rounded-xl shadow-2xl max-w-md border border-gray-800">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-white">{toastMessage}</p>
            <p className="text-sm text-gray-300 mt-1">Produit ajouté avec succès</p>
          </div>
          <ShoppingBag className="w-5 h-5 text-gray-400 ml-3" />
        </div>
        <div className="h-1 w-full bg-gray-700 mt-4 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-100 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}