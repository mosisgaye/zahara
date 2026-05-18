'use client';

import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { usePayTechPayment } from '@/hooks/usePayTechPayment';
import { useEffect, useState } from 'react';
import { Truck, ShieldCheck, Gift, Clock, ChevronRight, Package, X, Minus, Plus, CreditCard, Smartphone } from 'lucide-react';

export default function CartDrawer() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    clearCart
  } = useCart();
  const { convertPrice, formatPrice: formatCurrencyPrice } = useCurrency();
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const { initiatePayment, isProcessing, error } = usePayTechPayment({
    onSuccess: (transactionId) => {
      console.log('Paiement réussi:', transactionId);
      clearCart();
      setIsCartOpen(false);
      // TODO: Rediriger vers une page de succès
    },
    onError: (error) => {
      console.error('Erreur de paiement:', error);
      // TODO: Afficher une notification d'erreur
    }
  });

  // Close cart when pressing Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const formatPrice = (price: number) => {
    return formatCurrencyPrice(convertPrice(price));
  };

  const handlePayment = async (paymentMethod: 'orange_money' | 'wave' | 'card') => {
    // Nettoyer le numéro de téléphone (enlever espaces et caractères spéciaux)
    const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/[^\d+]/g, '');

    // Validation pour les paiements mobiles
    if ((paymentMethod === 'orange_money' || paymentMethod === 'wave')) {
      if (!cleanPhone || cleanPhone.length < 9) {
        console.error('Numéro de téléphone invalide');
        return;
      }
    }

    // Validation du montant
    if (!totalPrice || totalPrice <= 0) {
      console.error('Montant invalide');
      return;
    }

    console.log('Données de paiement:', {
      phone: cleanPhone,
      amount: totalPrice,
      paymentMethod,
      cartItemsCount: cartItems.length
    });

    try {
      await initiatePayment({
        phone: cleanPhone,
        amount: totalPrice,
        paymentMethod,
        cartItems,
        metadata: {
          source: 'zaharashop',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
    }
  };

  const getEstimatedDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const isEligibleForFreeShipping = totalPrice >= 75;
  const remainingForFreeShipping = 75 - totalPrice;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      ></div>
      
      {/* Cart drawer - Full width on mobile, max-width on desktop */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen sm:max-w-md">
          <div className="h-full flex flex-col bg-white shadow-2xl">
            {/* Header */}
            <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-crimson font-bold text-black">Votre Panier</h2>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => setIsCartOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {totalItems === 0 
                  ? 'Votre panier est vide' 
                  : `${totalItems} article${totalItems > 1 ? 's' : ''} • ${formatPrice(totalPrice)}`}
              </p>
            </div>

            {/* Free Shipping Progress Bar */}
            {!isEligibleForFreeShipping && totalItems > 0 && (
              <div className="px-6 py-4 bg-rose-50 border-b border-rose-100">
                <div className="flex items-center mb-3">
                  <Truck className="h-5 w-5 text-rose-600 mr-2" />
                  <p className="text-sm text-rose-800 font-medium">
                    Plus que {formatPrice(remainingForFreeShipping)} pour la livraison gratuite !
                  </p>
                </div>
                <div className="w-full bg-rose-200 rounded-full h-2">
                  <div 
                    className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((totalPrice / 75) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {isEligibleForFreeShipping && totalItems > 0 && (
              <div className="px-6 py-4 bg-green-50 border-b border-green-100">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-green-600 mr-2" />
                  <p className="text-sm font-medium text-green-800">
                    Félicitations ! Livraison gratuite incluse 🎉
                  </p>
                </div>
              </div>
            )}

            {/* Cart items - More space on mobile */}
            <div className="flex-1 px-4 md:px-6 py-4 md:py-6 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Votre panier est vide</h3>
                  <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                    Découvrez nos créations d'exception et profitez de la livraison gratuite dès 75€ d'achat.
                  </p>
                  <button
                    type="button"
                    className="btn-primary px-8 py-3 rounded-lg"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Découvrir nos Collections
                  </button>
                </div>
              ) : (
                <div className="space-y-4 md:space-y-6">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.color}`} className="flex items-start space-x-3 md:space-x-4 animate-elegant-fade">
                      {/* Product image - Smaller on mobile */}
                      <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-base font-medium text-black truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
                          {item.category}
                        </p>
                        {item.color && (
                          <p className="text-xs md:text-sm text-gray-500">
                            Couleur: {item.color}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between mt-2 md:mt-3">
                          {/* Quantity selector - Smaller on mobile */}
                          <div className="flex items-center border border-gray-200 rounded-lg scale-90 md:scale-100">
                            <button
                              type="button"
                              className="p-1.5 md:p-2 text-gray-600 hover:text-black transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm font-medium text-black min-w-[1.5rem] md:min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="p-1.5 md:p-2 text-gray-600 hover:text-black transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Price and remove - Smaller on mobile */}
                          <div className="text-right">
                            <p className="text-sm md:text-base font-bold text-black">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <button
                              type="button"
                              className="text-xs md:text-sm text-red-500 hover:text-red-700 transition-colors mt-0.5 md:mt-1"
                              onClick={() => removeFromCart(item.id)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Optimized for mobile with less padding and smaller elements */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 px-4 md:px-6 py-4 md:py-6 bg-gray-50">
                {/* Order summary - Compact on mobile */}
                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  <div className="flex justify-between text-sm md:text-base text-gray-600">
                    <p>Sous-total</p>
                    <p>{formatPrice(totalPrice)}</p>
                  </div>
                  <div className="flex justify-between text-sm md:text-base text-gray-600">
                    <p>Livraison</p>
                    <p className={isEligibleForFreeShipping ? 'text-green-600 font-medium' : ''}>
                      {isEligibleForFreeShipping ? 'Gratuite' : 'Calculée à la caisse'}
                    </p>
                  </div>
                  <div className="flex justify-between text-base md:text-lg font-bold text-black pt-2 md:pt-3 border-t border-gray-200">
                    <p>Total</p>
                    <p>{formatPrice(totalPrice)}</p>
                  </div>
                </div>

                {/* Estimated delivery - Smaller on mobile */}
                <div className="bg-white rounded-lg p-3 md:p-4 mb-4 md:mb-6 border border-gray-200">
                  <div className="flex items-center text-xs md:text-sm text-gray-600">
                    <Clock className="h-3 w-3 md:h-4 md:w-4 mr-2 text-gray-400" />
                    <p>Livraison : <span className="font-medium text-black">{getEstimatedDeliveryDate()}</span></p>
                  </div>
                </div>

                {/* Trust badges - Hidden on mobile or made smaller */}
                <div className="hidden md:grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-xs text-gray-600">
                    <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                    Paiement sécurisé
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Gift className="h-4 w-4 mr-2 text-rose-500" />
                    Satisfait ou remboursé
                  </div>
                </div>

                {/* Payment Methods */}
                {!showPaymentMethods ? (
                  <button
                    className="w-full btn-primary py-3 md:py-4 rounded-lg text-sm md:text-base font-semibold mb-3 md:mb-4 group flex items-center justify-center"
                    onClick={() => setShowPaymentMethods(true)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Traitement...' : 'Passer à la commande'}
                    <ChevronRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <div className="space-y-4 mb-4">
                    {/* Phone input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro de téléphone
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="77 123 45 67"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        maxLength={15}
                      />
                      {phoneNumber && phoneNumber.replace(/\s+/g, '').length < 9 && (
                        <p className="text-xs text-red-500 mt-1">
                          Le numéro doit contenir au moins 9 chiffres
                        </p>
                      )}
                    </div>

                    {/* Payment methods */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Choisir votre moyen de paiement</h3>

                      {/* Orange Money */}
                      <button
                        className="w-full flex items-center justify-between p-3 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
                        onClick={() => handlePayment('orange_money')}
                        disabled={isProcessing || !phoneNumber.trim()}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-xs">OM</span>
                          </div>
                          <span className="font-medium">Orange Money</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </button>

                      {/* Wave */}
                      <button
                        className="w-full flex items-center justify-between p-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
                        onClick={() => handlePayment('wave')}
                        disabled={isProcessing || !phoneNumber.trim()}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-xs">W</span>
                          </div>
                          <span className="font-medium">Wave</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </button>

                      {/* Carte bancaire */}
                      <button
                        className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        onClick={() => handlePayment('card')}
                        disabled={isProcessing}
                      >
                        <div className="flex items-center">
                          <CreditCard className="w-8 h-8 text-gray-600 mr-3" />
                          <span className="font-medium">Carte bancaire</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>

                    {/* Error message */}
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    {/* Back button */}
                    <button
                      className="w-full text-sm text-gray-600 hover:text-black transition-colors py-2"
                      onClick={() => setShowPaymentMethods(false)}
                      disabled={isProcessing}
                    >
                      ← Retour au panier
                    </button>
                  </div>
                )}

                {/* Continue shopping - Smaller on mobile */}
                <div className="text-center">
                  <button
                    type="button"
                    className="text-xs md:text-sm text-gray-600 hover:text-black transition-colors"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Continuer mes achats →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}