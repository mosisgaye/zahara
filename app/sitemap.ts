import { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/shopify-storefront';

// Helper function to get category path
function getCategoryPath(productType: string): string {
  const categoryPaths: { [key: string]: string } = {
    'Tissus': 'tissus',
    'Parfums': 'parfums',
    'Chaussures': 'chaussures',
    'Maroquinerie': 'maroquinerie',
    'Jellabas Femme': 'jellabas/femme',
    'Jellabas Homme': 'jellabas/homme',
  };
  return categoryPaths[productType] || 'products';
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://zaharashop.net';
  
  // Pages statiques principales
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/jellabas/femme`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jellabas/homme`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/chaussures`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/maroquinerie`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/parfums`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tissus`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/huiles`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Récupérer tous les produits depuis Shopify
  let productPages: MetadataRoute.Sitemap = [];
  
  try {
    const products = await getAllProducts();
    productPages = products.map((product) => ({
      url: `${baseUrl}/${getCategoryPath(product.productType)}/${product.handle}`,
      lastModified: new Date(product.createdAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des produits pour le sitemap:', error);
    // Fallback vers les données locales si nécessaire
    const { allProducts } = await import('@/data/allProducts');
    productPages = Object.keys(allProducts).map((slug) => {
      // Pour les données locales, on utilise une catégorie par défaut
      const product = allProducts[slug];
      const category = product?.category || 'products';
      return {
        url: `${baseUrl}/${getCategoryPath(category)}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });
  }

  // Pages informatives (à ajouter quand elles existeront)
  const infoPages = [
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  return [...staticPages, ...productPages];
}