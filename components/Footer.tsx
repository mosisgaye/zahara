import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'Jellabas', href: '#jellabas' },
    { name: 'Huiles', href: '#huiles' },
    { name: 'Parfums', href: '#parfums' },
    { name: 'Nouveautés', href: '#' },
    { name: 'Promotions', href: '#' }
  ],
  company: [
    { name: 'À propos', href: '#' },
    { name: 'Nos Artisans', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Presse', href: '#' },
    { name: 'Carrières', href: '#' }
  ],
  support: [
    { name: 'Contact', href: '#' },
    { name: 'FAQ', href: '#' },
    { name: 'Guide des Tailles', href: '#' },
    { name: 'Livraison', href: '#' },
    { name: 'Retours', href: '#' }
  ],
  legal: [
    { name: 'Conditions d\'utilisation', href: '#' },
    { name: 'Politique de confidentialité', href: '#' },
    { name: 'Cookies', href: '#' },
    { name: 'Mentions légales', href: '#' }
  ]
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' }
];

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-crimson font-bold text-white mb-6">
              ZaharaShop
            </h3>
            <p className="text-white/70 mb-8 max-w-sm font-light leading-relaxed">
              Maison de luxe dédiée à l'art de vivre marocain. 
              Chaque création raconte une histoire d'exception.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gold" />
                <span className="text-white/70">Casablanca, Maroc</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gold" />
                <span className="text-white/70">+221 78 444 38 06</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gold" />
                <span className="text-white/70">contact@zaharashop.net</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-6 text-white">Boutique</h4>
            <ul className="space-y-4">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/60 hover:text-white transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white">Maison</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/60 hover:text-white transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white">Service</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/60 hover:text-white transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white">Légal</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/60 hover:text-white transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-16 pt-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-white/50 mb-6 md:mb-0">
              © 2025 ZaharaShop. Tous droits réservés.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-500 transition-all duration-300 group"
                  >
                    <IconComponent className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}