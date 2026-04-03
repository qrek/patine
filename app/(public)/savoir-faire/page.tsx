import Image from 'next/image'
import { getSavoirFaire } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Notre Savoir-faire — Patine',
  description: 'Découvrez le savoir-faire artisanal de l\'atelier Patine : choix des matières, processus, clientèle.',
}

export default async function SavoirFairePage() {
  const content = await getSavoirFaire()

  return (
    <div className="pt-32 pb-28">
      {/* Header */}
      <div className="text-center px-6 mb-24">
        <span className="accent-line mx-auto mb-8" />
        <h1
          className="font-cormorant italic text-5xl md:text-6xl font-light tracking-wider text-[#1A1A18]"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Notre Savoir-faire
        </h1>
      </div>

      {/* Sections */}
      <div className="max-w-[680px] mx-auto px-6 space-y-28">
        {content.sections.map((section, i) => (
          <article key={section.id} className="animate-fade-up">
            {/* Section photo */}
            {section.image && (
              <figure className="w-screen relative left-1/2 -translate-x-1/2 mb-12 h-[50vh] md:h-[60vh] overflow-hidden">
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  className="object-cover"
                />
              </figure>
            )}
            {!section.image && (
              <figure className="w-screen relative left-1/2 -translate-x-1/2 mb-12 h-[50vh] md:h-[60vh] bg-[#D6D3CE]" />
            )}

            {/* Numéro */}
            <p
              className="text-xs tracking-widest uppercase text-[#B8A87A] mb-3"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
            >
              0{i + 1}
            </p>

            {/* Titre */}
            <h2
              className="font-cormorant text-3xl md:text-4xl font-light tracking-wide text-[#1A1A18] mb-6"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {section.title}
            </h2>

            <span className="accent-line mb-8" />

            {/* Corps */}
            <p
              className="mt-8 text-[15px] leading-[1.9] text-[#1A1A18]/80"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
            >
              {section.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}
