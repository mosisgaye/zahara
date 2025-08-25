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

// Helper function to get category path
function getCategoryPath(productType: string): string {
  const categoryPaths: { [key: string]: string } = {
    'Tissus': 'tissus',
    'Parfums': 'parfums',
    'Chaussures': 'chaussures',
    'Maroquinerie': 'maroquinerie',
    'Jellabas Femme': 'jellabas/femme',
    'Jellabas Homme': 'jellabas/homme',
  };
  return categoryPaths[productType] || 'products';
}

// Fonction pour récupérer les produits depuis Shopify Storefront
async function fetchShopifyProducts() {
  try {
    const response = await fetch('/api/shopify-storefront', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
          products(first: 50) {
            edges {
              node {
                id
                title
                handle
                productType
                tags
                vendor
                priceRange {
                  minVariantPrice { amount currencyCode }
                }
                compareAtPriceRange {
                  minVariantPrice { amount currencyCode }
                }
                images(first: 1) {
                  edges {
                    node { url altText }
                  }
                }
              }
            }
          }
        }`
      })
    });
    
    const data = await response.json();
    if (data?.data?.products?.edges) {
      const allProducts = data.data.products.edges.map(({ node }: any) => ({
        id: node.id,
        name: node.title,
        handle: node.handle,
        price: parseFloat(node.priceRange.minVariantPrice.amount),
        originalPrice: node.compareAtPriceRange?.minVariantPrice?.amount 
          ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
          : undefined,
        image: node.images.edges[0]?.node?.url,
        category: node.productType,
        tags: node.tags,
        vendor: node.vendor,
        rating: 4.5 + Math.random() * 0.5,
        isNew: node.tags?.includes('Nouveau'),
        href: `/${getCategoryPath(node.productType)}/${node.handle}`
      }));
      
      // Sélectionner un produit de chaque catégorie
      const featuredProducts: any[] = [];
      const categories = ['Jellabas Femme', 'Chaussures', 'Parfums', 'Maroquinerie'];
      
      for (const cat of categories) {
        const product = allProducts.find((p: any) => 
          p.category === cat &&
          p.image && // S'assurer que le produit a une image
          !featuredProducts.some((fp: any) => fp.id === p.id)
        );
        if (product) {
          featuredProducts.push(product);
        }
      }
      
      // Si on n'a pas assez de produits variés, compléter avec les premiers disponibles
      if (featuredProducts.length < 4) {
        const remaining = allProducts.filter((p: any) => 
          p.image && // S'assurer que le produit a une image
          !featuredProducts.some((fp: any) => fp.id === p.id)
        );
        featuredProducts.push(...remaining.slice(0, 4 - featuredProducts.length));
      }
      
      return featuredProducts;
    }
  } catch (error) {
    console.error('Erreur Shopify:', error);
  }
  return [];
}

// Produits vedettes par catégorie avec images locales (fallback)
const featuredProductsByCategory = [
  {
    id: 'jellaba-femme-1',
    name: 'Jellaba Royale Brodée Or',
    handle: 'jellaba-royale-soie',
    price: 299,
    originalPrice: 399,
    image: '/images/femme/femme-3.jpeg',
    category: 'Jellabas Femme',
    rating: 4.9,
    isNew: true,
    href: '/jellabas/femme'
  },
  {
    id: 'babouche-1',
    name: 'Babouche Traditionnelle Premium',
    handle: 'babouche-royale-brodee-or',
    price: 89,
    originalPrice: 129,
    image: '/images/chaussures/chaussure-3.jpeg',
    category: 'Chaussures',
    rating: 4.8,
    isNew: false,
    href: '/chaussures'
  },
  {
    id: 'parfum-1',
    name: 'Oud Royal Exclusif',
    handle: 'oud-royal-absolu',
    price: 149,
    originalPrice: 199,
    image: '/images/parfum/parfum-5.jpeg',
    category: 'Parfums',
    rating: 4.9,
    isNew: true,
    href: '/parfums'
  },
  {
    id: 'sac-1',
    name: 'Sac Artisanal Cuir Premium',
    handle: 'sac-main-cuir-tresse-luxe',
    price: 199,
    originalPrice: 299,
    image: '/images/sac/sac-3.jpeg',
    category: 'Maroquinerie',
    rating: 4.7,
    isNew: false,
    href: '/maroquinerie'
  }
];

// Catégories avec images locales
const categories = [
  {
    name: 'Jellabas Femme',
    href: '/jellabas/femme',
    image: '/images/femme/femme-1.png',
    description: 'Collection élégante pour femmes',
    featured: true
  },
  {
    name: 'Jellabas Homme',
    href: '/jellabas/homme',
    image: '/images/homme/homme-1.png',
    description: 'Collection raffinée pour hommes',
    featured: true
  },
  {
    name: 'Chaussures',
    href: '/chaussures',
    image: '/images/chaussures/chaussure-1.png',
    description: 'Babouches et sandales artisanales'
  },
  {
    name: 'Maroquinerie',
    href: '/maroquinerie',
    image: '/images/sac/sac-1.png',
    description: 'Sacs et accessoires en cuir'
  },
  {
    name: 'Parfums',
    href: '/parfums',
    image: '/images/parfum/parfum-1.jpeg',
    description: 'Fragrances orientales rares'
  },
  {
    name: 'Tissus & Mercerie',
    href: '/tissus',
    image: '/images/tissu/tissu-1.jpeg',
    description: 'Tissus précieux et broderies'
  }
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shopifyProducts, setShopifyProducts] = useState<any[]>([]);
  const heroImages = ['/images/accueil/accueil-1.png', '/images/accueil/accueil-2.png', '/images/accueil/accueil-3.png'];
  
  // Animation du carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Charger les produits depuis Shopify
  useEffect(() => {
    fetchShopifyProducts().then(products => {
      if (products.length > 0) {
        setShopifyProducts(products);
      }
    });
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      
      {/* Hero Section avec images locales */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <motion.div
              key={image}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
              transition={{ duration: 1 }}
            >
              <img
                src={image}
                alt={`Hero ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </motion.div>
          ))}
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl px-6"
          >
            <Badge className="mb-6 bg-gold/20 text-white border-gold">
              <Sparkles className="w-4 h-4 mr-2" />
              Artisanat Marocain d'Exception
            </Badge>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6">
              ZaharaShop
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
              L'élégance marocaine authentique depuis 1960
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gold hover:bg-gold/90 text-white"
                asChild
              >
                <Link href="/jellabas/femme">
                  Collection Femme
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur border-white text-white hover:bg-white hover:text-black"
                asChild
              >
                <Link href="/jellabas/homme">
                  Collection Homme
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Indicateurs */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Catégories principales */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold mb-4">Nos Collections</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez l'excellence de l'artisanat marocain à travers nos collections soigneusement sélectionnées
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={category.href} className="group block">
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/5]">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-playfair font-bold text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-white/80 mb-4">{category.description}</p>
                      <div className="flex items-center text-white group-hover:translate-x-2 transition-transform">
                        <span className="mr-2">Découvrir</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                    {category.featured && (
                      <Badge className="absolute top-4 left-4 bg-gold text-white">
                        <Crown className="w-3 h-3 mr-1" />
                        Collection phare
                      </Badge>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section de séparation élégante */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Motif décoratif abstrait */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Ligne décorative */}
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent w-32" />
              <Crown className="w-8 h-8 text-gold mx-4" />
              <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent w-32" />
            </div>
            
            <Badge className="mb-6 bg-gold/10 text-gold border-gold/30">
              Excellence & Tradition
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-playfair font-bold bg-gradient-to-r from-gray-800 via-black to-gray-800 bg-clip-text text-transparent mb-6">
              L'Art de l'Artisanat Marocain
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Depuis plus de 60 ans, nous perpétuons les traditions millénaires de l'artisanat marocain. 
              Chaque pièce est unique, façonnée avec passion par nos maîtres artisans.
            </p>
            
            {/* Statistiques avec design raffiné */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                    <Crown className="w-6 h-6 text-gold" />
                  </div>
                  <div className="text-4xl font-bold text-gold mb-2">60+</div>
                  <div className="text-gray-700 text-sm font-medium text-center">Années d'excellence</div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-gold" />
                  </div>
                  <div className="text-4xl font-bold text-gold mb-2">500+</div>
                  <div className="text-gray-700 text-sm font-medium text-center">Artisans partenaires</div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-gold" />
                  </div>
                  <div className="text-4xl font-bold text-gold mb-2">10K+</div>
                  <div className="text-gray-700 text-sm font-medium text-center">Clients satisfaits</div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-gold" />
                  </div>
                  <div className="text-4xl font-bold text-gold mb-2">100%</div>
                  <div className="text-gray-700 text-sm font-medium text-center">Fait main</div>
                </div>
              </motion.div>
            </div>
            
            {/* Citation inspirante */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-16 p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-gold/20"
            >
              <blockquote className="text-center">
                <p className="text-lg italic text-gray-700 mb-4">
                  "Chaque pièce raconte une histoire, chaque création porte l'âme de l'artisan qui l'a façonnée. 
                  C'est cette passion que nous transmettons depuis trois générations."
                </p>
                <footer className="text-sm text-gold font-semibold">
                  — Famille Zahara, Fondateurs
                </footer>
              </blockquote>
            </motion.div>
            
            {/* Ligne décorative inférieure */}
            <div className="flex items-center justify-center mt-16">
              <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent w-full max-w-md" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Produits vedettes */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gold/10 text-gold border-gold">
              <Sparkles className="w-3 h-3 mr-1" />
              Sélection Premium
            </Badge>
            <h2 className="text-4xl font-playfair font-bold mb-4">Produits Vedettes</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nos pièces les plus exceptionnelles, sélectionnées pour leur qualité et leur authenticité
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(shopifyProducts.length > 0 ? shopifyProducts : featuredProductsByCategory).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    image: product.image,
                    category: product.category,
                    isNew: product.isNew,
                    rating: product.rating,
                    handle: product.handle
                  }} 
                />
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/parfums">
                Voir tous les produits
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Qualité Premium</h3>
              <p className="text-gray-600">Produits authentiques sélectionnés avec soin</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Livraison Rapide</h3>
              <p className="text-gray-600">Expédition sous 48h, livraison gratuite dès 75€</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Paiement Sécurisé</h3>
              <p className="text-gray-600">Transactions 100% sécurisées et cryptées</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Satisfaction Garantie</h3>
              <p className="text-gray-600">30 jours pour changer d'avis</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-br from-gold/10 to-gold/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-playfair font-bold mb-4">
              Restez informé de nos nouveautés
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Inscrivez-vous pour recevoir nos offres exclusives et découvrir nos nouvelles collections
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <Button type="submit" className="bg-gold hover:bg-gold/90">
                S'inscrire
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}