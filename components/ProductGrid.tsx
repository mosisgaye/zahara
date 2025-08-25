import ProductCard from './ProductCard';

const products = {
  jellabas: [
    {
      id: 1,
      name: "Jellaba Royale en Soie",
      handle: "jellaba-royale-soie",
      price: 189,
      originalPrice: 229,
      image: "https://images.pexels.com/photos/6069113/pexels-photo-6069113.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Jellabas Premium",
      isNew: true,
      rating: 5
    },
    {
      id: 2,
      name: "Jellaba Traditionnelle Brodée",
      handle: "jellaba-traditionnelle-brodee",
      price: 159,
      image: "https://images.pexels.com/photos/6069064/pexels-photo-6069064.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Jellabas Classiques",
      rating: 4
    },
    {
      id: 3,
      name: "Jellaba Moderne Élégante",
      handle: "jellaba-moderne-elegante",
      price: 145,
      originalPrice: 179,
      image: "https://images.pexels.com/photos/6069077/pexels-photo-6069077.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Collection Moderne",
      rating: 5
    },
    {
      id: 4,
      name: "Jellaba Caftan Luxe",
      handle: "jellaba-caftan-luxe",
      price: 220,
      image: "https://images.pexels.com/photos/6069110/pexels-photo-6069110.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Jellabas Premium",
      isNew: true,
      rating: 5
    }
  ],
  huiles: [
    {
      id: 5,
      name: "Huile d'Argan Pure Bio",
      handle: "huile-argan-pure-bio",
      price: 45,
      originalPrice: 55,
      image: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Huiles Précieuses",
      isNew: true,
      rating: 5
    },
    {
      id: 6,
      name: "Huile de Rose Damassée",
      handle: "huile-rose-damassee",
      price: 89,
      image: "https://images.pexels.com/photos/4041396/pexels-photo-4041396.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Huiles Rares",
      rating: 5
    },
    {
      id: 7,
      name: "Huile d'Amande Douce",
      handle: "huile-amande-douce",
      price: 32,
      originalPrice: 40,
      image: "https://images.pexels.com/photos/4041398/pexels-photo-4041398.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Huiles Essentielles",
      rating: 4
    },
    {
      id: 8,
      name: "Huile de Cactus Rare",
      handle: "huile-cactus-rare",
      price: 125,
      image: "https://images.pexels.com/photos/4041394/pexels-photo-4041394.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Collection Exclusive",
      isNew: true,
      rating: 5
    }
  ],
  parfums: [
    {
      id: 9,
      name: "Parfum Oud Royal",
      handle: "parfum-oud-royal",
      price: 95,
      originalPrice: 120,
      image: "https://images.pexels.com/photos/3770254/pexels-photo-3770254.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Parfums Orientaux",
      isNew: true,
      rating: 5
    },
    {
      id: 10,
      name: "Essence de Jasmin",
      handle: "essence-jasmin",
      price: 67,
      image: "https://images.pexels.com/photos/3770230/pexels-photo-3770230.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Parfums Floraux",
      rating: 4
    },
    {
      id: 11,
      name: "Musc Blanc Premium",
      handle: "musc-blanc-premium",
      price: 78,
      originalPrice: 95,
      image: "https://images.pexels.com/photos/3770240/pexels-photo-3770240.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Parfums Classiques",
      rating: 5
    },
    {
      id: 12,
      name: "Ambre & Santal",
      handle: "ambre-santal",
      price: 112,
      image: "https://images.pexels.com/photos/3770244/pexels-photo-3770244.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Collection Prestige",
      isNew: true,
      rating: 5
    }
  ]
};

interface ProductGridProps {
  category: 'jellabas' | 'huiles' | 'parfums';
  title: string;
  description: string;
}

export default function ProductGrid({ category, title, description }: ProductGridProps) {
  const categoryProducts = products[category];

  return (
    <section id={category} className="py-24 elegant-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-crimson font-bold text-black mb-6 tracking-tight">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            {description}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-16">
          <button className="btn-secondary px-10 py-4 text-base rounded-lg transition-all duration-300 hover:shadow-lg">
            Découvrir Plus de Créations
          </button>
        </div>
      </div>
    </section>
  );
}