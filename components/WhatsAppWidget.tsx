'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function WhatsAppWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const phoneNumber = '221784443806'; // Format international sans + ni espaces
  const message = 'Bonjour, je suis intéressé par vos produits ZaharaShop.';

  useEffect(() => {
    // Afficher le widget après un court délai
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Widget Button */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <button
          onClick={handleWhatsAppClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative group"
          aria-label="Chat sur WhatsApp"
        >
          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-gold animate-ping opacity-20"></div>
          <div className="absolute inset-0 rounded-full bg-gold animate-ping animation-delay-200 opacity-15"></div>
          
          {/* Main Button */}
          <div className={`relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transform transition-all duration-300 ${isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'} hover:shadow-gold/50`}
            style={{background: 'linear-gradient(135deg, rgb(218 165 32) 0%, rgb(184 134 11) 100%)'}}
          >
            {/* WhatsApp Icon */}
            <svg 
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>

          {/* Tooltip */}
          <div className={`absolute bottom-20 right-0 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}>
            <div className="bg-black text-white px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium shadow-xl">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Discuter sur WhatsApp</span>
              </div>
              <div className="absolute -bottom-1 right-6 w-2 h-2 bg-black transform rotate-45"></div>
            </div>
          </div>

          {/* Glow Effect */}
          <div className={`absolute inset-0 rounded-full bg-gold blur-xl opacity-0 transition-opacity duration-300 ${
            isHovered ? 'opacity-30' : ''
          }`}></div>
        </button>

        {/* Chat Window */}
        <div className={`absolute bottom-20 right-0 transition-all duration-500 ${
          isVisible && isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}>
          <div className="bg-white rounded-2xl shadow-2xl w-80 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-black to-gray-900 p-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gold/30 flex items-center justify-center">
                    <span className="text-gold text-lg font-bold">DS</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-gold rounded-full border-2 border-black animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <h4 className="text-gold font-semibold">Douka Sadi</h4>
                  <p className="text-gold/70 text-xs">Conseillère clientèle</p>
                </div>
                <div className="text-gold">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="p-4 bg-gray-50">
              <div className="space-y-3">
                {/* Time */}
                <div className="text-center">
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">Aujourd'hui</span>
                </div>
                
                {/* Advisor Message */}
                <div className="flex items-end space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-black text-xs font-bold">DS</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-bl-sm max-w-[80%] shadow-sm">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      Bonjour! 👋 Comment puis-je vous aider aujourd'hui ?
                    </p>
                    <p className="text-xs text-gray-400 mt-1">10:30</p>
                  </div>
                </div>
                
                {/* WhatsApp Info */}
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-3 mt-3">
                  <div className="flex items-center space-x-2 text-black">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs">Continuez sur WhatsApp: +221 78 444 38 06</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chat Footer */}
            <div className="p-4 border-t bg-white">
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-gradient-to-r from-gold to-yellow-600 text-black py-3 px-4 rounded-lg text-sm font-bold hover:from-yellow-600 hover:to-gold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Continuer sur WhatsApp</span>
              </button>
            </div>
            
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white transform rotate-45"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-gentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 3s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </>
  );
}