import { Metadata } from 'next';
import { getCollectionByHandle, getProductsByType } from '@/lib/shopify-storefront';
import JellabasHommeClient from './JellabasHommeClient';

export const metadata: Metadata = {
  title: 'Jellabas Homme | ZaharaShop - Collection Exclusive',
  description: 'Découvrez notre collection de jellabas pour homme. Tradition et modernité, confection artisanale marocaine de qualité premium.',
};

export default async function JellabasHommePage() {
  let products = [];
  
  try {
    // D'abord essayer de récupérer la collection "jellabas-homme"
    const collection = await getCollectionByHandle('jellabas-homme');
    
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
        category: 'Jellabas Homme',
        tags: node.tags || [],
        isNew: node.tags?.includes('Nouveau'),
        rating: 4.5 + Math.random() * 0.5
      }));
    } else {
      // Fallback: chercher par type de produit ou tags
      const allProducts = await getProductsByType('Jellaba Homme');
      products = allProducts.map((node: any) => ({
        id: node.id,
        name: node.title,
        handle: node.handle,
        price: parseFloat(node.priceRange.minVariantPrice.amount),
        originalPrice: node.compareAtPriceRange?.minVariantPrice?.amount 
          ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
          : undefined,
        image: node.images.edges[0]?.node?.url,
        category: 'Jellabas Homme',
        tags: node.tags || [],
        isNew: node.tags?.includes('Nouveau'),
        rating: 4.5 + Math.random() * 0.5
      }));
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
  }

  return <JellabasHommeClient initialProducts={products} />;
}