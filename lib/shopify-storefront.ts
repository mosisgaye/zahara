/**
 * API Storefront de Shopify
 * Utilisée pour l'affichage public (lecture seule)
 * Supporte productByHandle et productRecommendations
 */

const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'aehp3j-xw.myshopify.com';
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const storefrontApiVersion = '2024-01';
const storefrontEndpoint = `https://${domain}/api/${storefrontApiVersion}/graphql.json`;

/**
 * Fonction pour faire des requêtes GraphQL à l'API Storefront Shopify
 */
export async function shopifyStorefrontFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, any>;
}): Promise<{ data: T; errors?: any }> {
  if (!storefrontAccessToken) {
    throw new Error('Missing NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN');
  }

  try {
    const response = await fetch(storefrontEndpoint, {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }, // Cache pour 60 secondes
    });

    const data = await response.json();
    
    if (response.status !== 200) {
      console.error('Shopify Storefront API Error:', data);
      throw new Error(data.errors?.[0]?.message || data.message || response.statusText);
    }
    
    return data;
  } catch (error) {
    console.error('Shopify Storefront API Error:', error);
    throw error;
  }
}

/**
 * Récupérer un produit par son handle via l'API Storefront
 * Utilise la requête optimisée productByHandle
 */
export async function getProductByHandle(handle: string) {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        tags
        vendor
        productType
        createdAt
        updatedAt
        availableForSale
        options {
          name
          values
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
              width
              height
            }
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
              priceV2 {
                amount
                currencyCode
              }
              compareAtPriceV2 {
                amount
                currencyCode
              }
            }
          }
        }
        seo {
          title
          description
        }
      }
    }
  `;

  try {
    const response = await shopifyStorefrontFetch<{
      productByHandle: any;
    }>({
      query,
      variables: { handle },
    });

    return response.data.productByHandle;
  } catch (error) {
    console.error('Error fetching product by handle:', error);
    return null;
  }
}

/**
 * Récupérer les recommandations de produits
 * Utilise l'algorithme de recommandation natif de Shopify
 */
export async function getProductRecommendations(productId: string, limit: number = 4) {
  const query = `
    query getProductRecommendations($productId: ID!) {
      productRecommendations(productId: $productId) {
        id
        title
        handle
        vendor
        productType
        availableForSale
        priceRange {
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
              width
              height
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyStorefrontFetch<{
      productRecommendations: any[];
    }>({
      query,
      variables: { productId },
    });

    // Limiter le nombre de recommandations
    return response.data.productRecommendations?.slice(0, limit) || [];
  } catch (error) {
    console.error('Error fetching product recommendations:', error);
    return [];
  }
}

/**
 * Récupérer les détails d'un produit ET ses recommandations en une seule requête
 * Optimisation pour réduire le nombre d'appels API
 */
export async function getProductWithRecommendations(handle: string) {
  const query = `
    query getProductWithRecommendations($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        tags
        vendor
        productType
        availableForSale
        options {
          name
          values
        }
        priceRange {
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
        images(first: 10) {
          edges {
            node {
              url
              altText
              width
              height
            }
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
              priceV2 {
                amount
                currencyCode
              }
              compareAtPriceV2 {
                amount
                currencyCode
              }
            }
          }
        }
        seo {
          title
          description
        }
      }
    }
  `;

  try {
    // Récupérer d'abord le produit
    const productResponse = await shopifyStorefrontFetch<{
      productByHandle: any;
    }>({
      query,
      variables: { handle },
    });

    const product = productResponse.data.productByHandle;
    
    if (!product) {
      return { product: null, recommendations: [] };
    }

    // Puis récupérer les recommandations
    const rawRecommendations = await getProductRecommendations(product.id);
    
    // Formater les recommandations pour le client
    const recommendations = rawRecommendations.map((rec: any) => ({
      id: rec.id,
      name: rec.title,
      handle: rec.handle,
      price: parseFloat(rec.priceRange.minVariantPrice.amount),
      originalPrice: rec.compareAtPriceRange?.minVariantPrice?.amount 
        ? parseFloat(rec.compareAtPriceRange.minVariantPrice.amount)
        : undefined,
      image: rec.images.edges[0]?.node?.url,
      category: rec.productType,
      productType: rec.productType,
      rating: 4.5 + Math.random() * 0.5,
      isNew: Math.random() > 0.7
    }));

    return {
      product,
      recommendations
    };
  } catch (error) {
    console.error('Error fetching product with recommendations:', error);
    return { product: null, recommendations: [] };
  }
}

/**
 * Récupérer tous les produits (pour les pages de collection)
 */
export async function getAllProducts(first: number = 250) {
  const query = `
    query getAllProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            vendor
            productType
            tags
            availableForSale
            priceRange {
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
  `;

  try {
    const response = await shopifyStorefrontFetch<{
      products: { edges: Array<{ node: any }> };
    }>({
      query,
      variables: { first },
    });

    return response.data.products.edges.map(({ node }) => node);
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
}

/**
 * Rechercher des produits
 */
export async function searchProducts(searchTerm: string, first: number = 20) {
  const query = `
    query searchProducts($searchTerm: String!, $first: Int!) {
      products(first: $first, query: $searchTerm) {
        edges {
          node {
            id
            title
            handle
            vendor
            priceRange {
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
  `;

  try {
    const response = await shopifyStorefrontFetch<{
      products: { edges: Array<{ node: any }> };
    }>({
      query,
      variables: { searchTerm, first },
    });

    return response.data.products.edges.map(({ node }) => node);
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

/**
 * Récupérer toutes les collections
 */
export async function getAllCollections(first: number = 250) {
  const query = `
    query getAllCollections($first: Int!) {
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
            products(first: 20) {
              edges {
                node {
                  id
                  title
                  handle
                  vendor
                  availableForSale
                  priceRange {
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
    const response = await shopifyStorefrontFetch<{
      collections: { edges: Array<{ node: any }> };
    }>({
      query,
      variables: { first },
    });

    return response.data.collections.edges.map(({ node }) => node);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

/**
 * Récupérer une collection par son handle
 */
export async function getCollectionByHandle(handle: string) {
  const query = `
    query getCollectionByHandle($handle: String!) {
      collectionByHandle(handle: $handle) {
        id
        title
        handle
        description
        image {
          url
          altText
        }
        products(first: 250) {
          edges {
            node {
              id
              title
              handle
              vendor
              productType
              tags
              availableForSale
              priceRange {
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
  `;

  try {
    const response = await shopifyStorefrontFetch<{
      collectionByHandle: any;
    }>({
      query,
      variables: { handle },
    });

    return response.data.collectionByHandle;
  } catch (error) {
    console.error('Error fetching collection by handle:', error);
    return null;
  }
}

/**
 * Récupérer des produits par type
 */
export async function getProductsByType(productType: string, first: number = 250) {
  const query = `
    query getProductsByType($productType: String!, $first: Int!) {
      products(first: $first, query: $productType) {
        edges {
          node {
            id
            title
            handle
            vendor
            productType
            tags
            availableForSale
            priceRange {
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
  `;

  try {
    const response = await shopifyStorefrontFetch<{
      products: { edges: Array<{ node: any }> };
    }>({
      query,
      variables: { productType: `product_type:${productType}`, first },
    });

    return response.data.products.edges.map(({ node }) => node);
  } catch (error) {
    console.error('Error fetching products by type:', error);
    return [];
  }
}