import { Metadata } from 'next';
import { getAllProducts, getAllCollections } from '@/lib/shopify-storefront';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'ZaharaShop - Boutique Marocaine Premium | Jellabas, Babouches, Parfums',
  description: 'Découvrez notre collection exclusive de produits marocains authentiques. Jellabas, babouches, parfums et accessoires de luxe. Livraison gratuite dès 75€.',
};

export default async function HomePage() {
  let featuredProducts = [];
  let collections = [];
  
  try {
    // Récupérer les produits et collections depuis Storefront API
    const [allProducts, allCollections] = await Promise.all([
      getAllProducts(20), // Limiter à 20 produits pour la page d'accueil
      getAllCollections(10) // Limiter à 10 collections
    ]);

    // Formater les produits pour l'affichage
    featuredProducts = allProducts.slice(0, 12).map((product: any) => ({
      id: product.id,
      name: product.title,
      handle: product.handle,
      price: parseFloat(product.priceRange.minVariantPrice.amount),
      originalPrice: product.compareAtPriceRange?.minVariantPrice?.amount 
        ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
        : undefined,
      image: product.images.edges[0]?.node?.url,
      category: product.productType || 'Produit',
      tags: product.tags || [],
      vendor: product.vendor,
      isNew: product.tags?.includes('Nouveau'),
      rating: 4.5 + Math.random() * 0.5,
      availableForSale: product.availableForSale !== false
    }));

    // Formater les collections
    collections = allCollections.map((collection: any) => ({
      id: collection.id,
      title: collection.title,
      handle: collection.handle,
      description: collection.description,
      image: collection.image?.url,
      productsCount: collection.products?.edges?.length || 0
    }));

  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    // Fallback vers des données par défaut si nécessaire
  }

  // Organiser les produits par catégorie pour l'affichage
  const productsByCategory = {
    jellabas: featuredProducts.filter((p: any) => 
      p.category?.toLowerCase().includes('jellaba') || 
      p.name?.toLowerCase().includes('jellaba')
    ).slice(0, 4),
    chaussures: featuredProducts.filter((p: any) => 
      p.category?.toLowerCase().includes('chaussure') || 
      p.category?.toLowerCase().includes('babouche') ||
      p.name?.toLowerCase().includes('babouche')
    ).slice(0, 4),
    parfums: featuredProducts.filter((p: any) => 
      p.category?.toLowerCase().includes('parfum') || 
      p.name?.toLowerCase().includes('parfum') ||
      p.name?.toLowerCase().includes('oud')
    ).slice(0, 4),
    nouveautes: featuredProducts.filter((p: any) => p.isNew).slice(0, 8),
    tous: featuredProducts
  };

  return <HomePageClient 
    productsByCategory={productsByCategory}
    collections={collections}
    featuredProducts={featuredProducts}
  />;
}