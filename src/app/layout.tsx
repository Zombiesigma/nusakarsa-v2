import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Courier_Prime } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { ProtectionProvider } from '@/components/ProtectionProvider';
import { cn } from '@/lib/utils';

const productionUrl = 'https://nusakarsa-one.vercel.app/';
const brandIcon = 'https://raw.githubusercontent.com/Zombiesigma/nusakarsa-assets/main/download.webp';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  weight: ['700', '800', '900'],
  display: 'swap',
});

const courierPrime = Courier_Prime({
    subsets: ['latin'],
    variable: '--font-courier-prime',
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(productionUrl),
  title: {
    default: 'Nusakarsa - Daya Cipta Bangsa',
    template: '%s | Nusakarsa',
  },
  description: 'Ruang kolaborasi untuk para penulis, pujangga, dan sastrawan bangsa di Nusakarsa.',
  keywords: ['nusakarsa', 'buku', 'novel', 'cerita', 'seni', 'kreatif', 'bangsa', 'daya cipta', 'penulis', 'pujangga'],
  authors: [{ name: 'Guntur P.', url: 'https://www.gunturpadilah.web.id/' }],
  creator: 'Guntur P.',
  icons: {
    icon: brandIcon,
    apple: brandIcon,
  },
  openGraph: {
    title: {
      default: 'Nusakarsa - Daya Cipta Bangsa',
      template: '%s | Nusakarsa',
    },
    description: 'Ruang kolaborasi untuk para penulis, pujangga, dan sastrawan bangsa di Nusakarsa.',
    siteName: 'Nusakarsa',
    url: productionUrl,
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: brandIcon,
        width: 800,
        height: 800,
        alt: 'Nusakarsa Logo',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
   twitter: {
    card: 'summary',
    title: {
      default: 'Nusakarsa - Daya Cipta Bangsa',
      template: '%s | Nusakarsa',
    },
    description: 'Ruang kolaborasi untuk para penulis, pujangga, dan sastrawan bangsa di Nusakarsa.',
    images: [brandIcon],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
      </head>
      <body className={cn(
        "font-body antialiased",
        inter.variable,
        playfairDisplay.variable,
        courierPrime.variable
      )}>
        <FirebaseClientProvider>
          <FirebaseErrorListener />
          <ProtectionProvider>
            {children}
          </ProtectionProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
