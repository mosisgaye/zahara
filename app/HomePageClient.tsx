'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Crown, Heart, Truck, Shield, Award, Users } from 'lucide-react';

interface HomePageClientProps {
  productsByCategory: {
    jellabas: any[];
    chaussures: any[];
    parfums: any[];
    nouveautes: any[];
    tous: any[];
  };
  collections: any[];
  featuredProducts: any[];
}

export default function HomePageClient({ 
  productsByCategory, 
  collections, 
  featuredProducts 
}: HomePageClientProps) {
  const [activeCategory, setActiveCategory] = useState('tous');
  
  const categories = [
    { id: 'tous', label: 'Tous', count: productsByCategory.tous.length },
    { id: 'jellabas', label: 'Jellabas', count: productsByCategory.jellabas.length },
    { id: 'chaussures', label: 'Chaussures', count: productsByCategory.chaussures.length },
    { id: 'parfums', label: 'Parfums', count: productsByCategory.parfums.length },
    { id: 'nouveautes', label: 'Nouveautés', count: productsByCategory.nouveautes.length }
  ];

  const getProductsForCategory = () => {
    return productsByCategory[activeCategory as keyof typeof productsByCategory] || productsByCategory.tous;
  };

  const features = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Livraison Gratuite",
      description: "Dès 75€ d'achat en France"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Paiement Sécurisé",
      description: "Transaction 100% sécurisée"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Qualité Premium",
      description: "Produits authentiques garantis"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Service Client",
      description: "Support 7j/7 à votre écoute"
    }
  ];

  const testimonials = [
    {
      name: "Sophie L.",
      rating: 5,
      comment: "Qualité exceptionnelle ! Ma jellaba est magnifique, le tissu est somptueux.",
      product: "Jellaba Royale"
    },
    {
      name: "Mohamed K.",
      rating: 5,
      comment: "Service impeccable et livraison rapide. Les babouches sont très confortables.",
      product: "Babouches Traditionnelles"
    },
    {
      name: "Amira B.",
      rating: 5,
      comment: "Le parfum Oud est divin ! Une fragrance qui dure toute la journée.",
      product: "Oud Royal"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-pink-800">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Collection 2024
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              L'Élégance <br />Marocaine
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Découvrez notre collection exclusive de produits artisanaux marocains. 
              Tradition et modernité se rencontrent dans chaque création.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
                Découvrir la Collection
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Notre Histoire
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 text-purple-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Crown className="w-3 h-3 mr-1" />
              Nos Best-Sellers
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Produits Phares</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos créations les plus appréciées, sélectionnées avec soin pour leur qualité exceptionnelle
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-8 overflow-x-auto">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeCategory === category.id
                      ? 'bg-white shadow-sm font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {category.label}
                  {category.count > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {category.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {getProductsForCategory().map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {getProductsForCategory().length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucun produit disponible dans cette catégorie pour le moment.
              </p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/collections">
              <Button variant="outline" size="lg">
                Voir Tous les Produits
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      {collections.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Nos Collections</h2>
              <p className="text-muted-foreground">
                Explorez nos différentes gammes de produits
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collections.slice(0, 6).map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/collections/${collection.handle}`}>
                    <div className="group cursor-pointer">
                      <div className="relative h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden">
                        {collection.image && (
                          <img 
                            src={collection.image} 
                            alt={collection.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-xl font-semibold">{collection.title}</h3>
                          {collection.productsCount > 0 && (
                            <p className="text-sm opacity-90">
                              {collection.productsCount} produits
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Heart className="w-3 h-3 mr-1" />
              Témoignages
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Ce que disent nos clients</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm border"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.comment}"</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{testimonial.name}</span>
                  <span className="text-sm text-muted-foreground">{testimonial.product}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900 to-pink-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Restez informé</h2>
          <p className="mb-8 text-white/90">
            Inscrivez-vous pour recevoir nos offres exclusives et nouveautés
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <Button className="bg-white text-purple-900 hover:bg-gray-100">
              S'inscrire
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}