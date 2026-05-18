# Documentation complète : Récupération des données Parfums via l'API Shopify

## Vue d'ensemble

Ce document détaille le processus complet de récupération des données des parfums depuis l'API Shopify Storefront dans ce projet Next.js.

## Architecture générale

```
Frontend (Page Parfums) → API Route Next.js → Shopify Storefront GraphQL API → Boutique Shopify
```

---

## 1. Configuration et variables d'environnement

### Variables d'environnement requises
```env
NEXT_PUBLIC_SHOPIFY_DOMAIN=aehp3j-xw.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token_here
```

### Configuration API
- **Domaine Shopify :** `aehp3j-xw.myshopify.com`
- **Version API :** `2024-01`
- **Endpoint GraphQL :** `https://aehp3j-xw.myshopify.com/api/2024-01/graphql.json`

---

## 2. Fichiers concernés

### 2.1 Page principale des parfums
**Fichier :** `app/parfums/page.tsx`
- **Rôle :** Interface utilisateur et logique de récupération des données
- **Lignes clés :**
  - `14-67` : Fonction `fetchShopifyProducts()`
  - `103-110` : Hook `useEffect` pour charger les données
  - `113-117` : Filtrage des produits
  - `120-133` : Tri des produits

### 2.2 API Route intermédiaire
**Fichier :** `app/api/shopify-storefront/route.ts`
- **Rôle :** Proxy sécurisé vers l'API Shopify
- **Lignes clés :**
  - `3-6` : Configuration de l'endpoint Shopify
  - `8-46` : Handler POST pour les requêtes GraphQL

### 2.3 Composant d'affichage des produits
**Fichier :** `components/ProductCard.tsx`
- **Rôle :** Rendu individuel de chaque produit parfum
- **Lignes clés :**
  - `13-23` : Interface TypeScript `Product`
  - `40-53` : Génération des URLs de produits
  - `68-186` : Template de rendu du produit

---

## 3. Flux de données détaillé

### 3.1 Initialisation (Frontend)

**Code source :** `app/parfums/page.tsx:103-110`
```typescript
useEffect(() => {
  const loadProducts = async () => {
    const shopifyProducts = await fetchShopifyProducts();
    setParfumsProducts(shopifyProducts);
    setIsLoading(false);
  };
  loadProducts();
}, []);
```

**Processus :**
1. Le composant se monte
2. `useEffect` déclenche `loadProducts()`
3. `setIsLoading(true)` affiche le loader
4. Appel à `fetchShopifyProducts()`

### 3.2 Requête vers l'API interne (Frontend → API Route)

**Code source :** `app/parfums/page.tsx:14-45`
```typescript
async function fetchShopifyProducts() {
  try {
    const response = await fetch('/api/shopify-storefront', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
          collectionByHandle(handle: "parfums") {
            products(first: 50) {
              edges {
                node {
                  id
                  title
                  handle
                  priceRange {
                    minVariantPrice { amount currencyCode }
                  }
                  images(first: 1) {
                    edges {
                      node { url altText }
                    }
                  }
                  compareAtPriceRange {
                    minVariantPrice { amount currencyCode }
                  }
                }
              }
            }
          }
        }`
      })
    });
  } catch (error) {
    console.error('Erreur Shopify:', error);
  }
}
```

### 3.3 Traitement par l'API Route (API Route → Shopify)

**Code source :** `app/api/shopify-storefront/route.ts:8-46`
```typescript
export async function POST(request: NextRequest) {
  try {
    const { query, variables } = await request.json();

    if (!storefrontAccessToken) {
      return NextResponse.json(
        { error: 'Storefront Access Token not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(storefrontEndpoint, {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Shopify Storefront route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Processus :**
1. Récupération de la requête GraphQL
2. Validation du token d'accès
3. Ajout des headers d'authentification Shopify
4. Forwarding vers l'API Shopify Storefront
5. Retour de la réponse au frontend

### 3.4 Transformation des données (Frontend)

**Code source :** `app/parfums/page.tsx:47-66`
```typescript
if (data?.data?.collectionByHandle?.products?.edges) {
  return data.data.collectionByHandle.products.edges.map(({ node }: any) => ({
    id: node.id,
    name: node.title,
    handle: node.handle,
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    originalPrice: node.compareAtPriceRange?.minVariantPrice?.amount 
      ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
      : undefined,
    image: node.images.edges[0]?.node?.url,
    category: "Parfums",
    rating: 4.5 + Math.random() * 0.5,
    isNew: Math.random() > 0.7
  }));
}
```

**Transformation :**
- `node.title` → `name`
- `node.priceRange.minVariantPrice.amount` → `price` (number)
- `node.compareAtPriceRange` → `originalPrice` (optionnel)
- `node.images.edges[0].node.url` → `image`
- Ajout de propriétés calculées : `rating`, `isNew`

---

## 4. Requête GraphQL détaillée

### Structure de la requête
```graphql
{
  collectionByHandle(handle: "parfums") {
    products(first: 50) {
      edges {
        node {
          id                    # Identifiant unique Shopify
          title                # Nom du produit
          handle               # Slug URL (ex: "parfum-rose-damas")
          priceRange {         # Prix actuel
            minVariantPrice { 
              amount           # Montant (string)
              currencyCode     # Devise (ex: "EUR")
            }
          }
          images(first: 1) {   # Première image du produit
            edges {
              node { 
                url            # URL de l'image
                altText        # Texte alternatif
              }
            }
          }
          compareAtPriceRange { # Prix de comparaison (prix barré)
            minVariantPrice { 
              amount 
              currencyCode 
            }
          }
        }
      }
    }
  }
}
```

### Paramètres de la requête
- **`handle: "parfums"`** : Récupère la collection "parfums"
- **`first: 50`** : Limite à 50 produits maximum
- **`images(first: 1)`** : Récupère seulement la première image

---

## 5. Gestion des états et du rendu

### 5.1 États React

**Code source :** `app/parfums/page.tsx:99-100`
```typescript
const [parfumsProducts, setParfumsProducts] = useState<any[]>([]);
const [isLoading, setIsLoading] = useState(true);
```

### 5.2 Filtrage des produits

**Code source :** `app/parfums/page.tsx:113-117`
```typescript
const filteredProducts = parfumsProducts.filter(product => {
  const categoryMatch = selectedCategory === "Toutes" || product.category === selectedCategory;
  const priceMatch = product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max;
  return categoryMatch && priceMatch;
});
```

### 5.3 Tri des produits

**Code source :** `app/parfums/page.tsx:120-133`
```typescript
const sortedProducts = [...filteredProducts].sort((a, b) => {
  switch (sortBy) {
    case "price-asc": return a.price - b.price;
    case "price-desc": return b.price - a.price;
    case "newest": return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    case "rating": return b.rating - a.rating;
    default: return 0;
  }
});
```

### 5.4 Rendu conditionnel

**Code source :** `app/parfums/page.tsx:325-349`
```typescript
{isLoading ? (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
      <p className="text-gray-600">Chargement des parfums...</p>
    </div>
  </div>
) : sortedProducts.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {sortedProducts.map((product, index) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
) : (
  <div className="text-center py-20">
    <p className="text-gray-500 text-lg">Aucun produit ne correspond à vos critères</p>
  </div>
)}
```

---

## 6. Interface TypeScript

### 6.1 Interface Product

**Code source :** `components/ProductCard.tsx:13-23`
```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  rating: number;
  handle?: string;
}
```

### 6.2 Génération des URLs produits

**Code source :** `components/ProductCard.tsx:40-53`
```typescript
const getCategoryPath = (category: string) => {
  const categoryPaths: { [key: string]: string } = {
    'Tissus': 'tissus',
    'Parfums': 'parfums',
    'Chaussures': 'chaussures',
    'Maroquinerie': 'maroquinerie',
    'Jellabas Femme': 'jellabas/femme',
    'Jellabas Homme': 'jellabas/homme',
  };
  return categoryPaths[category] || 'product';
};

const productUrl = `/${getCategoryPath(product.category)}/${product.handle || product.name.toLowerCase().replace(/\s+/g, '-')}`;
```

---

## 7. Gestion d'erreurs

### 7.1 Erreurs côté Frontend
```typescript
catch (error) {
  console.error('Erreur Shopify:', error);
}
return []; // Retourne un tableau vide en cas d'erreur
```

### 7.2 Erreurs côté API Route
```typescript
if (!response.ok) {
  console.error('Shopify Storefront API Error:', data);
  return NextResponse.json(
    { error: data.errors?.[0]?.message || 'API Error' },
    { status: response.status }
  );
}
```

---

## 8. Optimisations et bonnes pratiques

### 8.1 Performance
- **Chargement asynchrone** : Les produits se chargent après le rendu initial
- **Images lazy loading** : `loading="lazy"` sur les images produits
- **Limite de produits** : Maximum 50 produits par requête

### 8.2 Sécurité
- **Token côté serveur** : Le token Shopify reste sur l'API Route
- **Validation des données** : Vérification de la structure des données reçues
- **Gestion d'erreurs** : Messages d'erreur génériques côté client

### 8.3 UX
- **État de chargement** : Spinner pendant la récupération
- **Filtrage en temps réel** : Mise à jour immédiate de l'affichage
- **Messages utilisateur** : Feedback quand aucun produit ne correspond

---

## 9. Schéma de flux complet

```
1. Page Parfums se monte
   ↓
2. useEffect() déclenche loadProducts()
   ↓
3. fetchShopifyProducts() fait un POST vers /api/shopify-storefront
   ↓
4. API Route ajoute les headers d'auth et forward vers Shopify
   ↓
5. Shopify retourne les données de la collection "parfums"
   ↓
6. API Route renvoie les données au frontend
   ↓
7. Frontend transforme les données au format interne
   ↓
8. État parfumsProducts mis à jour
   ↓
9. Re-render avec les produits affichés via ProductCard
   ↓
10. Utilisateur peut filtrer/trier les produits
```

---

## 10. Points d'attention

### 10.1 Dépendances
- Collection "parfums" doit exister dans Shopify
- Token Storefront Access valide requis
- Produits doivent avoir au moins une image

### 10.2 Limitations
- Maximum 50 produits par requête
- Propriétés `rating` et `isNew` générées aléatoirement
- Pas de pagination implémentée

### 10.3 Améliorations possibles
- Cache des données côté client
- Pagination pour plus de 50 produits
- Récupération des vraies notes/avis depuis Shopify
- Gestion des variantes de produits