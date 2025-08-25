import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noindex?: boolean;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  price?: {
    amount: string;
    currency: string;
  };
  availability?: 'in stock' | 'out of stock' | 'preorder';
  brand?: string;
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  productSchema?: any;
  organizationSchema?: any;
  websiteSchema?: any;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogImage = 'https://zaharashop.net/images/logo.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
  keywords,
  author = 'ZaharaShop',
  publishedTime,
  modifiedTime,
  category,
  price,
  availability,
  brand = 'ZaharaShop',
  breadcrumbs,
  productSchema,
  organizationSchema,
  websiteSchema
}) => {
  const siteName = 'ZaharaShop';
  const siteUrl = 'https://zaharashop.net';
  const fullTitle = `${title} | ${siteName}`;
  const canonicalUrl = canonical || `${siteUrl}${typeof window !== 'undefined' ? window.location.pathname : ''}`;

  // Schéma de données structurées par défaut pour l'organisation
  const defaultOrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ZaharaShop',
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    description: 'Maison de luxe marocaine spécialisée dans l\'artisanat traditionnel depuis 1960',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Boulevard Mohammed V',
      addressLocality: 'Casablanca',
      addressCountry: 'MA'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+221-78-444-38-06',
      contactType: 'customer service',
      availableLanguage: ['fr', 'ar', 'en']
    },
    sameAs: [
      'https://www.facebook.com/zaharashop',
      'https://www.instagram.com/zaharashop',
      'https://twitter.com/zaharashop'
    ],
    priceRange: '€€€',
    paymentAccepted: ['Cash', 'Credit Card', 'PayPal'],
    currenciesAccepted: 'EUR,MAD,USD',
    openingHours: 'Mo-Sa 09:00-20:00',
    foundingDate: '1960',
    founders: [{
      '@type': 'Person',
      name: 'Famille Zahara'
    }]
  };

  // Schéma de site web par défaut
  const defaultWebsiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: description,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/images/logo.png`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'fr-FR',
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      '@type': 'Organization',
      name: siteName
    }
  };

  // Schéma de fil d'Ariane
  const breadcrumbSchema = breadcrumbs && {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`
    }))
  };

  // Schéma de produit enrichi
  const enrichedProductSchema = productSchema && {
    ...productSchema,
    '@context': 'https://schema.org',
    '@type': 'Product',
    brand: {
      '@type': 'Brand',
      name: brand
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Artisans Marocains'
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: price?.currency || 'EUR',
      price: price?.amount,
      availability: `https://schema.org/${availability?.replace(' ', '') || 'InStock'}`,
      seller: {
        '@type': 'Organization',
        name: siteName
      },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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
    }
  };

  // Schéma FAQ pour les pages de catégories
  const faqSchema = category && {
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
      }
    ]
  };

  return (
    <>
      <Head>
        {/* Balises Meta de base */}
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="French" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content={author} />
        
        {keywords && <meta name="keywords" content={keywords} />}
        {noindex && <meta name="robots" content="noindex,nofollow" />}
        {!noindex && <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />}
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Hreflang pour le multilingue */}
        <link rel="alternate" hrefLang="fr-MA" href={`${siteUrl}/fr-ma${typeof window !== 'undefined' ? window.location.pathname : ''}`} />
        <link rel="alternate" hrefLang="fr-FR" href={`${siteUrl}/fr${typeof window !== 'undefined' ? window.location.pathname : ''}`} />
        <link rel="alternate" hrefLang="en" href={`${siteUrl}/en${typeof window !== 'undefined' ? window.location.pathname : ''}`} />
        <link rel="alternate" hrefLang="ar" href={`${siteUrl}/ar${typeof window !== 'undefined' ? window.location.pathname : ''}`} />
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={title} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:locale:alternate" content="fr_MA" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="ar_MA" />
        
        {publishedTime && <meta property="article:published_time" content={publishedTime} />}
        {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
        {category && <meta property="article:section" content={category} />}
        
        {/* Métadonnées e-commerce pour Open Graph */}
        {price && (
          <>
            <meta property="product:price:amount" content={price.amount} />
            <meta property="product:price:currency" content={price.currency} />
          </>
        )}
        {availability && <meta property="product:availability" content={availability} />}
        {brand && <meta property="product:brand" content={brand} />}
        {category && <meta property="product:category" content={category} />}

        {/* Twitter Card */}
        <meta property="twitter:card" content={twitterCard} />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={ogImage} />
        <meta property="twitter:image:alt" content={title} />
        <meta property="twitter:site" content="@zaharashop" />
        <meta property="twitter:creator" content="@zaharashop" />
        
        {/* Pinterest */}
        <meta property="pinterest:media" content={ogImage} />
        <meta property="pinterest:description" content={description} />

        {/* Métadonnées supplémentaires */}
        <meta name="geo.region" content="MA" />
        <meta name="geo.placename" content="Casablanca" />
        <meta name="geo.position" content="33.5731;-7.5898" />
        <meta name="ICBM" content="33.5731, -7.5898" />
        
        {/* Sécurité et performance */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={siteName} />
        
        {/* Vérification des moteurs de recherche */}
        <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
        <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" />
        <meta name="yandex-verification" content="YOUR_YANDEX_VERIFICATION_CODE" />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#DAA520" />
        <meta name="msapplication-TileColor" content="#DAA520" />
        <meta name="theme-color" content="#ffffff" />

        {/* Préconnexion pour améliorer les performances */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Scripts de données structurées */}
        {organizationSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema || defaultOrganizationSchema) }}
          />
        )}
        
        {websiteSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema || defaultWebsiteSchema) }}
          />
        )}
        
        {breadcrumbSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />
        )}
        
        {enrichedProductSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(enrichedProductSchema) }}
          />
        )}
        
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
        
        {/* Schema.org LocalBusiness pour le SEO local */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'ZaharaShop Casablanca',
              image: `${siteUrl}/images/logo.png`,
              url: siteUrl,
              telephone: '+221784443806',
              priceRange: '€€€',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Boulevard Mohammed V',
                addressLocality: 'Casablanca',
                postalCode: '20000',
                addressCountry: 'MA'
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 33.5731,
                longitude: -7.5898
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                  opens: '09:00',
                  closes: '20:00'
                }
              ]
            })
          }}
        />
      </Head>
    </>
  );
};

export default SEO;