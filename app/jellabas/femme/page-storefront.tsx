import { Metadata } from 'next';
import { getCollectionByHandle, getProductsByType } from '@/lib/shopify-storefront';
import JellabasFemmeClient from './JellabasFemmeClient';

export const metadata: Metadata = {
  title: 'Jellabas Femme | ZaharaShop - Collection Exclusive',
  description: 'Découvrez notre collection de jellabas pour femme. Élégance et tradition marocaine, confection artisanale de qualité premium.',
};

export default async function JellabasFemmePage() {
  let products = [];
  
  try {
    // D'abord essayer de récupérer la collection "jellabas-femme"
    const collection = await getCollectionByHandle('jellabas-femme');
    
    if (collection && collection.products) {
      products = collection.products.edges.map(({ node }: any) => ({
        id: node.id,
        name: node.title,
        handle: node.handle,
        price: parseFloat(node.priceRange.minVariantPrice.amount),
        originalPrice: node.compareAtPriceRange?.minVariantPrice?.amount 
          ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
          : undefined,
        image: node.images.edges[0]?.node?.url,
        category: 'Jellabas Femme',
        tags: node.tags || [],
        isNew: node.tags?.includes('Nouveau'),
        rating: 4.5 + Math.random() * 0.5
      }));
    } else {
      // Fallback: chercher par type de produit
      const allProducts = await getProductsByType('Jellaba Femme');
      products = allProducts.map((node: any) => ({
        id: node.id,
        name: node.title,
        handle: node.handle,
        price: parseFloat(node.priceRange.minVariantPrice.amount),
        originalPrice: node.compareAtPriceRange?.minVariantPrice?.amount 
          ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
          : undefined,
        image: node.images.edges[0]?.node?.url,
        category: 'Jellabas Femme',
        tags: node.tags || [],
        isNew: node.tags?.includes('Nouveau'),
        rating: 4.5 + Math.random() * 0.5
      }));
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
  }

  return <JellabasFemmeClient initialProducts={products} />;
}