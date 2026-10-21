import './globals.css';
import type { Metadata } from 'next';
import logger from '@/lib/logger';

logger.info('RootLayout initialized');

export const metadata: Metadata = {
  title: 'Yourtube — your history is a story',
  description: 'An interactive explorer of your personal YouTube watch history.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="film" suppressHydrationWarning>
      <body className="bg-cream text-ink font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
