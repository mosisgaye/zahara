'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AnnouncementBar from '@/components/AnnouncementBar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, X, ChevronDown, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fonction pour récupérer les produits depuis Shopify
async function fetchShopifyProducts() {
  try {
    const response = await fetch('/api/shopify-storefront', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `{
          collectionByHandle(handle: "chaussures") {
            products(first: 50) {
              edges {
                node {
                  id
                  title
                  handle
                  priceRange {
                    minVariantPrice { amount currencyCode }
                  }
                  images(first: 1) {
                    edges {
                      node { url altText }
                    }
                  }
                  compareAtPriceRange {
                    minVariantPrice { amount currencyCode }
                  }
                }
              }
            }
          }
        }`
      })
    });
    
    const data = await response.json();
    if (data?.data?.collectionByHandle?.products?.edges) {
      return data.data.collectionByHandle.products.edges.map(({ node }: any) => ({
        id: node.id,
        name: node.title,
        handle: node.handle,
        price: parseFloat(node.priceRange.minVariantPrice.amount),
        originalPrice: node.compareAtPriceRange?.minVariantPrice?.amount 
          ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
          : undefined,
        image: node.images.edges[0]?.node?.url,
        category: "Chaussures",
        rating: 4.5 + Math.random() * 0.5,
        isNew: Math.random() > 0.7
      }));
    }
  } catch (error) {
    console.error('Erreur Shopify:', error);
  }
  return [];
}

const filters = {
  categories: [
    "Toutes",
    "Babouches Luxe",
    "Sandales Artisanales",
    "Collection Homme",
    "Collection Femme",
    "Chaussures Premium"
  ],
  priceRanges: [
    { label: "Tous les prix", min: 0, max: Infinity },
    { label: "Moins de 100€", min: 0, max: 100 },
    { label: "100€ - 150€", min: 100, max: 150 },
    { label: "150€ - 200€", min: 150, max: 200 },
    { label: "Plus de 200€", min: 200, max: Infinity }
  ],
  sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
  materials: ["Cuir véritable", "Velours", "Daim", "Tissu brodé", "Cuir vegan"]
};

export default function ChaussuresPage() {
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [selectedPriceRange, setSelectedPriceRange] = useState(filters.priceRanges[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [chaussuresProducts, setChaussuresProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les produits depuis Shopify au montage
  useEffect(() => {
    const loadProducts = async () => {
      const shopifyProducts = await fetchShopifyProducts();
      setChaussuresProducts(shopifyProducts);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  // Filtrer les produits
  const filteredProducts = chaussuresProducts.filter(product => {
    const categoryMatch = selectedCategory === "Toutes" || product.category === selectedCategory;
    const priceMatch = product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max;
    return categoryMatch && priceMatch;
  });

  // Trier les produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-amber-50 to-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-gold/10 text-gold border-gold">
                <Sparkles className="w-3 h-3 mr-1" />
                Collection Artisanale
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6">
                Chaussures & Babouches de Luxe
              </h1>
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
                Découvrez notre collection exclusive de babouches et chaussures marocaines. 
                Cuir premium, broderies précieuses et confort absolu pour sublimer chaque pas.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="sticky top-20 z-30 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filtres</span>
                {(selectedCategory !== "Toutes" || selectedPriceRange.label !== "Tous les prix" || selectedSize || selectedMaterial) && (
                  <Badge className="bg-gold text-white">
                    {[selectedCategory !== "Toutes", selectedPriceRange.label !== "Tous les prix", selectedSize, selectedMaterial].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-600">Trier par:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="featured">Mis en avant</option>
                  <option value="newest">Nouveautés</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="rating">Meilleures notes</option>
                </select>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.section
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gray-50 border-b overflow-hidden"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Catégories */}
                <div>
                  <h3 className="font-semibold mb-3">Catégories</h3>
                  <div className="space-y-2">
                    {filters.categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category
                            ? 'bg-gold text-white'
                            : 'hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prix */}
                <div>
                  <h3 className="font-semibold mb-3">Prix</h3>
                  <div className="space-y-2">
                    {filters.priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => setSelectedPriceRange(range)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedPriceRange.label === range.label
                            ? 'bg-gold text-white'
                            : 'hover:bg-gray-200'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pointures */}
                <div>
                  <h3 className="font-semibold mb-3">Pointures</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {filters.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedSize === size
                            ? 'bg-gold text-white'
                            : 'border hover:border-gold'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Matériaux */}
                <div>
                  <h3 className="font-semibold mb-3">Matériaux</h3>
                  <div className="space-y-2">
                    {filters.materials.map((material) => (
                      <button
                        key={material}
                        onClick={() => setSelectedMaterial(selectedMaterial === material ? null : material)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedMaterial === material
                            ? 'bg-gold text-white'
                            : 'hover:bg-gray-200'
                        }`}
                      >
                        {material}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory !== "Toutes" || selectedPriceRange.label !== "Tous les prix" || selectedSize || selectedMaterial) && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory("Toutes");
                      setSelectedPriceRange(filters.priceRanges[0]);
                      setSelectedSize(null);
                      setSelectedMaterial(null);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Réinitialiser les filtres</span>
                  </Button>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des chaussures...</p>
              </div>
            </div>
          ) : sortedProducts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {sortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Aucun produit ne correspond à vos critères</p>
              <Button
                className="mt-4"
                onClick={() => {
                  setSelectedCategory("Toutes");
                  setSelectedPriceRange(filters.priceRanges[0]);
                  setSelectedSize(null);
                  setSelectedMaterial(null);
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Artisanat d'Excellence</h3>
              <p className="text-gray-600">Chaque paire est façonnée à la main par nos maîtres artisans</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Cuir Premium</h3>
              <p className="text-gray-600">Cuirs sélectionnés et tannage traditionnel pour une qualité durable</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Confort Absolu</h3>
              <p className="text-gray-600">Design ergonomique et matériaux nobles pour un confort optimal</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}