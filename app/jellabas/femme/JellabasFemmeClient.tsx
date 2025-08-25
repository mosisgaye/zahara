'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AnnouncementBar from '@/components/AnnouncementBar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, X, Crown, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface JellabasFemmeClientProps {
  initialProducts: any[];
}

export default function JellabasFemmeClient({ initialProducts }: JellabasFemmeClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: 'all',
    style: 'all',
    color: 'all',
    size: 'all',
    sortBy: 'featured'
  });

  const styles = [
    'Brodée Or', 'Moderne', 'Traditionnelle', 'Luxe', 'Casual', 'Soirée'
  ];

  const colors = [
    'Noir', 'Blanc', 'Beige', 'Bleu', 'Vert', 'Bordeaux', 'Gris'
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const priceRanges = [
    { label: 'Tous les prix', value: 'all' },
    { label: 'Moins de 100€', value: '0-100' },
    { label: '100€ - 200€', value: '100-200' },
    { label: '200€ - 500€', value: '200-500' },
    { label: 'Plus de 500€', value: '500+' }
  ];

  useEffect(() => {
    let result = [...products];

    // Filtrage par prix
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(p => p === '+' ? Infinity : parseInt(p));
      result = result.filter(product => {
        const price = product.price;
        if (max === Infinity) return price >= min;
        return price >= min && price <= max;
      });
    }

    // Filtrage par style
    if (filters.style !== 'all') {
      result = result.filter(product => 
        product.name.toLowerCase().includes(filters.style.toLowerCase()) ||
        product.tags?.some((tag: string) => tag.toLowerCase().includes(filters.style.toLowerCase()))
      );
    }

    // Filtrage par couleur
    if (filters.color !== 'all') {
      result = result.filter(product => 
        product.name.toLowerCase().includes(filters.color.toLowerCase()) ||
        product.tags?.some((tag: string) => tag.toLowerCase().includes(filters.color.toLowerCase()))
      );
    }

    // Tri
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result = result.filter(p => p.isNew).concat(result.filter(p => !p.isNew));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    setFilteredProducts(result);
  }, [filters, products]);

  const resetFilters = () => {
    setFilters({
      priceRange: 'all',
      style: 'all',
      color: 'all',
      size: 'all',
      sortBy: 'featured'
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== 'all' && v !== 'featured').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <AnnouncementBar />
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600">
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Collection Exclusive
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Jellabas Femme
            </h1>
            <p className="text-xl text-white/90 mb-6">
              L'élégance marocaine réinventée pour la femme moderne
            </p>
            <div className="flex items-center gap-4 text-white">
              <Crown className="w-5 h-5" />
              <span className="text-sm">Confection artisanale premium</span>
              <Heart className="w-5 h-5 ml-4" />
              <span className="text-sm">Matières nobles sélectionnées</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Bar */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtres
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
              
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="gap-2 text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                  Réinitialiser
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Trier par:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="border rounded-md px-3 py-1 text-sm"
              >
                <option value="featured">Mise en avant</option>
                <option value="newest">Nouveautés</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="rating">Meilleures notes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 border-b overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Prix */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Prix</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Style */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Style</label>
                  <select
                    value={filters.style}
                    onChange={(e) => setFilters(prev => ({ ...prev, style: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="all">Tous les styles</option>
                    {styles.map(style => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Couleur */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Couleur</label>
                  <select
                    value={filters.color}
                    onChange={(e) => setFilters(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="all">Toutes les couleurs</option>
                    {colors.map(color => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Taille */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Taille</label>
                  <select
                    value={filters.size}
                    onChange={(e) => setFilters(prev => ({ ...prev, size: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="all">Toutes les tailles</option>
                    {sizes.map(size => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun produit ne correspond à vos critères</p>
              <Button onClick={resetFilters} className="mt-4">
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}