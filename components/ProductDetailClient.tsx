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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Gallery + Product Details */}
          <div className="space-y-8">
            {/* Product Gallery */}
            <ProductGallery images={product.images} productName={product.name} />
            
            {/* Product Details Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="shipping">Livraison</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
              </TabsContent>
              <TabsContent value="details" className="mt-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Référence:</span>
                    <span className="font-medium">#{product.id?.slice(-8) || 'ZH2024'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Catégorie:</span>
                    <span className="font-medium">{product.category}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Matière:</span>
                    <span className="font-medium">100% {product.material || 'Premium'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Entretien:</span>
                    <span className="font-medium">Lavage à la main</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Origine:</span>
                    <span className="font-medium">Maroc</span>
                  </li>
                </ul>
              </TabsContent>
              <TabsContent value="shipping" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Truck className="w-5 h-5 text-gold mt-0.5" />
                    <div>
                      <p className="font-medium">Livraison Express</p>
                      <p className="text-sm text-gray-600">2-3 jours ouvrés</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Package className="w-5 h-5 text-gold mt-0.5" />
                    <div>
                      <p className="font-medium">Livraison Standard</p>
                      <p className="text-sm text-gray-600">5-7 jours ouvrés</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RefreshCw className="w-5 h-5 text-gold mt-0.5" />
                    <div>
                      <p className="font-medium">Retours gratuits</p>
                      <p className="text-sm text-gray-600">Sous 30 jours</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column: Product Info + Actions */}
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-gold/10 text-gold border-gold">
                  <Award className="w-3 h-3 mr-1" />
                  Best-seller
                </Badge>
                {product.isNew && (
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Nouveau
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-playfair font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) 
                          ? 'fill-gold text-gold' 
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.rating.toFixed(1)}) • 127 avis
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="border-y py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline space-x-3">
                    <span className="text-3xl font-bold">
                      {formatPrice(convertPrice(product.price))}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-xl text-gray-400 line-through">
                          {formatPrice(convertPrice(product.originalPrice))}
                        </span>
                        <Badge className="bg-red-100 text-red-800">
                          -{discount}%
                        </Badge>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">TVA incluse</p>
                </div>
                <button
                  onClick={() => setIsWishlist(!isWishlist)}
                  className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart className={`w-6 h-6 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
              </div>
            </div>


            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold">Taille</label>
                <button className="text-sm text-gold hover:underline">Guide des tailles</button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 rounded-lg border-2 transition-all ${
                      selectedSize === size
                        ? 'border-gold bg-gold text-white'
                        : 'border-gray-200 hover:border-gold'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="font-semibold mb-3 block">Couleur: {selectedColor}</label>
              <div className="flex space-x-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`relative w-10 h-10 rounded-full transition-all ${
                      selectedColor === color.name ? 'ring-2 ring-offset-2 ring-gold' : ''
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {color.hex === '#FFFFFF' && (
                      <div className="absolute inset-0 rounded-full border border-gray-200" />
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
              <label className="font-semibold mb-3 block">Quantité</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-semibold min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Stock: <span className="font-semibold text-green-600">En stock (15)</span>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-gold hover:bg-gold/90 text-white py-6 text-lg font-semibold"
              >
                <ShoppingBag className="mr-2 w-5 h-5" />
                Ajouter au panier • {formatPrice(convertPrice(product.price * quantity))}
              </Button>
              <Button
                variant="outline"
                className="w-full py-6 text-lg font-semibold border-2"
              >
                <CreditCard className="mr-2 w-5 h-5" />
                Acheter maintenant
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t">
              <div className="text-center">
                <Shield className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="text-xs text-gray-600">Paiement sécurisé</p>
              </div>
              <div className="text-center">
                <Truck className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="text-xs text-gray-600">Livraison gratuite</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="text-xs text-gray-600">Retour 30 jours</p>
              </div>
            </div>

            {/* Share */}
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-3">Partager ce produit:</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  <Copy className="w-5 h-5" />
                </button>
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