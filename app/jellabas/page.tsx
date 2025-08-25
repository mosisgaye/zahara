'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Crown, Sparkles } from 'lucide-react';

const collections = [
  {
    title: 'Collection Femme',
    description: 'Jellabas féminines élégantes alliant tradition et modernité. Broderies raffinées, tissus nobles et coupes gracieuses.',
    href: '/jellabas/femme',
    image: '/images/femme/femme-1.jpeg',
    badge: 'Plus de 50 modèles',
    color: 'from-pink-50 to-rose-50'
  },
  {
    title: 'Collection Homme',
    description: 'Jellabas masculines distinguées pour l\'homme moderne. Style authentique, confort optimal et finitions impeccables.',
    href: '/jellabas/homme',
    image: '/images/homme/homme-1.jpeg',
    badge: 'Plus de 40 modèles',
    color: 'from-blue-50 to-indigo-50'
  }
];

export default function JellabasPage() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gold/5 to-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-gold/10 text-gold border-gold">
                <Crown className="w-3 h-3 mr-1" />
                Collections Exclusives
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6">
                Jellabas d'Exception
              </h1>
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
                Découvrez nos collections de jellabas traditionnelles marocaines. 
                Confection artisanale, tissus nobles et broderies précieuses pour sublimer chaque occasion.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <a href="/" className="hover:text-black transition-colors">Accueil</a>
          <span>/</span>
          <span className="text-black font-medium">Jellabas</span>
        </nav>
      </div>

      {/* Collections Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Link href={collection.href} className="group block">
                  <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${collection.color}`}>
                    <div className="aspect-[4/5] relative">
                      <img
                        src={collection.image}
                        alt={collection.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <Badge className="mb-4 bg-white/20 backdrop-blur text-white border-white/30">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {collection.badge}
                        </Badge>
                        <h2 className="text-3xl font-playfair font-bold mb-3">
                          {collection.title}
                        </h2>
                        <p className="text-white/90 mb-6 line-clamp-2">
                          {collection.description}
                        </p>
                        <Button 
                          className="bg-white text-black hover:bg-white/90 group-hover:translate-x-2 transition-all"
                        >
                          Découvrir la collection
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 text-center"
          >
            <div className="bg-gradient-to-r from-gold/10 to-gold/5 rounded-3xl p-12">
              <Crown className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-2xl font-playfair font-bold mb-4">
                Création Sur Mesure
              </h3>
              <p className="text-gray-700 max-w-2xl mx-auto mb-8">
                Nous réalisons également des jellabas sur mesure selon vos envies. 
                Choisissez votre tissu, vos broderies et créez la jellaba de vos rêves.
              </p>
              <Button size="lg" className="bg-gold hover:bg-gold/90">
                Demander un devis personnalisé
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Tradition Authentique</h3>
              <p className="text-gray-600">Savoir-faire ancestral transmis de génération en génération</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Broderies Précieuses</h3>
              <p className="text-gray-600">Ornements délicats brodés à la main avec fils d'or et d'argent</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Livraison Express</h3>
              <p className="text-gray-600">Expédition sous 48h partout dans le monde</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}