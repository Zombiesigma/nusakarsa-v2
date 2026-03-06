
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { ConditionalLayout } from '@/components/conditional-layout';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'Nusakarsa Digital',
  description: 'Membuka Semesta dalam Kata',
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
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased grain">
        <FirebaseClientProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
