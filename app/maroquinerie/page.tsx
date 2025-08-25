'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AnnouncementBar from '@/components/AnnouncementBar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, X, Briefcase, Heart, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fonction pour récupérer les produits depuis Shopify
async function fetchShopifyProducts() {
  try {
    const response = await fetch('/api/shopify-storefront', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
          collectionByHandle(handle: "maroquinerie") {
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
        category: "Maroquinerie",
        rating: 4.5 + Math.random() * 0.5,
        isNew: Math.random() > 0.7
      }));
    }
  } catch (error) {
    console.error('Erreur Shopify:', error);
  }
  return [];
}

// Données de maroquinerie avec images locales (fallback)
const maroquinerieProducts = [
  {
    id: 1,
    name: "Sac à Main Cuir Tressé Luxe",
    price: 320,
    originalPrice: 380,
    image: "/images/sac/1.jpeg",
    category: "Sacs à Main",
    rating: 5,
    isNew: true,
    handle: "sac-main-cuir-tresse-luxe"
  },
  {
    id: 2,
    name: "Pochette Soirée Brodée Or",
    price: 165,
    originalPrice: 195,
    image: "/images/sac/2.jpeg",
    category: "Pochettes",
    rating: 4.9,
    handle: "pochette-soiree-brodee-or"
  },
  {
    id: 3,
    name: "Sac Cabas Artisanal Premium",
    price: 245,
    image: "/images/sac/3.jpeg",
    category: "Cabas",
    rating: 4.7,
    handle: "sac-cabas-artisanal-premium"
  },
  {
    id: 4,
    name: "Besace Homme Cuir Noir",
    price: 285,
    originalPrice: 330,
    image: "/images/sac/4.jpeg",
    category: "Collection Homme",
    rating: 4.8,
    handle: "besace-homme-cuir-noir"
  },
  {
    id: 5,
    name: "Sac Bandoulière Femme Camel",
    price: 195,
    image: "/images/sac/5.jpeg",
    category: "Bandoulières",
    rating: 4.6,
    handle: "sac-bandouliere-femme-camel"
  },
  {
    id: 6,
    name: "Portefeuille Luxe Brodé Main",
    price: 125,
    originalPrice: 145,
    image: "/images/sac/6.jpeg",
    category: "Petite Maroquinerie",
    rating: 4.5,
    handle: "portefeuille-luxe-brode-main"
  },
  {
    id: 11,
    name: "Sac Seau Cuir Souple",
    price: 225,
    image: "/images/sac/11.jpeg",
    category: "Sacs Seau",
    rating: 4.7,
    isNew: true,
    handle: "sac-seau-cuir-souple"
  },
  {
    id: 22,
    name: "Cartable Vintage Marron",
    price: 310,
    originalPrice: 365,
    image: "/images/sac/22.jpeg",
    category: "Cartables",
    rating: 5,
    handle: "cartable-vintage-marron"
  },
  {
    id: 33,
    name: "Pochette Ordinateur Cuir",
    price: 185,
    image: "/images/sac/33.jpeg",
    category: "Business",
    rating: 4.6,
    handle: "pochette-ordinateur-cuir"
  },
  {
    id: 44,
    name: "Sac Shopping Tressé Bicolore",
    price: 265,
    originalPrice: 295,
    image: "/images/sac/44.jpeg",
    category: "Shopping",
    rating: 4.8,
    handle: "sac-shopping-tresse-bicolore"
  },
  {
    id: 55,
    name: "Mini Sac Chaîne Dorée",
    price: 145,
    image: "/images/sac/55.jpeg",
    category: "Mini Sacs",
    rating: 4.5,
    handle: "mini-sac-chaine-doree"
  },
  {
    id: 66,
    name: "Sacoche Homme Cuir Vieilli",
    price: 235,
    originalPrice: 275,
    image: "/images/sac/66.jpeg",
    category: "Collection Homme",
    rating: 4.9,
    handle: "sacoche-homme-cuir-vieilli"
  },
  {
    id: 77,
    name: "Sac Weekend Toile et Cuir",
    price: 295,
    image: "/images/sac/77.jpeg",
    category: "Voyage",
    rating: 4.7,
    handle: "sac-weekend-toile-cuir"
  },
  {
    id: 88,
    name: "Porte-Documents Executive",
    price: 345,
    originalPrice: 395,
    image: "/images/sac/88.jpeg",
    category: "Business",
    rating: 5,
    isNew: true,
    handle: "porte-documents-executive"
  },
  {
    id: 99,
    name: "Sac Hobo Franges Bohème",
    price: 215,
    image: "/images/sac/99.jpeg",
    category: "Sacs Hobo",
    rating: 4.6,
    handle: "sac-hobo-franges-boheme"
  },
  {
    id: 100,
    name: "Pochette Ipad Cuir Premium",
    price: 95,
    originalPrice: 115,
    image: "/images/sac/100.jpeg",
    category: "Petite Maroquinerie",
    rating: 4.4,
    handle: "pochette-ipad-cuir-premium"
  },
  {
    id: 101,
    name: "Sac Docteur Vintage Luxe",
    price: 385,
    image: "/images/sac/101.jpeg",
    category: "Sacs Docteur",
    rating: 5,
    handle: "sac-docteur-vintage-luxe"
  }
];

const filters = {
  categories: [
    "Toutes",
    "Sacs à Main",
    "Pochettes",
    "Collection Homme",
    "Business",
    "Voyage",
    "Petite Maroquinerie",
    "Mini Sacs"
  ],
  priceRanges: [
    { label: "Tous les prix", min: 0, max: Infinity },
    { label: "Moins de 150€", min: 0, max: 150 },
    { label: "150€ - 250€", min: 150, max: 250 },
    { label: "250€ - 350€", min: 250, max: 350 },
    { label: "Plus de 350€", min: 350, max: Infinity }
  ],
  materials: ["Cuir pleine fleur", "Cuir grainé", "Cuir nubuck", "Cuir vegan", "Toile et cuir"],
  colors: ["Noir", "Marron", "Camel", "Bordeaux", "Bleu marine", "Beige"]
};

export default function MaroquineriePage() {
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [selectedPriceRange, setSelectedPriceRange] = useState(filters.priceRanges[0]);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les produits depuis Shopify au montage
  useEffect(() => {
    const loadProducts = async () => {
      const shopifyProducts = await fetchShopifyProducts();
      // Si pas de produits Shopify, utiliser les données locales
      setProducts(shopifyProducts.length > 0 ? shopifyProducts : maroquinerieProducts);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
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
      <section className="relative bg-gradient-to-b from-rose-50 to-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-gold/10 text-gold border-gold">
                <Briefcase className="w-3 h-3 mr-1" />
                Maroquinerie d'Exception
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6">
                Sacs & Accessoires en Cuir
              </h1>
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
                Maroquinerie artisanale créée par les maîtres artisans de Marrakech. 
                Cuirs d'exception, finitions parfaites et designs intemporels.
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
                {(selectedCategory !== "Toutes" || selectedPriceRange.label !== "Tous les prix" || selectedMaterial || selectedColor) && (
                  <Badge className="bg-gold text-white">
                    {[selectedCategory !== "Toutes", selectedPriceRange.label !== "Tous les prix", selectedMaterial, selectedColor].filter(Boolean).length}
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

                {/* Couleurs */}
                <div>
                  <h3 className="font-semibold mb-3">Couleurs</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {filters.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedColor === color
                            ? 'bg-gold text-white'
                            : 'border hover:border-gold'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory !== "Toutes" || selectedPriceRange.label !== "Tous les prix" || selectedMaterial || selectedColor) && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory("Toutes");
                      setSelectedPriceRange(filters.priceRanges[0]);
                      setSelectedMaterial(null);
                      setSelectedColor(null);
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
                <p className="text-gray-600">Chargement de la maroquinerie...</p>
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
                  setSelectedMaterial(null);
                  setSelectedColor(null);
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
                <Award className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Cuir d'Exception</h3>
              <p className="text-gray-600">Cuirs sélectionnés et tannage végétal traditionnel</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Savoir-Faire Artisanal</h3>
              <p className="text-gray-600">Techniques ancestrales transmises de génération en génération</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Pièces Uniques</h3>
              <p className="text-gray-600">Chaque création est unique et numérotée</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}