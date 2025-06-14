import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import { SITE_CONFIG, SEO_DEFAULTS } from '../lib/constants';
import LayoutWrapper from './components/LayoutWrapper';

const inter = Inter({ subsets: ["latin"] });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  icons: {
    icon: '/favicon.ico',
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
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  category: 'technology',
  metadataBase: new URL(SITE_CONFIG.url),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content={SITE_CONFIG.themeColor} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* FontAwesome */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased min-h-screen text-[#d1d5db] flex flex-col`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Analytics />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": SITE_CONFIG.author.name,
              "url": SITE_CONFIG.url,
              "image": `${SITE_CONFIG.url}/images/profile/profile.png`,
              "sameAs": [
                SITE_CONFIG.author.github,
                SITE_CONFIG.author.twitter,
                SITE_CONFIG.author.discord
              ],
              "jobTitle": "AI & Blockchain Developer",
              "worksFor": {
                "@type": "Organization",
                "name": "Freelance"
              },
              "knowsAbout": [
                "Artificial Intelligence",
                "Blockchain Development",
                "Full Stack Development",
                "Python Programming",
                "JavaScript Development",
                "Discord Bot Development",
                "IoT Projects",
                "Machine Learning"
              ],
              "description": SITE_CONFIG.description
            })
          }}
        />
      </body>
    </html>
  );
}
