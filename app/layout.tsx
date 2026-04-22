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
  title: 'Patine — Atelier d\'encadrement artisanal à Paris',
  description: 'Patine est un studio d\'encadrement artisanal haut de gamme à Paris. Baguettes en bois massif, passepartouts muséaux, verres conservation UV.',
  openGraph: {
    title: 'Patine — Atelier d\'encadrement artisanal à Paris',
    description: 'Encadrement artisanal haut de gamme à Paris',
    locale: 'fr_FR',
    type: 'website',
  },
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
