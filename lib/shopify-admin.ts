/**
 * Requêtes GraphQL adaptées pour l'API Admin de Shopify
 * Version temporaire jusqu'à obtention d'un token Storefront valide
 */

import { ShopifyProduct, ShopifyCollection } from './shopify';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'aehp3j-xw.myshopify.com';
const adminApiVersion = '2025-07';
const adminEndpoint = `https://${domain}/admin/api/${adminApiVersion}/graphql.json`;

/**
 * Fonction pour faire des requêtes GraphQL à l'API Admin Shopify
 */
async function shopifyAdminFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, any>;
}): Promise<{ data: T; errors?: any }> {
  // Côté serveur
  if (typeof window === 'undefined') {
    const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    if (!adminToken) {
      throw new Error('Missing SHOPIFY_ADMIN_ACCESS_TOKEN');
    }
    
    const response = await fetch(adminEndpoint, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': adminToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
    
    const data = await response.json();
    if (response.status !== 200) {
      console.error('Shopify Admin API Error:', data);
      throw new Error(data.errors?.[0]?.message || data.message || response.statusText);
    }
    return data;
  }
  
  // Côté client, utiliser le proxy API
  const fetchEndpoint = '/api/shopify';
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(fetchEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();

    if (response.status !== 200) {
      throw new Error(data.message ?? response.statusText);
    }

    return data;
  } catch (error) {
    console.error('Shopify API Error:', error);
    throw error;
  }
}

/**
 * Récupérer tous les produits via l'API Admin
 */
export async function getAllProducts(): Promise<ShopifyProduct[]> {
  const query = `
    query getAllProducts($first: Int = 250) {
      products(first: $first) {
        edges {
          node {
            id
            handle
            title
            description
            productType
            tags
            vendor
            createdAt
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price
                  compareAtPrice
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            metafields(first: 20) {
              edges {
                node {
                  namespace
                  key
                  value
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyAdminFetch<{
      products: { edges: Array<{ node: any }> };
    }>({ query });
    
    if (!response || !response.data || !response.data.products) {
      console.error('Invalid response structure:', response);
      return [];
    }

    return response.data.products.edges.map(({ node }) => transformAdminProduct(node));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Récupérer un produit par son handle via l'API Admin
 */
export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  // D'abord, récupérer l'ID du produit par son handle
  const searchQuery = `
    query searchProduct($query: String!) {
      products(first: 1, query: $query) {
        edges {
          node {
            id
            handle
            title
            description
            productType
            tags
            vendor
            createdAt
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price
                  compareAtPrice
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            metafields(first: 20) {
              edges {
                node {
                  namespace
                  key
                  value
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyAdminFetch<{
      products: { edges: Array<{ node: any }> };
    }>({
      query: searchQuery,
      variables: { query: `handle:${handle}` },
    });

    if (!response || !response.data || !response.data.products || !response.data.products.edges.length) {
      return null;
    }

    return transformAdminProduct(response.data.products.edges[0].node);
  } catch (error) {
    console.error('Error fetching product by handle:', error);
    return null;
  }
}

/**
 * Récupérer toutes les collections via l'API Admin
 */
export async function getAllCollections(): Promise<ShopifyCollection[]> {
  const query = `
    query getAllCollections($first: Int = 100) {
      collections(first: $first) {
        edges {
          node {
            id
            handle
            title
            description
            image {
              url
              altText
            }
            products(first: 250) {
              edges {
                node {
                  id
                  handle
                  title
                  description
                  productType
                  tags
                  vendor
                  priceRangeV2 {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  compareAtPriceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyAdminFetch<{
      collections: { edges: Array<{ node: any }> };
    }>({ query });

    if (!response || !response.data || !response.data.collections) {
      console.error('Invalid collections response:', response);
      return [];
    }

    return response.data.collections.edges.map(({ node }) => ({
      id: node.id,
      handle: node.handle,
      title: node.title,
      description: node.description,
      image: node.image,
      products: {
        edges: node.products.edges.map((edge: any) => ({
          node: transformAdminProduct(edge.node)
        }))
      }
    }));
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

/**
 * Transformer un produit de l'API Admin vers le format attendu
 */
function transformAdminProduct(adminProduct: any): ShopifyProduct {
  return {
    id: adminProduct.id,
    handle: adminProduct.handle,
    title: adminProduct.title,
    description: adminProduct.description,
    productType: adminProduct.productType,
    tags: adminProduct.tags || [],
    vendor: adminProduct.vendor,
    createdAt: adminProduct.createdAt,
    priceRange: {
      minVariantPrice: adminProduct.priceRangeV2?.minVariantPrice || {
        amount: adminProduct.variants?.edges?.[0]?.node?.price || '0',
        currencyCode: 'EUR'
      },
      maxVariantPrice: adminProduct.priceRangeV2?.maxVariantPrice || {
        amount: adminProduct.variants?.edges?.[0]?.node?.price || '0',
        currencyCode: 'EUR'
      }
    },
    compareAtPriceRange: adminProduct.variants?.edges?.[0]?.node?.compareAtPrice
      ? {
          minVariantPrice: { amount: adminProduct.variants.edges[0].node.compareAtPrice, currencyCode: 'EUR' },
          maxVariantPrice: { amount: adminProduct.variants.edges[0].node.compareAtPrice, currencyCode: 'EUR' }
        }
      : undefined,
    images: adminProduct.images || { edges: [] },
    variants: {
      edges: (adminProduct.variants?.edges || []).map((edge: any) => ({
        node: {
          id: edge.node.id,
          title: edge.node.title,
          availableForSale: edge.node.availableForSale !== false,
          priceV2: {
            amount: edge.node.price,
            currencyCode: 'EUR'
          },
          compareAtPriceV2: edge.node.compareAtPrice
            ? { amount: edge.node.compareAtPrice, currencyCode: 'EUR' }
            : undefined,
          selectedOptions: edge.node.selectedOptions || []
        }
      }))
    },
    availableForSale: adminProduct.status === 'ACTIVE'
  };
}

/**
 * Transformer un produit Shopify en format local
 */
export function transformShopifyProduct(shopifyProduct: ShopifyProduct): any {
  const images = shopifyProduct.images.edges.map(({ node }) => ({
    src: node.url,
    alt: node.altText || shopifyProduct.title,
  }));

  const variants: any = shopifyProduct.variants.edges.reduce((acc: any, { node: variant }) => {
    const size = variant.selectedOptions.find(opt => opt.name === 'Taille');
    const color = variant.selectedOptions.find(opt => opt.name === 'Couleur');

    if (!acc.sizes && size) {
      acc.sizes = [];
    }
    if (!acc.colors && color) {
      acc.colors = [];
    }

    if (size && !acc.sizes.find((s: any) => s.value === size.value)) {
      acc.sizes.push({
        value: size.value.toLowerCase().replace(/\s+/g, '-'),
        label: size.value,
        available: variant.availableForSale,
      });
    }

    if (color && !acc.colors.find((c: any) => c.value === color.value)) {
      acc.colors.push({
        value: color.value.toLowerCase().replace(/\s+/g, '-'),
        label: color.value,
        available: variant.availableForSale,
      });
    }

    return acc;
  }, { sizes: [], colors: [] });

  const metafields = {} as Record<string, string>;

  return {
    id: shopifyProduct.id,
    handle: shopifyProduct.handle,
    name: shopifyProduct.title,
    price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
    originalPrice: shopifyProduct.compareAtPriceRange?.minVariantPrice
      ? parseFloat(shopifyProduct.compareAtPriceRange.minVariantPrice.amount)
      : undefined,
    description: shopifyProduct.description,
    images,
    category: shopifyProduct.productType || '',
    categorySlug: (shopifyProduct.productType || '').toLowerCase().replace(/\s+/g, '-'),
    tags: shopifyProduct.tags,
    vendor: shopifyProduct.vendor,
    isNew: shopifyProduct.tags.includes('Nouveau'),
    variants: Object.keys(variants).length > 0 ? variants : undefined,
    details: Object.keys(metafields).length > 0 ? metafields : undefined,
    shopifyId: shopifyProduct.id,
    variantId: shopifyProduct.variants.edges[0]?.node.id,
  };
}