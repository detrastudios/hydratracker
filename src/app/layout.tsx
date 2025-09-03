import type {Metadata, Viewport} from 'next';
import { HydrationProvider } from "@/contexts/hydration-provider";
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from "@/components/app-layout";
import './globals.css';

export const metadata: Metadata = {
  title: 'HydraTracker - Pendamping Hidrasi Pribadi Anda',
  description: 'Lacak asupan air harian Anda, dapatkan pengingat cerdas, dan tetap terhidrasi dengan HydraTracker.',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#007AFF',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
      </head>
      <body className="font-body antialiased">
        <HydrationProvider>
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster />
        </HydrationProvider>
      </body>
    </html>
  );
}
