'use client';

import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface CategoryHeroProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  breadcrumbs?: { label: string; href: string }[];
}

export default function CategoryHero({
  title,
  subtitle,
  description,
  image,
  breadcrumbs = []
}: CategoryHeroProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 w-full h-[120%]"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav className="mb-8 animate-fade-in-up">
              <ol className="flex items-center space-x-2 text-white/80">
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Accueil
                  </a>
                </li>
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4" />
                    <a 
                      href={crumb.href}
                      className="hover:text-white transition-colors"
                    >
                      {crumb.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Hero Content */}
          <div className="max-w-3xl space-y-6">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm font-semibold tracking-wider uppercase mb-4">
                {subtitle}
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-playfair font-bold text-white animate-fade-in-up" 
                style={{ animationDelay: '0.2s' }}>
              {title}
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed animate-fade-in-up" 
               style={{ animationDelay: '0.3s' }}>
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      
      {/* Animated Gold Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse" />
    </section>
  );
}