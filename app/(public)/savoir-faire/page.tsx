import type { Metadata } from 'next'
import { getSavoirFaire } from '@/lib/content'
import SavoirFaireSection from './SavoirFaireSection'
import { BreadcrumbsJsonLd } from '@/components/JsonLd'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Notre savoir-faire',
  description:
    "Le savoir-faire de l'atelier Patine : encadrement sur mesure, choix des matières (baguettes bois massif, passepartouts muséaux, verres conservation UV), processus artisanal et clientèle d'exception à Paris.",
  alternates: { canonical: '/savoir-faire' },
  openGraph: {
    title: 'Savoir-faire — Atelier Patine',
    description:
      "Encadrement artisanal sur mesure à Paris : matières nobles, processus et clientèle d'exception.",
    url: 'https://atelier-patine.fr/savoir-faire',
    type: 'article',
  },
}

export default async function SavoirFairePage() {
  const data      = await getSavoirFaire()
  const heroImage = data.heroImage ?? ''
  const gallery   = (data.gallery ?? []).filter(Boolean)
  const sections  = (data.sections ?? []).filter(s => s.title || s.body)

  // Pool d'images de secours (galerie + hero) si une section n'a pas la sienne
  const fallbackPool = [heroImage, ...gallery].filter(Boolean)

  return (
    <div className="pt-16">
      <BreadcrumbsJsonLd
        items={[
          { name: 'Accueil', path: '/' },
          { name: 'Savoir-faire', path: '/savoir-faire' },
        ]}
      />
      <h1 className="sr-only">
        Notre savoir-faire — atelier d&apos;encadrement à Paris
      </h1>
      {sections.map((section, i) => {
        const imageSrc = section.image || fallbackPool[i % Math.max(fallbackPool.length, 1)] || ''
        return (
          <SavoirFaireSection
            key={section.id}
            title={section.title}
            body={section.body}
            imageSrc={imageSrc}
            reversed={i % 2 !== 0}
            warm={i % 2 !== 0}
            textSize={section.textSize}
            textAlign={section.textAlign}
            textWidth={section.textWidth}
          />
        )
      })}
    </div>
  )
}
