import './globals.css'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import GoogleAnalytics from '@/components/GoogleAnalytics'

export const metadata = {
  metadataBase: new URL('https://getwearvana.com'),
  title: {
    default: 'Wearvana — Exclusive Sneakers & Caps in Nepal',
    template: '%s — Wearvana',
  },
  description:
    'Buy authentic Nike, Jordan, Adidas sneakers and New Era caps in Nepal. Pre-order only. 50% advance via eSewa or Khalti. Zero fakes. Delivered to your door.',
  keywords: [
    'buy sneakers Nepal',
    'Nike sneakers Nepal',
    'Jordan shoes Nepal',
    'Adidas Samba Nepal',
    'New Era caps Nepal',
    'New Era hat Nepal',
    'streetwear Nepal',
    'sneakers Kathmandu',
    'pre-order sneakers Nepal',
    'authentic sneakers Nepal',
    'buy New Balance Nepal',
    'wearvana',
  ],
  authors: [{ name: 'Wearvana' }],
  creator: 'Wearvana',
  publisher: 'Wearvana',
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://getwearvana.com',
    siteName: 'Wearvana',
    title: 'Wearvana — Exclusive Sneakers & Caps in Nepal',
    description:
      'Authentic Nike, Jordan, Adidas & New Era. Pre-order only. 50% advance. Zero fakes. Delivered in Nepal.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Wearvana — Streetwear Nepal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wearvana — Exclusive Sneakers & Caps in Nepal',
    description: 'Authentic sneakers & New Era caps. Pre-order only. Nepal delivery.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    // google: 'YOUR_GOOGLE_SEARCH_CONSOLE_ID', // add after deploying
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: 'Wearvana',
  description: 'Exclusive sneakers and New Era caps in Nepal. Pre-order platform.',
  url: 'https://getwearvana.com',
  logo: 'https://getwearvana.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+977-9705477470',
    contactType: 'customer service',
    availableLanguage: ['English', 'Nepali'],
  },
  sameAs: ['https://www.instagram.com/wearvana.kicks'],
  areaServed: { '@type': 'Country', name: 'Nepal' },
  priceRange: 'NPR 5,000 – NPR 30,000',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,900;1,900&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#C0231E" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Wearvana" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        {/* Anti-FOUC: apply saved theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('wearvana_theme')||'dark';document.documentElement.setAttribute('data-theme',t);})()` }} />
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AnnouncementBanner />
        {children}
        <WhatsAppFloat />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
