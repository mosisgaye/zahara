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
    <div className="bg-black text-white relative">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center text-sm">
          <div className="flex items-center space-x-6">
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
        </div>
        
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}