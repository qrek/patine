import { getSavoirFaire } from '@/lib/content'
import SavoirFaireScroll from './SavoirFaireScroll'
import Reveal from '@/components/Reveal'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Notre Savoir-faire — Patine' }

export default async function SavoirFairePage() {
  const data      = await getSavoirFaire()
  const pageTitle  = data.pageTitle || "L'art de l'encadrement"
  const heroImage  = data.heroImage  ?? ''
  const gallery    = data.gallery    ?? ['', '', '', '']
  const sections   = (data.sections  ?? []).filter(s => s.title || s.body)

  return (
    <div>
      {/* ── En-tête ── */}
      <section className="pt-32 pb-20 px-8 lg:px-16 border-b border-border">
        <Reveal>
          <p className="text-2xs tracking-caps uppercase text-muted mb-6">Notre Savoir-faire</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-power text-6xl md:text-7xl lg:text-8xl text-noir leading-[1.0]">
            {pageTitle}
          </h1>
        </Reveal>
      </section>

      {/* ── Scroll 2 panneaux ── */}
      {sections.length > 0 && (
        <SavoirFaireScroll
          sections={sections}
          heroImage={heroImage}
          gallery={gallery}
        />
      )}

      {/* ── Frise galerie ── */}
      {gallery.some(Boolean) && (
        <section className="grid grid-cols-2 md:grid-cols-4 border-t border-border">
          {gallery.slice(0, 4).map((src, i) => (
            <div key={i} className="relative aspect-square bg-[#E0DEDB] overflow-hidden">
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
