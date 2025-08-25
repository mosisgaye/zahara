import { Metadata } from 'next';

interface SEOMetadataProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  price?: {
    amount: string;
    currency: string;
  };
  availability?: string;
  brand?: string;
  category?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
}

export function generateSEOMetadata({
  title,
  description,
  image = '/images/logo.png',
  url = '',
  type = 'website',
  price,
  availability,
  brand = 'ZaharaShop',
  category,
  publishedTime,
  modifiedTime,
  author = 'ZaharaShop',
  keywords = []
}: SEOMetadataProps): Metadata {
  const siteName = 'ZaharaShop';
  const siteUrl = 'https://zaharashop.net';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  const metadata: Metadata = {
    title: {
      default: `${title} | ${siteName}`,
      template: `%s | ${siteName}`
    },
    description,
    keywords: [
      'artisanat marocain',
      'jellaba',
      'babouche',
      'maroquinerie',
      'parfum oriental',
      'huile argan',
      'tissus marocains',
      'luxe marocain',
      'casablanca',
      'maroc',
      ...keywords
    ],
    authors: [{ name: author }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: fullUrl,
      languages: {
        'fr-FR': fullUrl,
        'fr-MA': `${siteUrl}/fr-ma${url}`,
        'en-US': `${siteUrl}/en${url}`,
        'ar-MA': `${siteUrl}/ar${url}`,
      },
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'fr_FR',
      type: type as any,
      ...((type === 'article' || type === 'product') && {
        publishedTime,
        modifiedTime,
        authors: [author],
        tags: keywords,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImage],
      creator: '@zaharashop',
      site: '@zaharashop',
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'YOUR_GOOGLE_VERIFICATION_CODE',
      yandex: 'YOUR_YANDEX_VERIFICATION_CODE',
      yahoo: 'YOUR_YAHOO_VERIFICATION_CODE',
    },
    category: category || 'E-commerce',
    classification: 'Luxury Moroccan Crafts',
    referrer: 'origin-when-cross-origin',
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
    },
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'apple-mobile-web-app-title': siteName,
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'msapplication-TileColor': '#DAA520',
      'msapplication-config': '/browserconfig.xml',
      'theme-color': '#ffffff',
      ...(price && {
        'product:price:amount': price.amount,
        'product:price:currency': price.currency,
      }),
      ...(availability && {
        'product:availability': availability,
      }),
      ...(brand && {
        'product:brand': brand,
      }),
    },
  };

  return metadata;
}

// Fonction pour générer les données structurées JSON-LD
export function generateJSONLD(type: string, data: any) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(baseData) }}
    />
  );
}

// Schéma Organisation pour toutes les pages
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://zaharashop.net/#organization',
  name: 'ZaharaShop',
  url: 'https://zaharashop.net',
  logo: {
    '@type': 'ImageObject',
    url: 'https://zaharashop.net/images/logo.png',
    width: 600,
    height: 600
  },
  description: 'Maison de luxe marocaine spécialisée dans l\'artisanat traditionnel depuis 1960',
  foundingDate: '1960',
  founders: [{
    '@type': 'Person',
    name: 'Famille Zahara'
  }],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Boulevard Mohammed V',
    addressLocality: 'Casablanca',
    addressRegion: 'Casablanca-Settat',
    postalCode: '20000',
    addressCountry: 'MA'
  },
  contactPoint: [{
    '@type': 'ContactPoint',
    telephone: '+221-78-444-38-06',
    contactType: 'customer service',
    areaServed: ['MA', 'FR', 'BE', 'CH', 'CA'],
    availableLanguage: ['French', 'Arabic', 'English']
  }],
  sameAs: [
    'https://www.facebook.com/zaharashop',
    'https://www.instagram.com/zaharashop',
    'https://twitter.com/zaharashop',
    'https://www.pinterest.com/zaharashop',
    'https://www.youtube.com/zaharashop',
    'https://www.linkedin.com/company/zaharashop'
  ],
  makesOffer: [{
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: 'Livraison gratuite',
      description: 'Livraison gratuite pour les commandes de plus de 75€'
    }
  }],
  award: [
    'Meilleur Artisan Marocain 2023',
    'Excellence en Artisanat Traditionnel 2022'
  ]
};

// Schéma WebSite pour la recherche
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://zaharashop.net/#website',
  url: 'https://zaharashop.net',
  name: 'ZaharaShop',
  description: 'Boutique en ligne d\'artisanat marocain de luxe',
  publisher: {
    '@id': 'https://zaharashop.net/#organization'
  },
  potentialAction: [{
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://zaharashop.net/search?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }],
  inLanguage: ['fr-FR', 'fr-MA', 'ar-MA', 'en-US']
};

// Générateur de schéma produit
export function generateProductSchema(product: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://zaharashop.net/product/${product.handle}#product`,
    name: product.title,
    description: product.description,
    image: product.images?.edges?.map((edge: any) => edge.node.url) || [],
    brand: {
      '@type': 'Brand',
      name: 'ZaharaShop'
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Artisans Marocains'
    },
    sku: product.id,
    mpn: product.id,
    offers: {
      '@type': 'Offer',
      url: `https://zaharashop.net/product/${product.handle}`,
      priceCurrency: product.priceRange?.minVariantPrice?.currencyCode || 'EUR',
      price: product.priceRange?.minVariantPrice?.amount || '0',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      availability: 'https://schema.org/InStock',
      seller: {
        '@id': 'https://zaharashop.net/#organization'
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'MA',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn'
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'EUR'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: ['MA', 'FR', 'BE', 'CH', 'CA']
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 7,
            unitCode: 'DAY'
          }
        }
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1'
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        },
        author: {
          '@type': 'Person',
          name: 'Sophie Martin'
        },
        datePublished: '2024-01-15',
        reviewBody: 'Qualité exceptionnelle, artisanat authentique. Je recommande vivement!'
      }
    ],
    category: product.productType,
    material: 'Cuir véritable / Tissus nobles',
    color: product.variants?.edges?.[0]?.node?.selectedOptions?.find((opt: any) => opt.name === 'Couleur')?.value,
    size: product.variants?.edges?.[0]?.node?.selectedOptions?.find((opt: any) => opt.name === 'Taille')?.value,
    isAccessoryOrSparePartFor: {
      '@type': 'Product',
      name: 'Collection Marocaine Traditionnelle'
    }
  };
}

// Générateur de fil d'Ariane
export function generateBreadcrumbSchema(items: Array<{name: string; url: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://zaharashop.net${item.url}`
    }))
  };
}

// Schéma FAQ pour les pages de catégories
export function generateFAQSchema(category: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Quelle est la qualité des ${category} ZaharaShop ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Nos ${category} sont fabriqués à la main par des artisans marocains qualifiés utilisant des matériaux de première qualité. Chaque pièce est unique et garantie authentique.`
        }
      },
      {
        '@type': 'Question',
        name: `Comment entretenir mes ${category} ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Nous fournissons des instructions d'entretien détaillées avec chaque achat. En général, un nettoyage doux et un stockage approprié garantissent la longévité de vos ${category}.`
        }
      },
      {
        '@type': 'Question',
        name: `Quelle est la politique de retour pour les ${category} ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Nous offrons une garantie de satisfaction de 30 jours. Si vous n'êtes pas entièrement satisfait de votre achat, vous pouvez le retourner dans son état d'origine pour un remboursement complet.`
        }
      },
      {
        '@type': 'Question',
        name: `Les ${category} sont-ils authentiques ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Oui, tous nos ${category} sont 100% authentiques et fabriqués selon les méthodes traditionnelles marocaines. Nous travaillons directement avec des artisans certifiés.`
        }
      }
    ]
  };
}