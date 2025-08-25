'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import ProductGallery from '@/components/ProductGallery';
import ProductCard from '@/components/ProductCard';
import Testimonials from '@/components/Testimonials';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, ShoppingBag, Share2, Truck, Shield, RefreshCw, 
  ChevronRight, Star, Minus, Plus, Check, X, Package,
  Facebook, Twitter, Copy, MessageCircle, Sparkles,
  Clock, Users, Award, Zap, Gift, CreditCard, Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { allProducts } from '@/data/allProducts';

// Fonction pour récupérer un produit depuis Shopify Storefront API
async function fetchShopifyProduct(handle: string) {
  try {
    const response = await fetch('/api/shopify-storefront', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query getProduct($handle: String!) {
            productByHandle(handle: $handle) {
              id
              title
              handle
              description
              descriptionHtml
              tags
              vendor
              productType
              priceRange {
                minVariantPrice { amount currencyCode }
              }
              compareAtPriceRange {
                minVariantPrice { amount currencyCode }
              }
              images(first: 10) {
                edges {
                  node { url altText }
                }
              }
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    selectedOptions {
                      name
                      value
                    }
                    priceV2 { amount currencyCode }
                    compareAtPriceV2 { amount currencyCode }
                  }
                }
              }
            }
          }
        `,
        variables: { handle }
      })
    });
    
    const data = await response.json();
    
    if (data?.data?.productByHandle) {
      const product = data.data.productByHandle;
      return {
        id: product.id,
        name: product.title,
        handle: product.handle,
        productType: product.productType,
        price: parseFloat(product.priceRange.minVariantPrice.amount),
        originalPrice: product.compareAtPriceRange?.minVariantPrice?.amount 
          ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
          : undefined,
        images: product.images.edges.map((edge: any) => ({
          src: edge.node.url,
          alt: edge.node.altText || product.title
        })),
        description: product.descriptionHtml || product.description,
        category: product.productType,
        categorySlug: product.productType.toLowerCase().replace(/\s+/g, '-'),
        tags: product.tags,
        vendor: product.vendor,
        rating: 4.5 + Math.random() * 0.5,
        isNew: product.tags.includes('Nouveau'),
        variants: product.variants.edges.map((edge: any) => edge.node)
      };
    }
  } catch (error) {
    console.error('Erreur Shopify:', error);
  }
  return null;
}

// Fonction pour récupérer les recommandations
async function fetchProductRecommendations(productId: string) {
  try {
    const response = await fetch('/api/shopify-storefront', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query getRecommendations($productId: ID!) {
            productRecommendations(productId: $productId) {
              id
              title
              handle
              vendor
              productType
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
        `,
        variables: { productId }
      })
    });
    
    const data = await response.json();
    
    if (data?.data?.productRecommendations) {
      const products = data.data.productRecommendations
        .slice(0, 4) // Maximum 4 produits
        .map((node: any) => {
          // Map productType from Shopify to our category format
          const categoryMap: { [key: string]: string } = {
            'Tissu': 'Tissus',
            'Tissus': 'Tissus',
            'Parfum': 'Parfums',
            'Parfums': 'Parfums',
            'Chaussure': 'Chaussures',
            'Chaussures': 'Chaussures',
            'Sac': 'Maroquinerie',
            'Maroquinerie': 'Maroquinerie',
            'Jellaba Femme': 'Jellabas Femme',
            'Jellabas Femme': 'Jellabas Femme',
            'Jellaba Homme': 'Jellabas Homme',
            'Jellabas Homme': 'Jellabas Homme',
          };
          
          const category = categoryMap[node.productType] || node.productType || 'Produits';
          
          return {
            id: node.id,
            name: node.title,
            handle: node.handle,
            price: parseFloat(node.priceRange.minVariantPrice.amount),
            originalPrice: node.compareAtPriceRange?.minVariantPrice?.amount 
              ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
              : undefined,
            image: node.images.edges[0]?.node?.url,
            category: category,
            rating: 4.5 + Math.random() * 0.5,
            isNew: Math.random() > 0.7
          };
        });
      
      return products;
    }
  } catch (error) {
    console.error('Erreur recommandations:', error);
  }
  return [];
}


interface ProductDetailClientProps {
  slug: string;
  initialProduct?: any;
  initialRecommendations?: any[];
  breadcrumbCategory?: {
    name: string;
    href: string;
  };
}

export default function ProductDetailClient({ slug, initialProduct, initialRecommendations, breadcrumbCategory }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { convertPrice, formatPrice } = useCurrency();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  // Charger le produit depuis Shopify
  useEffect(() => {
    const loadProduct = async () => {
      // Si on a déjà le produit depuis le serveur, l'utiliser
      if (initialProduct) {
        const formattedProduct = {
          id: initialProduct.id,
          name: initialProduct.title,
          handle: initialProduct.handle,
          productType: initialProduct.productType,
          price: parseFloat(initialProduct.priceRange.minVariantPrice.amount),
          originalPrice: initialProduct.compareAtPriceRange?.minVariantPrice?.amount 
            ? parseFloat(initialProduct.compareAtPriceRange.minVariantPrice.amount)
            : undefined,
          images: initialProduct.images.edges.map((edge: any) => ({
            src: edge.node.url,
            alt: edge.node.altText || initialProduct.title
          })),
          description: initialProduct.descriptionHtml || initialProduct.description,
          category: initialProduct.productType,
          categorySlug: initialProduct.productType.toLowerCase().replace(/\s+/g, '-'),
          tags: initialProduct.tags,
          vendor: initialProduct.vendor,
          rating: 4.5 + Math.random() * 0.5,
          isNew: initialProduct.tags.includes('Nouveau'),
          variants: initialProduct.variants.edges.map((edge: any) => edge.node)
        };
        setProduct(formattedProduct);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      const shopifyProduct = await fetchShopifyProduct(slug);
      
      if (shopifyProduct) {
        setProduct(shopifyProduct);
      } else {
        // Fallback: utiliser les données locales
        const localProduct = allProducts[slug];
        if (localProduct) {
          setProduct(localProduct);
        }
      }
      setIsLoading(false);
    };
    
    loadProduct();
  }, [slug, initialProduct]);

  // Charger les recommandations
  useEffect(() => {
    const loadRelatedProducts = async () => {
      // Si on a déjà les recommandations depuis le serveur
      if (initialRecommendations) {
        // Map categories for initial recommendations too
        const categoryMap: { [key: string]: string } = {
          'Tissu': 'Tissus',
          'Tissus': 'Tissus',
          'Parfum': 'Parfums',
          'Parfums': 'Parfums',
          'Chaussure': 'Chaussures',
          'Chaussures': 'Chaussures',
          'Sac': 'Maroquinerie',
          'Maroquinerie': 'Maroquinerie',
          'Jellaba Femme': 'Jellabas Femme',
          'Jellabas Femme': 'Jellabas Femme',
          'Jellaba Homme': 'Jellabas Homme',
          'Jellabas Homme': 'Jellabas Homme',
        };
        
        const mappedRecommendations = initialRecommendations.map((rec: any) => ({
          ...rec,
          category: categoryMap[rec.productType] || rec.productType || rec.category || 'Produits'
        }));
        
        setRelatedProducts(mappedRecommendations);
        return;
      }

      // Sinon charger via l'API
      if (product?.id) {
        const recommendations = await fetchProductRecommendations(product.id);
        console.log('Recommandations trouvées:', recommendations);
        setRelatedProducts(recommendations);
      }
    };
    loadRelatedProducts();
  }, [product, initialRecommendations]);


  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Veuillez sélectionner une taille');
      return;
    }
    if (!selectedColor) {
      toast.error('Veuillez sélectionner une couleur');
      return;
    }

    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity
    });
    
    toast.success('Produit ajouté au panier !');
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Découvrez ${product?.name} sur ZaharaShop`;
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${text} ${url}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Lien copié !');
        break;
    }
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'Noir', hex: '#000000' },
    { name: 'Blanc', hex: '#FFFFFF' },
    { name: 'Beige', hex: '#F5E6D3' },
    { name: 'Bleu Marine', hex: '#000080' },
    { name: 'Bordeaux', hex: '#800020' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <AnnouncementBar />
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du produit...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <AnnouncementBar />
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <p className="text-gray-600 mb-8">Le produit que vous recherchez n'existe pas.</p>
          <Button onClick={() => router.push('/')}>Retour à l'accueil</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <a href="/" className="hover:text-black transition-colors">Accueil</a>
          <ChevronRight className="w-4 h-4" />
          <a href={breadcrumbCategory?.href || `/${product.categorySlug || 'jellabas'}`} className="hover:text-black transition-colors">
            {breadcrumbCategory?.name || product.category}
          </a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black font-medium">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Gallery */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Product Info + Actions */}
          <div className="lg:sticky lg:top-28 h-fit space-y-8">
            {/* Product Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                {product.isNew && (
                  <Badge className="bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200 px-3 py-1">
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    Nouveau
                  </Badge>
                )}
                <Badge className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200 px-3 py-1">
                  <Award className="w-3 h-3 mr-1.5" />
                  Best-seller
                </Badge>
              </div>
              <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-base font-medium text-gray-700">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-base text-gray-600">
                  127 avis vérifiés
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(convertPrice(product.price))}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-2xl text-gray-400 line-through">
                          {formatPrice(convertPrice(product.originalPrice))}
                        </span>
                        <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-3 py-1 font-bold">
                          -{discount}%
                        </Badge>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">TVA incluse • Livraison calculée à la commande</p>
                </div>
                <button
                  onClick={() => setIsWishlist(!isWishlist)}
                  className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
                >
                  <Heart className={`w-6 h-6 transition-all ${isWishlist ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400 hover:text-red-500'}`} />
                </button>
              </div>
            </div>


            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-semibold text-gray-900">Taille</label>
                <button className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors">Guide des tailles</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3.5 px-4 rounded-xl border-2 font-medium transition-all transform hover:scale-105 ${
                      selectedSize === size
                        ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                        : 'border-gray-200 hover:border-gray-400 bg-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="text-lg font-semibold text-gray-900 mb-4 block">
                Couleur: <span className="font-normal text-gray-600">{selectedColor}</span>
              </label>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`relative w-12 h-12 rounded-xl transition-all transform hover:scale-110 ${
                      selectedColor === color.name ? 'ring-2 ring-offset-2 ring-gray-900 shadow-lg' : 'shadow-md hover:shadow-lg'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {color.hex === '#FFFFFF' && (
                      <div className="absolute inset-0 rounded-xl border-2 border-gray-200" />
                    )}
                    {selectedColor === color.name && (
                      <Check className="absolute inset-0 m-auto w-5 h-5 text-white mix-blend-difference" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-lg font-semibold text-gray-900 mb-4 block">Quantité</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-semibold min-w-[80px] text-center text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 font-medium">
                    En stock (15 disponibles)
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
              >
                <ShoppingBag className="mr-3 w-5 h-5" />
                Ajouter au panier
                {quantity > 1 && (
                  <span className="ml-2">• {formatPrice(convertPrice(product.price * quantity))}</span>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full py-6 text-lg font-semibold border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all"
              >
                <Zap className="mr-3 w-5 h-5" />
                Acheter maintenant
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mx-auto mb-2">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-xs font-medium text-gray-700">Paiement sécurisé</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mx-auto mb-2">
                  <Truck className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-xs font-medium text-gray-700">Livraison gratuite</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mx-auto mb-2">
                  <RefreshCw className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-xs font-medium text-gray-700">Retour 30 jours</p>
              </div>
            </div>

            {/* Share */}
            <div className="border-t pt-6">
              <p className="text-sm font-semibold text-gray-900 mb-3">Partager ce produit</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all hover:scale-105"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-all hover:scale-105"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="p-2.5 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="p-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all hover:scale-105"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section - Below Gallery */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-6">Description du produit</h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du produit</h3>
              <ul className="space-y-3">
                <li className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-600">Référence</span>
                  <span className="font-medium text-gray-900">#{product.id?.slice(-8) || 'ZH2024'}</span>
                </li>
                <li className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-600">Catégorie</span>
                  <span className="font-medium text-gray-900">{product.category}</span>
                </li>
                <li className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-600">Matière</span>
                  <span className="font-medium text-gray-900">100% {product.material || 'Premium'}</span>
                </li>
                <li className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-600">Entretien</span>
                  <span className="font-medium text-gray-900">Lavage à la main</span>
                </li>
                <li className="flex justify-between py-2">
                  <span className="text-gray-600">Origine</span>
                  <span className="font-medium text-gray-900">Maroc</span>
                </li>
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de livraison</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Livraison Express</p>
                    <p className="text-sm text-gray-600">2-3 jours ouvrés</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Livraison Standard</p>
                    <p className="text-sm text-gray-600">5-7 jours ouvrés</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Retours gratuits</p>
                    <p className="text-sm text-gray-600">Sous 30 jours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-20">
          <h2 className="text-3xl font-playfair font-bold mb-8">Vous pourriez aussi aimer</h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Chargement des recommandations...
            </div>
          )}
        </section>

        {/* Testimonials */}
        <Testimonials />
      </div>

      <Footer />
    </div>
  );
}