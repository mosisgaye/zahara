import { Metadata } from 'next';
import { getProductWithRecommendations, getAllProducts, getProductByHandle } from '@/lib/shopify-storefront';
import ProductDetailClient from '@/components/ProductDetailClient';
import { notFound } from 'next/navigation';

const USE_SHOPIFY = process.env.NEXT_PUBLIC_SHOPIFY_API_MODE === 'proxy' || 
                    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function generateStaticParams() {
  if (USE_SHOPIFY) {
    try {
      const products = await getAllProducts();
      return products
        .filter((product: any) => product.productType === 'Maroquinerie' || product.collections?.includes('maroquinerie'))
        .map((product: any) => ({
          slug: product.handle,
        }));
    } catch (error) {
      console.error('Erreur Shopify:', error);
    }
  }
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  if (USE_SHOPIFY) {
    try {
      const product = await getProductByHandle(slug);
      
      if (product) {
        return {
          title: `${product.title} - Maroquinerie | ZaharaShop`,
          description: product.description || `Découvrez ${product.title} dans notre collection de maroquinerie de luxe`,
          openGraph: {
            title: `${product.title} - Maroquinerie`,
            description: product.description,
            images: product.images.edges[0]?.node.url ? [product.images.edges[0].node.url] : [],
          },
        };
      }
    } catch (error) {
      console.error('Erreur Shopify pour les métadonnées:', error);
    }
  }
  
  const productName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${productName} - Maroquinerie | ZaharaShop`,
    description: `Découvrez ${productName} dans notre collection de maroquinerie de luxe. Livraison gratuite dès 75€.`,
  };
}

export default async function MaroquinerieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (USE_SHOPIFY) {
    try {
      const { product, recommendations } = await getProductWithRecommendations(slug);
      
      if (product) {
        return <ProductDetailClient 
          slug={slug} 
          initialProduct={product}
          initialRecommendations={recommendations}
          breadcrumbCategory={{ name: "Maroquinerie", href: "/maroquinerie" }}
        />;
      }
    } catch (error) {
      console.error('Erreur Shopify:', error);
    }
  }
  
  return <ProductDetailClient 
    slug={slug} 
    breadcrumbCategory={{ name: "Maroquinerie", href: "/maroquinerie" }}
  />;
}