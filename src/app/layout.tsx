import type { Metadata, Viewport } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { ProtectionProvider } from '@/components/ProtectionProvider';

const productionUrl = 'https://www.nusakarsa.my.id/';
const brandIcon = 'https://raw.githubusercontent.com/Zombiesigma/nusakarsa-assets/main/download.webp';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(productionUrl),
  title: {
    default: 'Nusakarsa - Ekosistem Daya Cipta Bangsa',
    template: '%s | Nusakarsa',
  },
  description: 'Ruang kolaborasi kreatif untuk para pujangga dan seniman bangsa di Nusakarsa.',
  keywords: ['nusakarsa', 'buku', 'novel', 'cerita', 'seni', 'kreatif', 'bangsa', 'daya cipta'],
  authors: [{ name: 'Guntur P.', url: 'https://www.gunturpadilah.web.id/' }],
  creator: 'Guntur P.',
  icons: {
    icon: brandIcon,
    apple: brandIcon,
  },
  openGraph: {
    title: {
      default: 'Nusakarsa - Ekosistem Daya Cipta Bangsa',
      template: '%s | Nusakarsa',
    },
    description: 'Ruang kolaborasi kreatif untuk para pujangga dan seniman bangsa di Nusakarsa.',
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
      default: 'Nusakarsa - Ekosistem Daya Cipta Bangsa',
      template: '%s | Nusakarsa',
    },
    description: 'Ruang kolaborasi kreatif untuk para pujangga dan seniman bangsa di Nusakarsa.',
    images: [brandIcon],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800;900&family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
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
