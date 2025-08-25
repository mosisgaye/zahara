import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import CartDrawer from '@/components/CartDrawer';
import Toast from '@/components/Toast';
import WhatsAppWidget from '@/components/WhatsAppWidget';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ZaharaShop - Maison de Luxe Marocaine',
  description: 'Collection exclusive de jellabas d\'exception, huiles rares et parfums authentiques. L\'art de vivre marocain sublimé.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body className={`${inter.variable} font-inter antialiased`}>
        <CurrencyProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <Toast />
            <WhatsAppWidget />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}