import type {Metadata, Viewport} from 'next';
import { HydrationProvider } from "@/contexts/hydration-provider";
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from "@/components/app-layout";
import './globals.css';

export const metadata: Metadata = {
  title: 'HydraTracker - Your Personal Hydration Companion',
  description: 'Track your daily water intake, get smart reminders, and stay hydrated with HydraTracker.',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#4A90E2',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
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
