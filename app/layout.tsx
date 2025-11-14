import './globals.css';
import '@mantine/core/styles.css';
import { ColorSchemeScript } from '@mantine/core';
import type { ReactNode } from 'react';
import { Providers } from './providers';

export const metadata = {
  title: 'AI Next App',
  description: 'Next.js app with Mantine',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sv">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


