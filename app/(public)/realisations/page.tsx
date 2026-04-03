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
    <div className="pt-28 pb-20">
      {/* Header */}
      <div className="text-center px-6 mb-16">
        <span className="accent-line mx-auto mb-8" />
        <h1
          className="font-cormorant italic text-5xl md:text-6xl font-light tracking-wider text-[#1A1A18]"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Réalisations
        </h1>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-20 text-[#1A1A18]/40">
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.25rem' }}>
            Les réalisations arrivent bientôt.
          </p>
        </div>
      ) : (
        <RealisationsGrid photos={sorted} />
      )}
    </div>
  )
}
