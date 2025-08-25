import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';

export default function Hero() {
  return (
    <section id="accueil" className="relative min-h-screen flex items-center bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-10 animate-elegant-fade">
            <div className="inline-flex items-center space-x-2 bg-gray-50 px-6 py-3 rounded-full border border-gray-200">
              <Star className="h-4 w-4 text-rose-500" />
              <span className="text-sm font-semibold text-gray-800 tracking-wide">ARTISANAT D'EXCEPTION</span>
            </div>
            
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-crimson font-bold text-black leading-[0.9] tracking-tight">
                L'Art de Vivre
                <span className="block text-rose-500">Marocain</span>
                <span className="block">Sublimé</span>
              </h1>
            </div>

            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl font-light">
              Une sélection raffinée de jellabas d'exception, d'huiles rares et de parfums envoûtants. 
              Chaque pièce raconte l'histoire millénaire de l'artisanat marocain.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button size="lg" className="group btn-primary px-8 py-4 text-base rounded-lg">
                Découvrir la Collection
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="btn-secondary px-8 py-4 text-base rounded-lg">
                Nouveautés 2024
              </Button>
            </div>

            <div className="flex items-center space-x-12 pt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-black">500+</div>
                <div className="text-sm text-gray-500 font-medium tracking-wide">CRÉATIONS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black">50+</div>
                <div className="text-sm text-gray-500 font-medium tracking-wide">ARTISANS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black">10K+</div>
                <div className="text-sm text-gray-500 font-medium tracking-wide">CLIENTS</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-elegant-float">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/6069113/pexels-photo-6069113.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Jellaba Marocaine Premium"
                className="w-full h-[700px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-rose-100 rounded-full backdrop-blur-sm animate-pulse" />
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gray-100 rounded-full backdrop-blur-sm animate-pulse delay-1000" />
          </div>
        </div>
      </div>
    </section>
  );
}