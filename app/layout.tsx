import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-jost',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  )
}
