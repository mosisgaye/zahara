import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://zaharashop.net'),
  title: {
    default: 'ZaharaShop - Artisanat Marocain de Luxe | Jellabas, Babouches, Maroquinerie',
    template: '%s | ZaharaShop - Boutique Marocaine de Luxe'
  },
  description: 'Découvrez l\'excellence de l\'artisanat marocain chez ZaharaShop. Jellabas brodées, babouches en cuir, maroquinerie de luxe, parfums orientaux et huiles précieuses. Livraison gratuite dès 75€.',
  keywords: [
    'artisanat marocain',
    'jellaba femme',
    'jellaba homme',
    'babouche marocaine',
    'babouche cuir',
    'maroquinerie maroc',
    'sac cuir marocain',
    'parfum oriental',
    'oud maroc',
    'huile argan bio',
    'huile de cactus',
    'tissus marocains',
    'brocart marocain',
    'caftan marocain',
    'boutique marocaine',
    'luxe marocain',
    'casablanca shopping',
    'artisan marocain',
    'tradition marocaine',
    'mode marocaine',
    'décoration marocaine',
    'cadeau maroc',
    'souvenir maroc'
  ],
  authors: [
    { name: 'ZaharaShop', url: 'https://zaharashop.net' }
  ],
  creator: 'ZaharaShop',
  publisher: 'ZaharaShop',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/apple-touch-icon-76x76.png', sizes: '76x76' },
      { url: '/apple-touch-icon-120x120.png', sizes: '120x120' },
      { url: '/apple-touch-icon-152x152.png', sizes: '152x152' },
      { url: '/apple-touch-icon-180x180.png', sizes: '180x180' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#DAA520',
      },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://zaharashop.net',
    languages: {
      'fr-FR': 'https://zaharashop.net',
      'fr-MA': 'https://zaharashop.net/fr-ma',
      'en-US': 'https://zaharashop.net/en',
      'ar-MA': 'https://zaharashop.net/ar',
    },
    types: {
      'application/rss+xml': 'https://zaharashop.net/feed.xml',
    },
  },
  openGraph: {
    title: 'ZaharaShop - Artisanat Marocain de Luxe',
    description: 'Boutique en ligne d\'artisanat marocain authentique. Jellabas, babouches, maroquinerie, parfums et huiles précieuses. Tradition et élégance depuis 1960.',
    url: 'https://zaharashop.net',
    siteName: 'ZaharaShop',
    images: [
      {
        url: 'https://zaharashop.net/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ZaharaShop - Artisanat Marocain de Luxe',
      },
      {
        url: 'https://zaharashop.net/images/og-image-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'ZaharaShop - Boutique Marocaine',
      },
    ],
    locale: 'fr_FR',
    alternateLocale: ['fr_MA', 'en_US', 'ar_MA'],
    type: 'website',
    countryName: 'Maroc',
    emails: ['contact@zaharashop.net'],
    phoneNumbers: ['+221784443806'],
    faxNumbers: ['+221784443807'],
    siteName: 'ZaharaShop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZaharaShop - Artisanat Marocain de Luxe',
    description: 'Découvrez l\'authenticité de l\'artisanat marocain. Jellabas, babouches, maroquinerie et plus. Livraison mondiale.',
    creator: '@zaharashop',
    site: '@zaharashop',
    images: ['https://zaharashop.net/images/twitter-card.jpg'],
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
    bing: 'YOUR_BING_VERIFICATION_CODE',
  },
  category: 'shopping',
  classification: 'Artisanat, Mode, Luxe',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light',
  other: {
    'msapplication-TileColor': '#DAA520',
    'msapplication-config': '/browserconfig.xml',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'ZaharaShop',
    'application-name': 'ZaharaShop',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'X-UA-Compatible': 'IE=edge',
    // Rich Snippets
    'og:price:amount': '75',
    'og:price:currency': 'EUR',
    'og:availability': 'instock',
    'product:brand': 'ZaharaShop',
    'product:condition': 'new',
    'product:retailer': 'ZaharaShop',
    'product:category': 'Artisanat Marocain',
    // Géolocalisation
    'geo.region': 'MA-CAS',
    'geo.placename': 'Casablanca',
    'geo.position': '33.5731;-7.5898',
    'ICBM': '33.5731, -7.5898',
    // Réseaux sociaux
    'fb:app_id': 'YOUR_FACEBOOK_APP_ID',
    'fb:admins': 'YOUR_FACEBOOK_ADMIN_ID',
    'pinterest-rich-pin': 'true',
    'pinterest:media': 'https://zaharashop.net/images/pinterest-image.jpg',
    'pinterest:description': 'Artisanat Marocain de Luxe - ZaharaShop',
    // Performance
    'dns-prefetch': 'https://fonts.googleapis.com',
    'preconnect': 'https://fonts.gstatic.com',
    'prefetch': 'https://www.google-analytics.com',
    // Sécurité
    'Content-Security-Policy': "default-src 'self'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
};