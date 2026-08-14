import localFont from "next/font/local";
import "./globals.css";
import { SITE_CONFIG, SEO_DEFAULTS } from '../lib/constants';
import LayoutWrapper from './components/LayoutWrapper';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  preload: false,
});

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  title: {
    default: SITE_CONFIG.title,
    template: `%s • ${SITE_CONFIG.name}`
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    ...SEO_DEFAULTS.openGraph,
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
  },
  twitter: {
    ...SEO_DEFAULTS.twitter,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  category: 'technology',
  metadataBase: new URL(SITE_CONFIG.url),
  manifest: '/site.webmanifest',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black',
    'format-detection': 'telephone=no',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{var t=localStorage.getItem('bergaman-theme');var l=localStorage.getItem('bergaman-locale');document.documentElement.dataset.theme=t==='light'?'light':'dark';document.documentElement.style.colorScheme=t==='light'?'light':'dark';if(l==='tr'){document.documentElement.lang='tr';document.documentElement.dataset.locale='tr'}}catch(e){}" }} />
        <meta name="theme-color" content={SITE_CONFIG.themeColor} />

        <link rel="stylesheet" href="/icons/fontawesome.min.css" />
        {/* Güvenlik meta etiketleri */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen text-[#d1d5db] flex flex-col`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Analytics />
        <SpeedInsights />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": SITE_CONFIG.author.name,
              "url": SITE_CONFIG.url,
              "image": `${SITE_CONFIG.url}/images/profile/profile.jpg`,
              "sameAs": [
                SITE_CONFIG.author.github,
                SITE_CONFIG.author.linkedin
              ],
              "jobTitle": "Electrical & Electronics Engineer & Full-Stack Developer",
              "brand": {
                "@type": "Brand",
                "name": "Bergasoft"
              },
              "knowsAbout": [
                "Artificial Intelligence",
                "Blockchain Development",
                "Full Stack Development",
                "Python Programming",
                "JavaScript Development",
                "Discord Bot Development",
                "IoT Projects",
                "Machine Learning",
                "High-Voltage Engineering",
                "Power Systems",
                "AutoCAD",
                "Electrical Protection and Grounding",
                "AI-Assisted Software Development"
              ],
              "description": SITE_CONFIG.description
            })
          }}
        />
      </body>
    </html>
  );
}
