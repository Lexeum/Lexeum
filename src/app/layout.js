'use client';

import { SessionProvider } from 'next-auth/react';
import '@/app/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <title>Lexeum</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles/global.css" />
      </head>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
