import { getRealisations } from '@/lib/content'
import RealisationsGrid from './RealisationsGrid'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Réalisations — Patine',
  description: 'Découvrez les réalisations de l\'atelier Patine, encadreur artisanal à Paris.',
}

export default async function RealisationsPage() {
  const content = await getRealisations()
  const sorted = [...content.photos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <div className="pt-20 pb-24">
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
