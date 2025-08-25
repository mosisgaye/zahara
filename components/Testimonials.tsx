'use client';

import { useState, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  product: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Amina Belkacem",
    location: "Paris, France",
    avatar: "AB",
    rating: 5,
    date: "Il y a 2 semaines",
    comment: "Qualité exceptionnelle! La jellaba est magnifique, le tissu est doux et les finitions sont parfaites. Je recommande vivement ZaharaShop.",
    product: "Jellaba Brodée Luxe",
    verified: true
  },
  {
    id: 2,
    name: "Fatima El Idrissi",
    location: "Casablanca, Maroc",
    avatar: "FE",
    rating: 5,
    date: "Il y a 1 mois",
    comment: "Service client irréprochable et livraison rapide. Les produits sont authentiques et de très haute qualité. C'est ma 3ème commande!",
    product: "Huile d'Argan Pure",
    verified: true
  },
  {
    id: 3,
    name: "Yasmine Tahiri",
    location: "Montréal, Canada",
    avatar: "YT",
    rating: 5,
    date: "Il y a 3 semaines",
    comment: "Les parfums sont divins! L'Oud Royal est exactement ce que je cherchais. Longue tenue et senteur authentique. Merci ZaharaShop!",
    product: "Parfum Oud Royal",
    verified: true
  },
  {
    id: 4,
    name: "Sarah Benali",
    location: "Lyon, France",
    avatar: "SB",
    rating: 5,
    date: "Il y a 1 semaine",
    comment: "Magnifique sac en cuir! L'artisanat marocain dans toute sa splendeur. La qualité justifie totalement le prix.",
    product: "Sac Cabas Artisanal",
    verified: true
  },
  {
    id: 5,
    name: "Leila Mansouri",
    location: "Bruxelles, Belgique",
    avatar: "LM",
    rating: 5,
    date: "Il y a 2 mois",
    comment: "Les babouches sont confortables et élégantes. Parfaites pour la maison ou les occasions spéciales. Je vais en commander d'autres couleurs!",
    product: "Babouche Royale Brodée",
    verified: true
  },
  {
    id: 6,
    name: "Nadia Alami",
    location: "Dubai, UAE",
    avatar: "NA",
    rating: 5,
    date: "Il y a 5 jours",
    comment: "Excellent rapport qualité-prix. Les tissus sont somptueux et la livraison internationale était très bien gérée. Boutique de confiance!",
    product: "Tissu Brodé Traditionnel",
    verified: true
  }
];

export default function Testimonials() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
      
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-black mb-4">
            Ce que disent nos clients
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-lg font-semibold">4.9/5</span>
            <span className="text-gray-600">(+2000 avis vérifiés)</span>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les expériences authentiques de nos clients à travers le monde
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full w-12 h-12 p-0 bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300 ${
              !canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Button>
          
          <Button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full w-12 h-12 p-0 bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300 ${
              !canScrollRight ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!canScrollRight}
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </Button>

          {/* Testimonials Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-12 py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 w-[380px] bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 relative overflow-hidden group"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Quote className="w-20 h-20 text-gold transform rotate-180" />
                </div>

                {/* Header */}
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                      {testimonial.verified && (
                        <div className="flex items-center space-x-1 mt-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">Client vérifié</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating
                            ? 'fill-gold text-gold'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{testimonial.date}</span>
                </div>

                {/* Comment */}
                <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                  "{testimonial.comment}"
                </p>

                {/* Product */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Produit acheté:</p>
                  <p className="text-sm font-semibold text-gold">{testimonial.product}</p>
                </div>

                {/* Decorative Element */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-yellow-500 to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-700">100% Clients Satisfaits</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Paiement Sécurisé</span>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">Livraison Mondiale</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-gold" />
            <span className="text-sm font-medium text-gray-700">Qualité Premium</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}