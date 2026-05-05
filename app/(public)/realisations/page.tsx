import type { Metadata } from 'next'
import { getRealisations } from '@/lib/content'
import RealisationsGrid from './RealisationsGrid'
import { BreadcrumbsJsonLd } from '@/components/JsonLd'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Réalisations',
  description:
    "Découvrez les réalisations de l'atelier Patine : encadrements sur mesure d'œuvres d'art, photographies et objets, réalisés à Paris pour collectionneurs, galeries et institutions.",
  alternates: { canonical: '/realisations' },
  openGraph: {
    title: 'Réalisations — Atelier Patine',
    description:
      "Encadrements sur mesure réalisés par l'atelier Patine à Paris.",
    url: 'https://atelier-patine.fr/realisations',
    type: 'website',
  },
}

export default async function RealisationsPage() {
  const content = await getRealisations()
  const sorted = [...content.photos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <div className="pt-20 pb-24">
      <BreadcrumbsJsonLd
        items={[
          { name: 'Accueil', path: '/' },
          { name: 'Réalisations', path: '/realisations' },
        ]}
      />
      <h1 className="sr-only">
        Réalisations — encadrements sur mesure réalisés à Paris
      </h1>
      {sorted.length === 0 ? (
        <div className="text-center py-32 text-noir/30">
          <p className="font-cormorant text-xl">Les réalisations arrivent bientôt.</p>
        </div>
      ) : (
        <RealisationsGrid photos={sorted} />
      )}
    </div>
  )
}
