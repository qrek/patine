import type { Metadata } from 'next'
import { Cormorant_Garamond, Instrument_Sans } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import SiteLoader from '@/components/SiteLoader'
import { getSettings } from '@/lib/content'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-instrument',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://atelier-patine.fr'),
  title: {
    default: "Patine — Atelier d'encadrement à Paris",
    template: '%s — Patine, atelier d\'encadrement à Paris',
  },
  description:
    "Patine, atelier d'encadrement artisanal à Paris 18e. Encadrement sur mesure, mise en valeur et conservation d'œuvres d'art, photographies et objets précieux.",
  keywords: [
    'encadrement Paris',
    'atelier encadrement',
    'encadreur Paris',
    'encadrement sur mesure',
    'encadrement artisanal',
    'encadrement œuvre d\'art',
    'patine',
    'cadres sur mesure Paris',
    'conservation œuvre d\'art',
    'passepartout',
    'baguette bois',
    'Paris 18',
  ],
  applicationName: 'Patine',
  authors: [{ name: 'Atelier Patine' }],
  creator: 'Atelier Patine',
  publisher: 'Atelier Patine',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Patine — Atelier d'encadrement à Paris",
    description:
      "Atelier d'encadrement artisanal à Paris 18e — fabrication sur mesure, mise en valeur et conservation.",
    url: 'https://atelier-patine.fr',
    siteName: 'Patine',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Patine — Atelier d'encadrement à Paris",
    description:
      "Atelier d'encadrement artisanal à Paris 18e — sur mesure, mise en valeur, conservation.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'Artisanat',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <html lang="fr" className={`${instrumentSans.variable} ${cormorant.variable}`}>
      <body>
        <SiteLoader
          logoSrc={settings.logo?.src ?? ''}
          logoSrcDark={settings.logo?.srcDark ?? ''}
          logoWidth={settings.logo?.width ?? 120}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
