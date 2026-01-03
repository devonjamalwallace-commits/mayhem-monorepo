import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mayhemworld.io',
  description: 'General Hub & Personal Brand',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
