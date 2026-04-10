import { getSavoirFaire } from '@/lib/content'
import SavoirFaireSection from './SavoirFaireSection'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Notre Savoir-faire — Patine' }

export default async function SavoirFairePage() {
  const data     = await getSavoirFaire()
  const heroImage = data.heroImage ?? ''
  const gallery   = data.gallery   ?? ['', '', '', '']
  const sections  = (data.sections ?? []).filter(s => s.title || s.body)

  // Associer une image à chaque section
  const imagePool = [heroImage, ...gallery].filter(Boolean)
  const getImage  = (i: number) => sections[i]?.image || imagePool[i % imagePool.length] || ''

  return (
    <div className="pt-16">

      {/* ── Sections éditoriales ── */}
      {sections.map((section, i) => (
        <SavoirFaireSection
          key={section.id}
          title={section.title}
          body={section.body}
          imageSrc={getImage(i)}
          index={i}
          total={sections.length}
          reversed={i % 2 !== 0}
          warm={i % 2 !== 0}
        />
      ))}

      {/* ── Frise galerie ── */}
      {gallery.some(Boolean) && (
        <section className="grid grid-cols-2 md:grid-cols-4 border-t border-border">
          {gallery.slice(0, 4).map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden bg-[#E0DEDB]">
              {src ? (
                <img
                  src={src}
                  alt={`Galerie ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-[#D8D6D1]" />
              )}
            </div>
          ))}
        </section>
      )}

    </div>
  )
}
