import type { Metadata } from 'next';
import '../styles/tailwind.css';
import './home/home.css';
import './anatomy/anatomy.css';
import './standard/standard.css';
import './studio/studio.css';
import './command-center/command-center.css';
import './projects/projects.css';
import { SiteShell } from './site-shell';

export const metadata: Metadata = {
  metadataBase: new URL('https://tactspaces.in'),
  title: 'Architecture & Interiors in Bengaluru | TactSpaces',
  description: 'TactSpaces delivers architecture and turnkey interior design across Bengaluru, with documented costs, clear timelines, and accountable execution.',
  applicationName: 'TactSpaces',
  openGraph: { type: 'website', siteName: 'TactSpaces', locale: 'en_IN' },
  twitter: { card: 'summary' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://tactspaces.in/#organization',
        name: 'TactSpaces',
        url: 'https://tactspaces.in/',
        description: 'Architecture and turnkey interior design across Bengaluru, governed by precision.',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://tactspaces.in/#website',
        url: 'https://tactspaces.in/',
        name: 'TactSpaces',
        publisher: { '@id': 'https://tactspaces.in/#organization' },
      },
    ],
  };

  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
