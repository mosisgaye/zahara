'use client';

import { useState, useEffect } from 'react';
import { Clock, X, Zap } from 'lucide-react';

export default function AnnouncementBar() {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 46, seconds: 46 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        
        if (totalSeconds <= 0) {
          // Reset to 24 hours when timer reaches 0
          return { hours: 24, minutes: 0, seconds: 0 };
        }
        
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-black text-white relative overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 py-2">
        <div className="flex items-center justify-center">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            {/* Flash Icon */}
            <Zap className="w-4 h-4 text-gold animate-pulse" />
            
            {/* Message */}
            <span className="font-medium">
              LIVRAISON GRATUITE DÈS 75€ | OFFRE LIMITÉE
            </span>
            
            {/* Timer */}
            <div className="flex items-center space-x-3 font-mono">
              <Clock className="w-4 h-4 text-gold" />
              <div className="flex items-center space-x-1 text-gold font-bold">
                <span className="bg-gold/10 px-2 py-0.5 rounded">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-gold/10 px-2 py-0.5 rounded">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-gold/10 px-2 py-0.5 rounded">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
            
            {/* Flash Icon */}
            <Zap className="w-4 h-4 text-gold animate-pulse" />
          </div>

          {/* Mobile Layout - Stacked */}
          <div className="flex md:hidden flex-col items-center space-y-2 text-xs sm:text-sm">
            {/* Message with Icons */}
            <div className="flex items-center space-x-2">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-gold animate-pulse" />
              <span className="font-medium text-center">
                LIVRAISON GRATUITE DÈS 75€
              </span>
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-gold animate-pulse" />
            </div>
            
            {/* Timer with "OFFRE LIMITÉE" */}
            <div className="flex items-center space-x-2">
              <span className="text-gold font-medium">OFFRE LIMITÉE</span>
              <Clock className="w-3 h-3 text-gold" />
              <div className="flex items-center space-x-1 text-gold font-bold font-mono">
                <span className="bg-gold/10 px-1.5 py-0.5 rounded text-xs">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-xs">:</span>
                <span className="bg-gold/10 px-1.5 py-0.5 rounded text-xs">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-xs">:</span>
                <span className="bg-gold/10 px-1.5 py-0.5 rounded text-xs">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Close Button - Hidden on mobile, visible on desktop */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors hidden sm:block"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}