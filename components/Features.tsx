import { Truck, Shield, Gift, Headphones, Star, Globe } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: "Livraison Gratuite",
    description: "Livraison offerte à partir de 75€ d'achat"
  },
  {
    icon: Shield,
    title: "Qualité Garantie",
    description: "Produits authentiques certifiés par nos artisans"
  },
  {
    icon: Gift,
    title: "Emballage Cadeau",
    description: "Service d'emballage premium offert"
  },
  {
    icon: Headphones,
    title: "Support 24/7",
    description: "Équipe dédiée à votre service"
  },
  {
    icon: Star,
    title: "Satisfaction Client",
    description: "98% de clients satisfaits"
  },
  {
    icon: Globe,
    title: "Livraison Mondiale",
    description: "Expédition dans plus de 50 pays"
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="text-center p-8 rounded-2xl hover:bg-gray-50 transition-all duration-500 group"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full elegant-gradient mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}