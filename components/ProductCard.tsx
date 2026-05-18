'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Heart, ShoppingBag, Eye, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AddToCartButton from './AddToCartButton';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  rating: number;
  handle?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { setIsCartOpen } = useCart();
  const { convertPrice, formatPrice } = useCurrency();
  const router = useRouter();

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Generate product URL based on category
  const getCategoryPath = (category: string) => {
    const categoryPaths: { [key: string]: string } = {
      'Tissus': 'tissus',
      'Parfums': 'parfums',
      'Chaussures': 'chaussures',
      'Maroquinerie': 'maroquinerie',
      'Jellabas Femme': 'jellabas/femme',
      'Jellabas Homme': 'jellabas/homme',
    };
    return categoryPaths[category] || 'product';
  };

  const productUrl = `/${getCategoryPath(product.category)}/${product.handle || product.name.toLowerCase().replace(/\s+/g, '-')}`;

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view logic here (could open a modal)
    router.push(productUrl);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <Link href={productUrl} className="block">
      <div 
        className="product-card group relative overflow-hidden bg-white luxury-hover cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl bg-gradient-to-br from-gray-100 to-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlays */}
        <div className={`absolute inset-0 bg-black/10 transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="luxury-badge animate-fade-in-up">
              <Sparkles className="w-3 h-3 mr-1" />
              NOUVEAU
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold px-3 py-1 shadow-lg">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Actions - Always visible on mobile, hover on desktop */}
        <div className={`absolute top-6 right-6 flex flex-col gap-3 transition-all duration-500 
          ${isHovered 
            ? 'md:translate-x-0 md:opacity-100' 
            : 'md:translate-x-full md:opacity-0'
          }
          translate-x-0 opacity-100 md:opacity-0 md:translate-x-full
          group-hover:md:translate-x-0 group-hover:md:opacity-100`}>
          <Button
            size="icon"
            variant="ghost"
            className="glass-effect hover:scale-110 shadow-lg rounded-full w-10 h-10 md:w-11 md:h-11 transition-all duration-300 z-10"
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 md:h-5 md:w-5 transition-all duration-300 ${
              isLiked ? 'fill-red-500 text-red-500 scale-125' : 'hover:text-red-500'
            }`} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="glass-effect hover:scale-110 shadow-lg rounded-full w-10 h-10 md:w-11 md:h-11 transition-all duration-300 z-10"
            onClick={handleQuickView}
          >
            <Eye className="h-4 w-4 md:h-5 md:w-5 text-gray-600 hover:text-black transition-colors" />
          </Button>
        </div>

        {/* Quick Add to Cart - Always visible on mobile, hover on desktop */}
        <div className={`absolute bottom-6 left-6 right-6 transition-all duration-500 z-10 
          ${isHovered 
            ? 'md:translate-y-0 md:opacity-100' 
            : 'md:translate-y-full md:opacity-0'
          } 
          translate-y-0 opacity-100 md:opacity-0 md:translate-y-full 
          group-hover:md:translate-y-0 group-hover:md:opacity-100`}
          onClick={(e) => e.preventDefault()}
        >
          <AddToCartButton 
            product={product} 
            className="shadow-2xl text-sm py-3 btn-gold backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-8 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-[0.2em] uppercase bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
            {product.category}
          </span>
          <div className="flex items-center space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < product.rating 
                    ? 'fill-gold text-gold' 
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <h3 className="font-playfair font-bold text-xl text-black group-hover:text-gradient transition-all duration-300">
          {product.name}
        </h3>

        <div className="flex items-center space-x-4 pt-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
            {formatPrice(convertPrice(product.price))}
          </span>
          {product.originalPrice && (
            <span className="text-lg text-gray-400 line-through decoration-2">
              {formatPrice(convertPrice(product.originalPrice))}
            </span>
          )}
        </div>
      </div>
      </div>
    </Link>
  );
}