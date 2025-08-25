'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, User, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CartIcon from './CartIcon';
import { useCurrency, CURRENCY_LABELS, type Currency } from '@/context/CurrencyContext';

interface SubCategory {
  name: string;
  href: string;
}

interface Category {
  name: string;
  href: string;
  subCategories?: SubCategory[];
}

const categories: Category[] = [
  { name: 'Jellabas Femme', href: '/jellabas/femme' },
  { name: 'Jellabas Homme', href: '/jellabas/homme' },
  { name: 'Chaussures', href: '/chaussures' },
  { name: 'Maroquinerie', href: '/maroquinerie' },
  { name: 'Parfums', href: '/parfums' },
  { name: 'Tissus & Mercerie', href: '/tissus' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const { currency, setCurrency } = useCurrency();

  const currencies: { value: Currency; label: string; symbol: string }[] = [
    { value: 'EUR', label: 'Euro', symbol: '€' },
    { value: 'MAD', label: 'Dirham', symbol: 'DH' },
    { value: 'XOF', label: 'Franc CFA', symbol: 'FCFA' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-3xl font-crimson font-bold text-black tracking-tight hover:text-gray-800 transition-colors">
              ZaharaShop
            </a>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {categories.map((category) => (
              <a
                key={category.name}
                href={category.href}
                className={`transition-colors duration-300 font-medium ${
                  pathname.startsWith(category.href)
                    ? 'text-black font-semibold' 
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                {category.name}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Currency Selector */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center space-x-1 hover:bg-gray-50 px-3"
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              >
                <span className="font-medium">
                  {currencies.find(c => c.value === currency)?.symbol}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {isCurrencyOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-xl py-2 z-50 min-w-[160px]">
                  {currencies.map((curr) => (
                    <button
                      key={curr.value}
                      onClick={() => {
                        setCurrency(curr.value);
                        setIsCurrencyOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-4 py-2 hover:bg-gray-50 transition-colors ${
                        currency === curr.value ? 'bg-gray-50 font-medium' : ''
                      }`}
                    >
                      <span>{curr.label}</span>
                      <span className="text-gray-500 text-sm ml-2">{curr.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-50">
              <Heart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </Button>
            <CartIcon />
            <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-gray-50">
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-gray-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              {/* Mobile Currency Selector */}
              <div className="px-2 py-2">
                <div className="text-sm font-medium text-gray-700 mb-2">Devise</div>
                <div className="flex space-x-2">
                  {currencies.map((curr) => (
                    <button
                      key={curr.value}
                      onClick={() => {
                        setCurrency(curr.value);
                      }}
                      className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                        currency === curr.value 
                          ? 'border-gold bg-gold/10 font-medium' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {curr.symbol}
                    </button>
                  ))}
                </div>
              </div>
              {categories.map((category) => (
                <a
                  key={category.name}
                  href={category.href}
                  className={`text-gray-700 hover:text-black transition-colors px-2 py-2 font-medium block ${
                    pathname.startsWith(category.href) ? 'font-semibold text-black' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}