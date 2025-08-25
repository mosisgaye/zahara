'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryHero from '@/components/CategoryHero';
import FilterBar from '@/components/FilterBar';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Droplets, Leaf, Shield, Heart, Star, ChevronRight, 
  CheckCircle2, Sparkles, FlaskConical, Award 
} from 'lucide-react';

// Fonction pour récupérer les produits depuis Shopify
async function fetchShopifyProducts() {
  try {
    const response = await fetch('/api/shopify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
          collectionByHandle(handle: "huiles") {
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
                  variants(first: 1) {
                    edges {
                      node {
                        compareAtPrice
                      }
                    }
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
        price: Math.round(parseFloat(node.priceRange.minVariantPrice.amount) / 100),
        originalPrice: node.variants.edges[0]?.node?.compareAtPrice 
          ? Math.round(parseFloat(node.variants.edges[0].node.compareAtPrice) / 100)
          : undefined,
        image: node.images.edges[0]?.node?.url || `/images/parfum/${Math.floor(Math.random() * 15) + 1}.jpeg`,
        category: "Huiles",
        rating: 4.5 + Math.random() * 0.5,
        isNew: Math.random() > 0.7,
        type: "huile",
        volume: "100ml",
        bio: Math.random() > 0.5
      }));
    }
  } catch (error) {
    console.error('Erreur Shopify:', error);
  }
  return [];
}

// Mock data - sera remplacé par Shopify API (fallback)
const huilesProducts = [
  {
    id: 5,
    name: "Huile d'Argan Pure Bio",
    price: 45,
    originalPrice: 55,
    image: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Huiles Précieuses",
    isNew: true,
    rating: 5,
    type: "argan",
    volume: "100ml",
    bio: true
  },
  {
    id: 6,
    name: "Huile de Rose Damassée",
    price: 89,
    image: "https://images.pexels.com/photos/4041396/pexels-photo-4041396.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Huiles Rares",
    rating: 5,
    type: "rose",
    volume: "50ml",
    bio: true
  },
  {
    id: 7,
    name: "Huile d'Amande Douce",
    price: 32,
    originalPrice: 40,
    image: "https://images.pexels.com/photos/4041398/pexels-photo-4041398.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Huiles Essentielles",
    rating: 4,
    type: "amande",
    volume: "100ml",
    bio: false
  },
  {
    id: 8,
    name: "Huile de Cactus Rare",
    price: 125,
    image: "https://images.pexels.com/photos/4041394/pexels-photo-4041394.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Collection Exclusive",
    isNew: true,
    rating: 5,
    type: "cactus",
    volume: "30ml",
    bio: true
  },
  {
    id: 9,
    name: "Huile de Nigelle",
    price: 38,
    image: "https://images.pexels.com/photos/4041400/pexels-photo-4041400.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Huiles Médicinales",
    rating: 5,
    type: "nigelle",
    volume: "100ml",
    bio: true
  },
  {
    id: 10,
    name: "Huile de Jojoba",
    price: 42,
    originalPrice: 50,
    image: "https://images.pexels.com/photos/4041402/pexels-photo-4041402.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Huiles Essentielles",
    rating: 4,
    type: "jojoba",
    volume: "50ml",
    bio: false
  }
];

const filterOptions = [
  {
    id: 'type',
    label: 'Type d\'huile',
    type: 'checkbox' as const,
    options: [
      { value: 'argan', label: 'Argan', count: 8 },
      { value: 'rose', label: 'Rose', count: 4 },
      { value: 'cactus', label: 'Cactus', count: 3 },
      { value: 'amande', label: 'Amande', count: 5 },
      { value: 'nigelle', label: 'Nigelle', count: 3 }
    ]
  },
  {
    id: 'proprietes',
    label: 'Propriétés',
    type: 'checkbox' as const,
    options: [
      { value: 'hydratant', label: 'Hydratant', count: 12 },
      { value: 'anti-age', label: 'Anti-âge', count: 8 },
      { value: 'reparateur', label: 'Réparateur', count: 6 },
      { value: 'apaisant', label: 'Apaisant', count: 7 }
    ]
  },
  {
    id: 'volume',
    label: 'Volume',
    type: 'checkbox' as const,
    options: [
      { value: '30ml', label: '30ml', count: 4 },
      { value: '50ml', label: '50ml', count: 6 },
      { value: '100ml', label: '100ml', count: 8 },
      { value: '200ml', label: '200ml', count: 3 }
    ]
  },
  {
    id: 'certification',
    label: 'Certification',
    type: 'checkbox' as const,
    options: [
      { value: 'bio', label: 'Bio', count: 15 },
      { value: 'ecocert', label: 'Ecocert', count: 10 },
      { value: 'naturel', label: '100% Naturel', count: 18 }
    ]
  }
];

const benefitsData = [
  {
    icon: <Droplets className="w-6 h-6" />,
    title: "Hydratation Intense",
    description: "Pénètre en profondeur pour une hydratation longue durée"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Protection",
    description: "Barrière naturelle contre les agressions extérieures"
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Éclat",
    description: "Redonne luminosité et vitalité à votre peau"
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Anti-âge",
    description: "Riche en antioxydants pour lutter contre le vieillissement"
  }
];

const usageGuide = [
  {
    step: 1,
    title: "Nettoyez",
    description: "Préparez votre peau avec un nettoyage doux"
  },
  {
    step: 2,
    title: "Appliquez",
    description: "Quelques gouttes suffisent sur peau humide"
  },
  {
    step: 3,
    title: "Massez",
    description: "Mouvements circulaires pour stimuler l'absorption"
  },
  {
    step: 4,
    title: "Laissez agir",
    description: "Permettez à l'huile de pénétrer complètement"
  }
];

export default function HuilesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedComparison, setSelectedComparison] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les produits depuis Shopify au montage
  useEffect(() => {
    const loadProducts = async () => {
      const shopifyProducts = await fetchShopifyProducts();
      // Si pas de produits Shopify, utiliser les données locales
      const productsToUse = shopifyProducts.length > 0 ? shopifyProducts : huilesProducts;
      setProducts(productsToUse);
      setFilteredProducts(productsToUse);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <CategoryHero
        title="Huiles Précieuses"
        subtitle="Trésors du Maroc"
        description="Des huiles rares et authentiques, extraites selon des méthodes ancestrales pour préserver toutes leurs propriétés bienfaisantes."
        image="https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?auto=compress&cs=tinysrgb&w=1260"
        breadcrumbs={[
          { label: 'Huiles', href: '/huiles' }
        ]}
      />

      <FilterBar
        filters={filterOptions}
        onFilterChange={handleFilterChange}
        totalProducts={filteredProducts.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-playfair font-bold text-center mb-12">
            Les Bienfaits de Nos Huiles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefitsData.map((benefit, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-shadow duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications Banner */}
        <div className="mb-16 p-8 rounded-3xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Certifiées Bio</h2>
              </div>
              <p className="text-gray-700 max-w-xl">
                Nos huiles sont certifiées biologiques et extraites selon des méthodes 
                traditionnelles qui préservent tous leurs bienfaits naturels.
              </p>
            </div>
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="w-20 h-20 mb-2 rounded-full bg-white shadow-md flex items-center justify-center">
                  <Award className="w-10 h-10 text-green-600" />
                </div>
                <span className="text-xs font-semibold">Ecocert</span>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mb-2 rounded-full bg-white shadow-md flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <span className="text-xs font-semibold">Bio EU</span>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mb-2 rounded-full bg-white shadow-md flex items-center justify-center">
                  <FlaskConical className="w-10 h-10 text-green-600" />
                </div>
                <span className="text-xs font-semibold">Sans Test</span>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Guide */}
        <div className="mb-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12">
          <h2 className="text-3xl font-playfair font-bold text-center mb-4">
            Guide d'Utilisation
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Découvrez comment tirer le meilleur parti de nos huiles précieuses 
            avec notre routine beauté en 4 étapes simples.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {usageGuide.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center text-white text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Products Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="all">Toutes les Huiles</TabsTrigger>
              <TabsTrigger value="bio">Certifiées Bio</TabsTrigger>
              <TabsTrigger value="rare">Huiles Rares</TabsTrigger>
              <TabsTrigger value="sets">Coffrets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {isLoading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des huiles...</p>
                  </div>
                </div>
              ) : (
                <div className={`grid ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                } gap-8`}>
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="relative">
                      {product.bio && (
                        <Badge className="absolute -top-2 -left-2 z-10 bg-green-500 text-white">
                          <Leaf className="w-3 h-3 mr-1" />
                          Bio
                        </Badge>
                      )}
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="bio">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.filter(p => p.bio).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="rare">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.filter(p => p.category === "Huiles Rares" || p.category === "Collection Exclusive").map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="sets">
              <div className="text-center py-12">
                <p className="text-gray-500">Découvrez bientôt nos coffrets exclusifs</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-playfair font-bold mb-8">Tableau Comparatif</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 font-semibold">Huile</th>
                  <th className="text-center p-4">Type de peau</th>
                  <th className="text-center p-4">Absorption</th>
                  <th className="text-center p-4">Texture</th>
                  <th className="text-center p-4">Utilisation</th>
                  <th className="text-center p-4">Prix/100ml</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold">Argan</td>
                  <td className="text-center p-4">Tous types</td>
                  <td className="text-center p-4">Rapide</td>
                  <td className="text-center p-4">Légère</td>
                  <td className="text-center p-4">Visage & Corps</td>
                  <td className="text-center p-4 font-bold">45€</td>
                </tr>
                <tr className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold">Rose</td>
                  <td className="text-center p-4">Sèche/Mature</td>
                  <td className="text-center p-4">Moyenne</td>
                  <td className="text-center p-4">Riche</td>
                  <td className="text-center p-4">Visage</td>
                  <td className="text-center p-4 font-bold">178€</td>
                </tr>
                <tr className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold">Cactus</td>
                  <td className="text-center p-4">Mature</td>
                  <td className="text-center p-4">Rapide</td>
                  <td className="text-center p-4">Fluide</td>
                  <td className="text-center p-4">Visage</td>
                  <td className="text-center p-4 font-bold">416€</td>
                </tr>
                <tr className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold">Amande</td>
                  <td className="text-center p-4">Sensible</td>
                  <td className="text-center p-4">Lente</td>
                  <td className="text-center p-4">Onctueuse</td>
                  <td className="text-center p-4">Corps</td>
                  <td className="text-center p-4 font-bold">32€</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16 grid md:grid-cols-2 gap-8">
          <Card className="p-8 border-0 bg-gradient-to-br from-rose-50 to-white">
            <div className="flex items-start space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-gray-700 mb-4 italic">
              "L'huile d'argan a transformé ma peau. Plus douce, plus lumineuse, 
              je ne peux plus m'en passer !"
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div>
                <p className="font-semibold">Sarah M.</p>
                <p className="text-sm text-gray-600">Cliente vérifiée</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-8 border-0 bg-gradient-to-br from-green-50 to-white">
            <div className="flex items-start space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-gray-700 mb-4 italic">
              "La qualité est exceptionnelle. On sent vraiment que c'est du 100% 
              naturel et bio. Mes cheveux n'ont jamais été aussi beaux."
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div>
                <p className="font-semibold">Fatima B.</p>
                <p className="text-sm text-gray-600">Cliente vérifiée</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="min-w-[200px]">
            Charger plus de produits
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}