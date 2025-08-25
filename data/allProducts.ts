// Base de données centralisée de tous les produits

export const allProducts: { [key: string]: any } = {
  // CHAUSSURES
  'babouche-royale-brodee-or': {
    id: 1001,
    name: "Babouche Royale Brodée Or",
    price: 34,
    originalPrice: 38,
    rating: 5,
    reviewCount: 42,
    description: "Babouche d'exception brodée avec des fils d'or véritable. Cuir de première qualité tanné selon les méthodes traditionnelles.",
    images: [
      { src: "/images/chaussures/1.jpeg", alt: "Vue principale" }
    ],
    category: "Babouches Luxe",
    categorySlug: "chaussures",
    isNew: true,
  },
  'sandale-marocaine-cuir-premium': {
    id: 1002,
    name: "Sandale Marocaine Cuir Premium",
    price: 30,
    originalPrice: 38,
    rating: 4.8,
    reviewCount: 38,
    description: "Sandale artisanale en cuir premium avec détails brodés. Confort et élégance pour toutes occasions.",
    images: [
      { src: "/images/chaussures/2.jpeg", alt: "Vue principale" }
    ],
    category: "Sandales Artisanales",
    categorySlug: "chaussures",
  },
  'babouche-traditionnelle-safran': {
    id: 1003,
    name: "Babouche Traditionnelle Safran",
    price: 31,
    rating: 4.5,
    reviewCount: 29,
    description: "Babouche traditionnelle teintée au safran naturel. Un classique intemporel de l'artisanat marocain.",
    images: [
      { src: "/images/chaussures/3.jpeg", alt: "Vue principale" }
    ],
    category: "Babouches Classiques",
    categorySlug: "chaussures",
  },
  'mule-cuir-brodee-argent': {
    id: 1004,
    name: "Mule en Cuir Brodée Argent",
    price: 32,
    originalPrice: 40,
    rating: 5,
    reviewCount: 33,
    description: "Mule luxueuse avec broderies argentées faites main. Alliant confort et sophistication.",
    images: [
      { src: "/images/chaussures/4.jpeg", alt: "Vue principale" }
    ],
    category: "Mules de Luxe",
    categorySlug: "chaussures",
    isNew: true,
  },
  'babouche-homme-cuir-noir': {
    id: 1005,
    name: "Babouche Homme Cuir Noir",
    price: 34,
    rating: 4.7,
    reviewCount: 25,
    description: "Babouche masculine en cuir noir mat. Élégance et confort pour l'homme moderne.",
    images: [
      { src: "/images/chaussures/5.jpeg", alt: "Vue principale" }
    ],
    category: "Collection Homme",
    categorySlug: "chaussures",
  },
  'sandale-berbere-artisanale': {
    id: 1006,
    name: "Sandale Berbère Artisanale",
    price: 33,
    originalPrice: 38,
    rating: 4.3,
    reviewCount: 21,
    description: "Sandale berbère authentique avec motifs traditionnels. Fabriquée selon les techniques ancestrales.",
    images: [
      { src: "/images/chaussures/6.jpeg", alt: "Vue principale" }
    ],
    category: "Sandales Traditionnelles",
    categorySlug: "chaussures",
  },
  'babouche-princesse-rose-gold': {
    id: 1007,
    name: "Babouche Princesse Rose Gold",
    price: 34,
    rating: 4.9,
    reviewCount: 37,
    description: "Babouche féminine délicate en rose gold. Parfaite pour les occasions spéciales.",
    images: [
      { src: "/images/chaussures/7.jpeg", alt: "Vue principale" }
    ],
    category: "Collection Femme",
    categorySlug: "chaussures",
  },
  'chaussure-marocaine-velours': {
    id: 1008,
    name: "Chaussure Marocaine Velours",
    price: 30,
    originalPrice: 36,
    rating: 5,
    reviewCount: 31,
    description: "Chaussure en velours premium avec ornements dorés. Le summum du luxe artisanal.",
    images: [
      { src: "/images/chaussures/8.jpeg", alt: "Vue principale" }
    ],
    category: "Chaussures Premium",
    categorySlug: "chaussures",
  },
  'babouche-confort-cuir-souple': {
    id: 1009,
    name: "Babouche Confort Cuir Souple",
    price: 31,
    rating: 4.6,
    reviewCount: 28,
    description: "Babouche ultra-confortable en cuir souple. Idéale pour un usage quotidien.",
    images: [
      { src: "/images/chaussures/9.jpeg", alt: "Vue principale" }
    ],
    category: "Babouches Confort",
    categorySlug: "chaussures",
  },
  'espadrille-marocaine-moderne': {
    id: 1010,
    name: "Espadrille Marocaine Moderne",
    price: 32,
    originalPrice: 37,
    rating: 4.4,
    reviewCount: 19,
    description: "Espadrille revisitée avec touches marocaines. Style moderne et décontracté.",
    images: [
      { src: "/images/chaussures/10.jpeg", alt: "Vue principale" }
    ],
    category: "Collection Moderne",
    categorySlug: "chaussures",
  },

  // MAROQUINERIE
  'sac-main-cuir-tresse-luxe': {
    id: 2001,
    name: "Sac à Main Cuir Tressé Luxe",
    price: 32,
    originalPrice: 40,
    rating: 5,
    reviewCount: 45,
    description: "Sac à main d'exception en cuir tressé à la main. Une pièce unique alliant tradition et modernité.",
    images: [
      { src: "/images/sac/1.jpeg", alt: "Vue principale" }
    ],
    category: "Sacs à Main",
    categorySlug: "maroquinerie",
    isNew: true,
  },
  'pochette-soiree-brodee-or': {
    id: 2002,
    name: "Pochette Soirée Brodée Or",
    price: 32,
    originalPrice: 40,
    rating: 4.9,
    reviewCount: 33,
    description: "Pochette de soirée élégante avec broderies dorées. L'accessoire parfait pour vos soirées.",
    images: [
      { src: "/images/sac/2.jpeg", alt: "Vue principale" }
    ],
    category: "Pochettes",
    categorySlug: "maroquinerie",
  },
  'sac-cabas-artisanal-premium': {
    id: 2003,
    name: "Sac Cabas Artisanal Premium",
    price: 30,
    rating: 4.7,
    reviewCount: 29,
    description: "Grand cabas en cuir premium. Spacieux et élégant pour le quotidien.",
    images: [
      { src: "/images/sac/3.jpeg", alt: "Vue principale" }
    ],
    category: "Cabas",
    categorySlug: "maroquinerie",
  },
  'besace-homme-cuir-noir': {
    id: 2004,
    name: "Besace Homme Cuir Noir",
    price: 30,
    originalPrice: 38,
    rating: 4.8,
    reviewCount: 27,
    description: "Besace masculine en cuir noir grainé. Style business et fonctionnalité.",
    images: [
      { src: "/images/sac/4.jpeg", alt: "Vue principale" }
    ],
    category: "Collection Homme",
    categorySlug: "maroquinerie",
  },
  'sac-bandouliere-femme-camel': {
    id: 2005,
    name: "Sac Bandoulière Femme Camel",
    price: 32,
    rating: 4.6,
    reviewCount: 24,
    description: "Sac bandoulière féminin en cuir camel. Pratique et tendance.",
    images: [
      { src: "/images/sac/5.jpeg", alt: "Vue principale" }
    ],
    category: "Bandoulières",
    categorySlug: "maroquinerie",
  },
  'portefeuille-luxe-brode-main': {
    id: 2006,
    name: "Portefeuille Luxe Brodé Main",
    price: 34,
    originalPrice: 37,
    rating: 4.5,
    reviewCount: 22,
    description: "Portefeuille en cuir avec broderies artisanales. Un accessoire raffiné.",
    images: [
      { src: "/images/sac/6.jpeg", alt: "Vue principale" }
    ],
    category: "Petite Maroquinerie",
    categorySlug: "maroquinerie",
  },
  'sac-seau-cuir-souple': {
    id: 2007,
    name: "Sac Seau Cuir Souple",
    price: 32,
    rating: 4.7,
    reviewCount: 26,
    description: "Sac seau en cuir souple avec fermeture cordon. Style bohème chic.",
    images: [
      { src: "/images/sac/11.jpeg", alt: "Vue principale" }
    ],
    category: "Sacs Seau",
    categorySlug: "maroquinerie",
    isNew: true,
  },
  'cartable-vintage-marron': {
    id: 2008,
    name: "Cartable Vintage Marron",
    price: 32,
    originalPrice: 38,
    rating: 5,
    reviewCount: 31,
    description: "Cartable vintage en cuir marron vieilli. Style rétro et qualité durable.",
    images: [
      { src: "/images/sac/22.jpeg", alt: "Vue principale" }
    ],
    category: "Cartables",
    categorySlug: "maroquinerie",
  },
  'pochette-ordinateur-cuir': {
    id: 2009,
    name: "Pochette Ordinateur Cuir",
    price: 33,
    rating: 4.6,
    reviewCount: 20,
    description: "Pochette pour ordinateur portable en cuir. Protection et élégance.",
    images: [
      { src: "/images/sac/33.jpeg", alt: "Vue principale" }
    ],
    category: "Business",
    categorySlug: "maroquinerie",
  },
  'sac-shopping-tresse-bicolore': {
    id: 2010,
    name: "Sac Shopping Tressé Bicolore",
    price: 31,
    originalPrice: 36,
    rating: 4.8,
    reviewCount: 28,
    description: "Grand sac shopping en cuir tressé bicolore. Spacieux et stylé.",
    images: [
      { src: "/images/sac/44.jpeg", alt: "Vue principale" }
    ],
    category: "Shopping",
    categorySlug: "maroquinerie",
  },
  'mini-sac-chaine-doree': {
    id: 2011,
    name: "Mini Sac Chaîne Dorée",
    price: 33,
    rating: 4.5,
    reviewCount: 23,
    description: "Mini sac avec chaîne dorée. Parfait pour les soirées élégantes.",
    images: [
      { src: "/images/sac/55.jpeg", alt: "Vue principale" }
    ],
    category: "Mini Sacs",
    categorySlug: "maroquinerie",
  },
  'sacoche-homme-cuir-vieilli': {
    id: 2012,
    name: "Sacoche Homme Cuir Vieilli",
    price: 32,
    originalPrice: 38,
    rating: 4.9,
    reviewCount: 30,
    description: "Sacoche masculine en cuir vieilli. Look vintage et qualité premium.",
    images: [
      { src: "/images/sac/66.jpeg", alt: "Vue principale" }
    ],
    category: "Collection Homme",
    categorySlug: "maroquinerie",
  },
  'sac-weekend-toile-cuir': {
    id: 2013,
    name: "Sac Weekend Toile et Cuir",
    price: 30,
    rating: 4.7,
    reviewCount: 25,
    description: "Sac de voyage spacieux en toile et cuir. Idéal pour les escapades.",
    images: [
      { src: "/images/sac/77.jpeg", alt: "Vue principale" }
    ],
    category: "Voyage",
    categorySlug: "maroquinerie",
  },
  'porte-documents-executive': {
    id: 2014,
    name: "Porte-Documents Executive",
    price: 31,
    originalPrice: 39,
    rating: 5,
    reviewCount: 35,
    description: "Porte-documents en cuir premium. L'accessoire business par excellence.",
    images: [
      { src: "/images/sac/88.jpeg", alt: "Vue principale" }
    ],
    category: "Business",
    categorySlug: "maroquinerie",
    isNew: true,
  },
  'sac-hobo-franges-boheme': {
    id: 2015,
    name: "Sac Hobo Franges Bohème",
    price: 34,
    rating: 4.6,
    reviewCount: 21,
    description: "Sac hobo avec franges. Style bohème et décontracté.",
    images: [
      { src: "/images/sac/99.jpeg", alt: "Vue principale" }
    ],
    category: "Sacs Hobo",
    categorySlug: "maroquinerie",
  },
  'pochette-ipad-cuir-premium': {
    id: 2016,
    name: "Pochette iPad Cuir Premium",
    price: 32,
    originalPrice: 39,
    rating: 4.4,
    reviewCount: 18,
    description: "Pochette pour iPad en cuir premium. Protection optimale avec style.",
    images: [
      { src: "/images/sac/100.jpeg", alt: "Vue principale" }
    ],
    category: "Petite Maroquinerie",
    categorySlug: "maroquinerie",
  },
  'sac-docteur-vintage-luxe': {
    id: 2017,
    name: "Sac Docteur Vintage Luxe",
    price: 32,
    rating: 5,
    reviewCount: 32,
    description: "Sac docteur vintage en cuir de luxe. Une pièce d'exception intemporelle.",
    images: [
      { src: "/images/sac/101.jpeg", alt: "Vue principale" }
    ],
    category: "Sacs Docteur",
    categorySlug: "maroquinerie",
  },

  // PARFUMS
  'oud-royal-absolu': {
    id: 3001,
    name: "Oud Royal Absolu",
    price: 33,
    originalPrice: 36,
    rating: 5,
    reviewCount: 48,
    description: "Parfum d'exception à base d'oud naturel. Une fragrance intense et envoûtante.",
    images: [
      { src: "/images/parfum/1.jpeg", alt: "Vue principale" }
    ],
    category: "Parfums Oud",
    categorySlug: "parfums",
    isNew: true,
  },
  'musc-blanc-premium': {
    id: 3002,
    name: "Musc Blanc Premium",
    price: 32,
    rating: 4.9,
    reviewCount: 42,
    description: "Musc blanc de qualité premium. Douceur et élégance en flacon.",
    images: [
      { src: "/images/parfum/2.jpeg", alt: "Vue principale" }
    ],
    category: "Muscs",
    categorySlug: "parfums",
  },
  'rose-damas-elixir': {
    id: 3003,
    name: "Rose de Damas Élixir",
    price: 33,
    originalPrice: 38,
    rating: 4.8,
    reviewCount: 38,
    description: "Élixir précieux à la rose de Damas. Fragrance florale d'exception.",
    images: [
      { src: "/images/parfum/3.jpeg", alt: "Vue principale" }
    ],
    category: "Floraux",
    categorySlug: "parfums",
  },
  'ambre-oriental-mystique': {
    id: 3004,
    name: "Ambre Oriental Mystique",
    price: 34,
    rating: 4.7,
    reviewCount: 34,
    description: "Parfum ambré aux notes orientales mystérieuses. Chaleur et sensualité.",
    images: [
      { src: "/images/parfum/4.jpeg", alt: "Vue principale" }
    ],
    category: "Ambrés",
    categorySlug: "parfums",
  },
  'jasmin-du-maroc': {
    id: 3005,
    name: "Jasmin du Maroc",
    price: 33,
    originalPrice: 38,
    rating: 4.8,
    reviewCount: 36,
    description: "Essence pure de jasmin marocain. Fragrance florale délicate et raffinée.",
    images: [
      { src: "/images/parfum/5.jpeg", alt: "Vue principale" }
    ],
    category: "Floraux",
    categorySlug: "parfums",
  },
  'santal-noir-intense': {
    id: 3006,
    name: "Santal Noir Intense",
    price: 31,
    rating: 4.9,
    reviewCount: 40,
    description: "Santal noir aux notes boisées intenses. Masculin et sophistiqué.",
    images: [
      { src: "/images/parfum/6.jpeg", alt: "Vue principale" }
    ],
    category: "Boisés",
    categorySlug: "parfums",
    isNew: true,
  },
  'fleur-oranger-atlas': {
    id: 3007,
    name: "Fleur d'Oranger Atlas",
    price: 32,
    originalPrice: 40,
    rating: 4.6,
    reviewCount: 32,
    description: "Fleur d'oranger de l'Atlas. Fraîcheur et délicatesse méditerranéenne.",
    images: [
      { src: "/images/parfum/7.jpeg", alt: "Vue principale" }
    ],
    category: "Floraux",
    categorySlug: "parfums",
  },
  'encens-sacre-sahara': {
    id: 3008,
    name: "Encens Sacré du Sahara",
    price: 32,
    rating: 4.8,
    reviewCount: 37,
    description: "Encens sacré du Sahara. Fragrance spirituelle et mystique.",
    images: [
      { src: "/images/parfum/8.jpeg", alt: "Vue principale" }
    ],
    category: "Orientaux",
    categorySlug: "parfums",
  },
  'patchouli-royal': {
    id: 3009,
    name: "Patchouli Royal",
    price: 30,
    originalPrice: 37,
    rating: 4.5,
    reviewCount: 30,
    description: "Patchouli de qualité royale. Notes terreuses et envoûtantes.",
    images: [
      { src: "/images/parfum/9.jpeg", alt: "Vue principale" }
    ],
    category: "Boisés",
    categorySlug: "parfums",
  },
  'vanille-bourbon-precieuse': {
    id: 3010,
    name: "Vanille Bourbon Précieuse",
    price: 34,
    rating: 4.7,
    reviewCount: 35,
    description: "Vanille Bourbon d'exception. Douceur gourmande et addictive.",
    images: [
      { src: "/images/parfum/10.jpeg", alt: "Vue principale" }
    ],
    category: "Gourmands",
    categorySlug: "parfums",
  },
  'collection-privee-oud-rose': {
    id: 3011,
    name: "Collection Privée Oud & Rose",
    price: 31,
    rating: 5,
    reviewCount: 44,
    description: "Création exclusive alliant oud et rose. Le summum du luxe olfactif.",
    images: [
      { src: "/images/parfum/11.jpeg", alt: "Vue principale" }
    ],
    category: "Collection Privée",
    categorySlug: "parfums",
    isNew: true,
  },

  // TISSUS
  'brocart-dore-royal': {
    id: 4001,
    name: "Brocart Doré Royal",
    price: 33,
    originalPrice: 38,
    rating: 5,
    reviewCount: 28,
    description: "Brocart tissé avec fils d'or. Tissu d'exception pour créations haute couture.",
    images: [
      { src: "/images/tissu/1.jpeg", alt: "Vue principale" }
    ],
    category: "Brocarts",
    categorySlug: "tissus",
    isNew: true,
  },
  'soie-brodee-florale': {
    id: 4002,
    name: "Soie Brodée Florale",
    price: 33,
    rating: 4.8,
    reviewCount: 24,
    description: "Soie naturelle avec broderies florales délicates. Élégance et raffinement.",
    images: [
      { src: "/images/tissu/2.jpeg", alt: "Vue principale" }
    ],
    category: "Soies",
    categorySlug: "tissus",
  },
  'velours-luxe-emeraude': {
    id: 4003,
    name: "Velours de Luxe Émeraude",
    price: 34,
    originalPrice: 36,
    rating: 4.7,
    reviewCount: 22,
    description: "Velours premium couleur émeraude. Douceur et profondeur exceptionnelles.",
    images: [
      { src: "/images/tissu/3.jpeg", alt: "Vue principale" }
    ],
    category: "Velours",
    categorySlug: "tissus",
  },
  'tissu-brode-traditionnel': {
    id: 4004,
    name: "Tissu Brodé Traditionnel",
    price: 33,
    rating: 4.6,
    reviewCount: 20,
    description: "Tissu avec broderies traditionnelles marocaines. Authenticité garantie.",
    images: [
      { src: "/images/tissu/4.jpeg", alt: "Vue principale" }
    ],
    category: "Broderies",
    categorySlug: "tissus",
  },
  'satin-soie-premium': {
    id: 4005,
    name: "Satin de Soie Premium",
    price: 33,
    originalPrice: 40,
    rating: 4.9,
    reviewCount: 26,
    description: "Satin de soie de première qualité. Brillance et fluidité incomparables.",
    images: [
      { src: "/images/tissu/5.jpeg", alt: "Vue principale" }
    ],
    category: "Satins",
    categorySlug: "tissus",
  },
  'dentelle-artisanale-fine': {
    id: 4006,
    name: "Dentelle Artisanale Fine",
    price: 33,
    rating: 5,
    reviewCount: 30,
    description: "Dentelle faite main d'une finesse exceptionnelle. Travail d'orfèvre textile.",
    images: [
      { src: "/images/tissu/6.jpeg", alt: "Vue principale" }
    ],
    category: "Dentelles",
    categorySlug: "tissus",
    isNew: true,
  },
  'mousseline-perlee-delicate': {
    id: 4007,
    name: "Mousseline Perlée Délicate",
    price: 34,
    originalPrice: 39,
    rating: 4.5,
    reviewCount: 18,
    description: "Mousseline légère ornée de perles. Délicatesse et féminité.",
    images: [
      { src: "/images/tissu/7.jpeg", alt: "Vue principale" }
    ],
    category: "Mousselines",
    categorySlug: "tissus",
  },

  // JELLABAS FEMME
  'jellaba-princesse-brodee-or': {
    id: 5001,
    name: "Jellaba Princesse Brodée Or",
    price: 34,
    originalPrice: 37,
    rating: 5,
    reviewCount: 52,
    description: "Jellaba haute couture brodée avec fils d'or. Une création d'exception pour les grandes occasions.",
    images: [
      { src: "/images/femme/1.jpeg", alt: "Vue principale" }
    ],
    category: "Haute Couture",
    categorySlug: "jellabas/femme",
    isNew: true,
  },
  'jellaba-elegance-rose-poudre': {
    id: 5002,
    name: "Jellaba Élégance Rose Poudré",
    price: 30,
    rating: 4.9,
    reviewCount: 46,
    description: "Jellaba élégante en rose poudré. Féminité et sophistication.",
    images: [
      { src: "/images/femme/2.jpeg", alt: "Vue principale" }
    ],
    category: "Collection Soirée",
    categorySlug: "jellabas/femme",
  },
  'jellaba-moderne-chic': {
    id: 5003,
    name: "Jellaba Moderne Chic",
    price: 34,
    originalPrice: 38,
    rating: 4.7,
    reviewCount: 40,
    description: "Jellaba au design moderne et chic. Pour la femme contemporaine.",
    images: [
      { src: "/images/femme/3.jpeg", alt: "Vue principale" }
    ],
    category: "Casual Chic",
    categorySlug: "jellabas/femme",
  },
  'jellaba-mariee-blanche-luxe': {
    id: 5004,
    name: "Jellaba Mariée Blanche Luxe",
    price: 32,
    rating: 5,
    reviewCount: 38,
    description: "Jellaba de mariée en blanc immaculé. Pièce unique pour le jour J.",
    images: [
      { src: "/images/femme/4.jpeg", alt: "Vue principale" }
    ],
    category: "Collection Mariée",
    categorySlug: "jellabas/femme",
    isNew: true,
  },
  'jellaba-quotidienne-confort': {
    id: 5005,
    name: "Jellaba Quotidienne Confort",
    price: 30,
    originalPrice: 40,
    rating: 4.6,
    reviewCount: 34,
    description: "Jellaba confortable pour le quotidien. Alliant style et praticité.",
    images: [
      { src: "/images/femme/5.jpeg", alt: "Vue principale" }
    ],
    category: "Quotidien",
    categorySlug: "jellabas/femme",
  },

  // JELLABAS HOMME
  'jellaba-sultan-brodee-or': {
    id: 6001,
    name: "Jellaba Sultan Brodée Or",
    price: 34,
    originalPrice: 38,
    rating: 5,
    reviewCount: 48,
    description: "Jellaba masculine royale avec broderies dorées. Prestance et élégance.",
    images: [
      { src: "/images/homme/1.jpeg", alt: "Vue principale" }
    ],
    category: "Collection Prestige",
    categorySlug: "jellabas/homme",
    isNew: true,
  },
  'jellaba-business-moderne': {
    id: 6002,
    name: "Jellaba Business Moderne",
    price: 32,
    rating: 4.8,
    reviewCount: 42,
    description: "Jellaba adaptée au monde professionnel. Modernité et tradition.",
    images: [
      { src: "/images/homme/2.jpeg", alt: "Vue principale" }
    ],
    category: "Business",
    categorySlug: "jellabas/homme",
  },
  'jellaba-traditionnelle-blanche': {
    id: 6003,
    name: "Jellaba Traditionnelle Blanche",
    price: 30,
    originalPrice: 40,
    rating: 4.7,
    reviewCount: 38,
    description: "Jellaba traditionnelle en blanc pur. Classique intemporel.",
    images: [
      { src: "/images/homme/3.jpeg", alt: "Vue principale" }
    ],
    category: "Traditionnelle",
    categorySlug: "jellabas/homme",
  },
  'jellaba-sport-chic': {
    id: 6004,
    name: "Jellaba Sport Chic",
    price: 33,
    rating: 4.5,
    reviewCount: 32,
    description: "Jellaba décontractée au style sport chic. Confort et allure.",
    images: [
      { src: "/images/homme/4.jpeg", alt: "Vue principale" }
    ],
    category: "Casual",
    categorySlug: "jellabas/homme",
  },
  'jellaba-ceremonie-noire': {
    id: 6005,
    name: "Jellaba Cérémonie Noire",
    price: 32,
    originalPrice: 40,
    rating: 4.9,
    reviewCount: 44,
    description: "Jellaba de cérémonie en noir profond. Élégance absolue.",
    images: [
      { src: "/images/homme/5.jpeg", alt: "Vue principale" }
    ],
    category: "Cérémonie",
    categorySlug: "jellabas/homme",
  },
  'jellaba-quotidienne-confort-homme': {
    id: 6006,
    name: "Jellaba Quotidienne Confort",
    price: 34,
    rating: 4.4,
    reviewCount: 28,
    description: "Jellaba masculine confortable pour tous les jours.",
    images: [
      { src: "/images/homme/6.jpeg", alt: "Vue principale" }
    ],
    category: "Quotidien",
    categorySlug: "jellabas/homme",
  },
  'jellaba-luxe-cachemire': {
    id: 6007,
    name: "Jellaba Luxe Cachemire",
    price: 31,
    rating: 5,
    reviewCount: 36,
    description: "Jellaba en cachemire pur. Le luxe ultime.",
    images: [
      { src: "/images/homme/7.jpeg", alt: "Vue principale" }
    ],
    category: "Collection Prestige",
    categorySlug: "jellabas/homme",
    isNew: true,
  },
  'jellaba-ete-legere': {
    id: 6008,
    name: "Jellaba Été Légère",
    price: 32,
    originalPrice: 37,
    rating: 4.6,
    reviewCount: 30,
    description: "Jellaba légère pour l'été. Fraîcheur et style.",
    images: [
      { src: "/images/homme/8.jpeg", alt: "Vue principale" }
    ],
    category: "Été",
    categorySlug: "jellabas/homme",
  },

  // Conserver les anciens produits pour compatibilité
  'jellaba-royale-soie': {
    id: 1,
    name: "Jellaba Royale en Soie",
    handle: "jellaba-royale-soie",
    price: 30,
    originalPrice: 39,
    rating: 4.8,
    reviewCount: 124,
    description: "Une jellaba d'exception confectionnée en pure soie, alliant tradition marocaine et élégance contemporaine.",
    images: [
      { src: "https://images.pexels.com/photos/6069113/pexels-photo-6069113.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Vue principale" }
    ],
    category: "Jellabas Premium",
    categorySlug: "jellabas",
    isNew: true,
  },
  'jellaba-traditionnelle-brodee': {
    id: 2,
    name: "Jellaba Traditionnelle Brodée",
    price: 32,
    image: "https://images.pexels.com/photos/6069064/pexels-photo-6069064.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Jellabas Classiques",
    categorySlug: "jellabas",
    rating: 4,
    reviewCount: 89,
    description: "Jellaba traditionnelle avec broderies artisanales.",
    images: [
      { src: "https://images.pexels.com/photos/6069064/pexels-photo-6069064.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Vue principale" }
    ],
  },
  'jellaba-moderne-elegante': {
    id: 3,
    name: "Jellaba Moderne Élégante",
    price: 30,
    originalPrice: 36,
    image: "https://images.pexels.com/photos/6069077/pexels-photo-6069077.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Collection Moderne",
    categorySlug: "jellabas",
    rating: 5,
    reviewCount: 95,
    description: "Design moderne avec touches traditionnelles.",
    images: [
      { src: "https://images.pexels.com/photos/6069077/pexels-photo-6069077.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Vue principale" }
    ],
  },
  'jellaba-caftan-luxe': {
    id: 4,
    name: "Jellaba Caftan Luxe",
    price: 33,
    image: "https://images.pexels.com/photos/6069110/pexels-photo-6069110.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Jellabas Premium",
    categorySlug: "jellabas",
    isNew: true,
    rating: 5,
    reviewCount: 110,
    description: "Caftan de luxe avec ornements précieux.",
    images: [
      { src: "https://images.pexels.com/photos/6069110/pexels-photo-6069110.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Vue principale" }
    ],
  },
  'huile-argan-pure-bio': {
    id: 5,
    name: "Huile d'Argan Pure Bio",
    price: 32,
    originalPrice: 40,
    image: "https://images.pexels.com/photos/3737580/pexels-photo-3737580.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Huiles Précieuses",
    categorySlug: "huiles",
    rating: 5,
    reviewCount: 234,
    description: "Huile d'argan 100% pure et biologique.",
    images: [
      { src: "https://images.pexels.com/photos/3737580/pexels-photo-3737580.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Vue principale" }
    ],
  },
  'huile-rose-damassee': {
    id: 6,
    name: "Huile de Rose Damassée",
    price: 34,
    image: "https://images.pexels.com/photos/3737586/pexels-photo-3737586.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Huiles Florales",
    categorySlug: "huiles",
    rating: 4,
    reviewCount: 156,
    description: "Essence de rose de Damas pure.",
    images: [
      { src: "https://images.pexels.com/photos/3737586/pexels-photo-3737586.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Vue principale" }
    ],
  },
  'huile-amande-douce': {
    id: 7,
    name: "Huile d'Amande Douce",
    price: 34,
    originalPrice: 39,
    image: "https://images.pexels.com/photos/3737591/pexels-photo-3737591.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Huiles Essentielles",
    categorySlug: "huiles",
    rating: 5,
    reviewCount: 189,
    description: "Huile d'amande douce pressée à froid.",
    images: [
      { src: "https://images.pexels.com/photos/3737591/pexels-photo-3737591.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Vue principale" }
    ],
  },
  'huile-cactus-rare': {
    id: 8,
    name: "Huile de Cactus Rare",
    price: 32,
    image: "https://images.pexels.com/photos/3737594/pexels-photo-3737594.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Huiles Précieuses",
    categorySlug: "huiles",
    isNew: true,
    rating: 5,
    reviewCount: 145,
    description: "Huile de figue de barbarie anti-âge.",
    images: [
      { src: "https://images.pexels.com/photos/3737594/pexels-photo-3737594.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Vue principale" }
    ],
  },
  'parfum-oud-royal': {
    id: 9,
    name: "Parfum Oud Royal",
    price: 32,
    originalPrice: 40,
    image: "https://images.pexels.com/photos/3770254/pexels-photo-3770254.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Parfums Orientaux",
    categorySlug: "parfums",
    isNew: true,
    rating: 5,
    reviewCount: 167,
    description: "Fragrance orientale au bois d'oud précieux.",
    images: [
      { src: "https://images.pexels.com/photos/3770254/pexels-photo-3770254.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Vue principale" }
    ],
  },
  'essence-jasmin': {
    id: 10,
    name: "Essence de Jasmin",
    price: 30,
    image: "https://images.pexels.com/photos/3770230/pexels-photo-3770230.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Parfums Floraux",
    categorySlug: "parfums",
    rating: 4,
    reviewCount: 123,
    description: "Parfum floral délicat au jasmin.",
    images: [
      { src: "https://images.pexels.com/photos/3770230/pexels-photo-3770230.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Vue principale" }
    ],
  },
  'musc-blanc-premium-old': {
    id: 11,
    name: "Musc Blanc Premium",
    price: 33,
    originalPrice: 39,
    image: "https://images.pexels.com/photos/3770240/pexels-photo-3770240.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Parfums Classiques",
    categorySlug: "parfums",
    rating: 5,
    reviewCount: 201,
    description: "Musc blanc de qualité supérieure.",
    images: [
      { src: "https://images.pexels.com/photos/3770240/pexels-photo-3770240.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Vue principale" }
    ],
  },
  'ambre-santal': {
    id: 12,
    name: "Ambre & Santal",
    price: 31,
    image: "https://images.pexels.com/photos/3770244/pexels-photo-3770244.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Collection Prestige",
    categorySlug: "parfums",
    isNew: true,
    rating: 5,
    reviewCount: 178,
    description: "Accord sophistiqué d'ambre et de santal.",
    images: [
      { src: "https://images.pexels.com/photos/3770244/pexels-photo-3770244.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Vue principale" }
    ],
  },
};

// Ajouter les détails communs à tous les produits
Object.values(allProducts).forEach(product => {
  if (!product.variants) {
    product.variants = {
      sizes: [
        { value: 'S', label: 'S', available: true },
        { value: 'M', label: 'M', available: true },
        { value: 'L', label: 'L', available: false },
        { value: 'XL', label: 'XL', available: true },
        { value: 'XXL', label: 'XXL', available: true }
      ],
      colors: [
        { value: 'noir', label: 'Noir', hex: '#000000', available: true },
        { value: 'blanc', label: 'Blanc', hex: '#FFFFFF', available: true },
        { value: 'rose', label: 'Rose Gold', hex: '#E8B4B8', available: true },
        { value: 'bleu', label: 'Bleu Royal', hex: '#1E40AF', available: false }
      ]
    };
  }
  
  if (!product.details) {
    product.details = {
      composition: "100% Artisanat authentique",
      broderie: "Fait main",
      doublure: "Premium",
      origine: "Marrakech, Maroc",
      temps_production: "7-15 jours ouvrés",
      entretien: [
        "Entretien professionnel recommandé",
        "Conservation dans un endroit sec",
        "Protection contre la lumière directe"
      ]
    };
  }
  
  if (!product.shipping) {
    product.shipping = {
      standard: "5-7 jours ouvrés",
      express: "2-3 jours ouvrés",
      international: "10-15 jours ouvrés"
    };
  }
});