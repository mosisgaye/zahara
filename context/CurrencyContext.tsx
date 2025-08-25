'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'EUR' | 'MAD' | 'XOF';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceInEuro: number) => number;
  formatPrice: (price: number) => string;
  rates: {
    EUR: number;
    MAD: number;
    XOF: number;
  };
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Taux de conversion (1 EUR = ...)
const CONVERSION_RATES = {
  EUR: 1,
  MAD: 11.06,  // 1 EUR = 11.06 MAD (Dirham marocain)
  XOF: 656.00, // 1 EUR = 656 XOF (Franc CFA)
};

const CURRENCY_SYMBOLS = {
  EUR: '€',
  MAD: 'DH',
  XOF: 'FCFA',
};

const CURRENCY_LABELS = {
  EUR: 'Euro',
  MAD: 'Dirham',
  XOF: 'Franc CFA',
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('EUR');

  // Charger la devise depuis le localStorage au montage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency') as Currency;
    if (savedCurrency && ['EUR', 'MAD', 'XOF'].includes(savedCurrency)) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  // Sauvegarder la devise dans le localStorage
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('preferredCurrency', newCurrency);
  };

  // Convertir un prix depuis l'Euro vers la devise sélectionnée
  const convertPrice = (priceInEuro: number): number => {
    const rate = CONVERSION_RATES[currency];
    const converted = priceInEuro * rate;
    
    // Arrondir selon la devise
    if (currency === 'XOF') {
      // Pour le Franc CFA, arrondir à l'entier le plus proche
      return Math.round(converted);
    } else if (currency === 'MAD') {
      // Pour le Dirham, arrondir à 2 décimales
      return Math.round(converted * 100) / 100;
    }
    // Pour l'Euro, garder 2 décimales
    return Math.round(converted * 100) / 100;
  };

  // Formater un prix avec le symbole de la devise
  const formatPrice = (price: number): string => {
    const symbol = CURRENCY_SYMBOLS[currency];
    
    if (currency === 'EUR') {
      return `${price.toFixed(2)}${symbol}`;
    } else if (currency === 'MAD') {
      return `${price.toFixed(2)} ${symbol}`;
    } else if (currency === 'XOF') {
      // Formater avec des espaces pour les milliers
      return `${price.toLocaleString('fr-FR')} ${symbol}`;
    }
    
    return `${price.toFixed(2)} ${symbol}`;
  };

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    convertPrice,
    formatPrice,
    rates: CONVERSION_RATES,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

// Composant helper pour afficher un prix
export function Price({ amount, originalAmount }: { amount: number; originalAmount?: number }) {
  const { convertPrice, formatPrice } = useCurrency();
  
  const convertedPrice = convertPrice(amount);
  const convertedOriginalPrice = originalAmount ? convertPrice(originalAmount) : null;
  
  return (
    <>
      <span>{formatPrice(convertedPrice)}</span>
      {convertedOriginalPrice && (
        <span className="line-through text-gray-400 ml-2">
          {formatPrice(convertedOriginalPrice)}
        </span>
      )}
    </>
  );
}

export { CURRENCY_SYMBOLS, CURRENCY_LABELS };