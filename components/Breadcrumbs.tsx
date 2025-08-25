'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbSchema } from './SEOMetadata';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  separator?: React.ReactNode;
}

export default function Breadcrumbs({
  items,
  className = '',
  showHome = true,
  separator = <ChevronRight className="w-4 h-4 text-gray-400" />
}: BreadcrumbsProps) {
  // Ajouter la page d'accueil au début si demandé
  const breadcrumbItems = showHome
    ? [{ name: 'Accueil', url: '/' }, ...items]
    : items;

  // Générer le schéma JSON-LD pour les breadcrumbs
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      {/* Schéma JSON-LD pour le SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Navigation breadcrumb */}
      <nav
        aria-label="Fil d'Ariane"
        className={`flex items-center space-x-2 text-sm ${className}`}
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <div
              key={item.url}
              className="flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && <span className="mx-2">{separator}</span>}
              
              {isLast ? (
                <span
                  className="text-gray-900 font-medium"
                  itemProp="name"
                  aria-current="page"
                >
                  {item.name === 'Accueil' ? (
                    <Home className="w-4 h-4" />
                  ) : (
                    item.name
                  )}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="text-gray-600 hover:text-gold transition-colors duration-200 flex items-center"
                  itemProp="item"
                >
                  <span itemProp="name">
                    {item.name === 'Accueil' ? (
                      <Home className="w-4 h-4" />
                    ) : (
                      item.name
                    )}
                  </span>
                </Link>
              )}
              
              <meta itemProp="position" content={String(index + 1)} />
              {!isLast && <meta itemProp="url" content={`https://zaharashop.net${item.url}`} />}
            </div>
          );
        })}
      </nav>
    </>
  );
}

// Composant de fil d'Ariane mobile responsive
export function MobileBreadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const lastTwo = items.slice(-2);
  const breadcrumbItems = [{ name: 'Accueil', url: '/' }, ...lastTwo];
  
  return (
    <nav
      aria-label="Fil d'Ariane mobile"
      className={`flex items-center space-x-1 text-xs sm:text-sm overflow-x-auto ${className}`}
    >
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        
        return (
          <div key={item.url} className="flex items-center flex-shrink-0">
            {index > 0 && (
              <ChevronRight className="w-3 h-3 text-gray-400 mx-1" />
            )}
            
            {isLast ? (
              <span className="text-gray-900 font-medium truncate max-w-[150px]">
                {item.name === 'Accueil' ? (
                  <Home className="w-3 h-3" />
                ) : (
                  item.name
                )}
              </span>
            ) : (
              <Link
                href={item.url}
                className="text-gray-600 hover:text-gold transition-colors truncate max-w-[100px]"
              >
                {item.name === 'Accueil' ? (
                  <Home className="w-3 h-3" />
                ) : (
                  item.name
                )}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}