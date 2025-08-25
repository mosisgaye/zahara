'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrency } from '@/context/CurrencyContext';
import { debounce } from 'lodash';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { formatPrice } = useCurrency();

  // Fonction de recherche utilisant l'API Storefront
  const searchProducts = async (term: string) => {
    if (!term || term.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/shopify-storefront', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query searchProducts($searchTerm: String!) {
              products(first: 10, query: $searchTerm) {
                edges {
                  node {
                    id
                    title
                    handle
                    vendor
                    productType
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
          `,
          variables: { searchTerm: term }
        })
      });

      const data = await response.json();
      
      if (data?.data?.products?.edges) {
        const products = data.data.products.edges.map(({ node }: any) => ({
          id: node.id,
          title: node.title,
          handle: node.handle,
          vendor: node.vendor,
          productType: node.productType,
          price: parseFloat(node.priceRange.minVariantPrice.amount),
          image: node.images.edges[0]?.node?.url,
          imageAlt: node.images.edges[0]?.node?.altText || node.title
        }));
        setResults(products);
      }
    } catch (error) {
      console.error('Erreur de recherche:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce la recherche pour éviter trop de requêtes
  const debouncedSearch = useCallback(
    debounce((term: string) => searchProducts(term), 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Réinitialiser lors de la fermeture
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="sr-only">Rechercher des produits</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 h-12 text-lg"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        <div className="mt-4 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/${getCategoryPath(product.productType)}/${product.handle}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {product.image && (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.imageAlt}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{product.title}</h3>
                    {product.vendor && (
                      <p className="text-xs text-muted-foreground">{product.vendor}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : searchTerm.length >= 2 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucun produit trouvé pour "{searchTerm}"
              </p>
            </div>
          ) : searchTerm ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">
                Tapez au moins 2 caractères pour rechercher
              </p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}