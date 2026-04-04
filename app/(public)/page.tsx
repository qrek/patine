import Image from 'next/image'
import Link from 'next/link'
import { getHome, getSavoirFaire, getRealisations } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [c, sf, real] = await Promise.all([getHome(), getSavoirFaire(), getRealisations()])
  const sections = sf.sections ?? []
  const photos   = [...(real.photos ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, 3)

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-screen flex flex-col">
        {c.hero.image ? (
          <Image src={c.hero.image} alt="Atelier Patine" fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-[#D8D6D1]" />
        )}
        <div className="absolute inset-0 bg-noir/25" />

        <div className="relative mt-auto px-6 lg:px-14 pb-14 max-w-wide mx-auto w-full">
          <h1 className="font-cormorant text-6xl md:text-8xl lg:text-9xl text-cream fade-in leading-[1.0]">
            {c.hero.title || "L'art d'encadrer"}
          </h1>
          <div className="mt-6 flex items-end justify-between">
            <p className="text-2xs tracking-caps uppercase text-cream/70 fade-in-2">
              {c.hero.subtitle || 'Atelier Patine — Paris'}
            </p>
            <Link href="#intro" className="text-2xs tracking-caps uppercase text-cream/60 hover:text-cream transition-colors duration-200 fade-in-3">
              Découvrir ↓
            </Link>
          </div>
        </div>
      </section>

      {/* ── Intro ── */}
      <section id="intro" className="max-w-wide mx-auto px-6 lg:px-14 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-10 md:gap-24">
          <p className="text-[16px] leading-relaxed text-noir-soft">{c.intro.column1}</p>
          <p className="text-[16px] leading-relaxed text-noir-soft">{c.intro.column2}</p>
        </div>
        <div className="mt-14 border-t border-border pt-10 flex gap-8">
          <Link href="/savoir-faire" className="text-2xs tracking-caps uppercase text-noir border-b border-noir pb-0.5 hover:text-muted hover:border-muted transition-colors duration-200">
            Notre Savoir-faire ↗
          </Link>
          <Link href="/realisations" className="text-2xs tracking-caps uppercase text-noir border-b border-noir pb-0.5 hover:text-muted hover:border-muted transition-colors duration-200">
            Réalisations ↗
          </Link>
        </div>
      </section>

      {/* ── Savoir-faire ── */}
      {sections.length > 0 && (
        <section className="border-t border-border">
          <div className="max-w-wide mx-auto px-6 lg:px-14 py-20 md:py-28">
            <p className="text-2xs tracking-caps uppercase text-muted mb-14">Notre Savoir-faire</p>
            <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
              {sections.map((s, i) => (
                <div key={s.id} className="py-10 md:py-0 md:px-10 first:pl-0 last:pr-0">
                  <p className="text-2xs tracking-caps uppercase text-muted mb-5">0{i + 1}</p>
                  <h3 className="font-cormorant text-2xl text-noir mb-4">{s.title}</h3>
                  {s.body && (
                    <p className="text-[14px] leading-relaxed text-noir-soft line-clamp-4">{s.body}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-14 pt-10 border-t border-border">
              <Link href="/savoir-faire" className="text-2xs tracking-caps uppercase text-noir border-b border-noir pb-0.5 hover:text-muted hover:border-muted transition-colors duration-200">
                En savoir plus ↗
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Réalisations preview ── */}
      {photos.length > 0 && (
        <section className="border-t border-border">
          <div className="px-0">
            <div className={`grid ${photos.length === 1 ? 'grid-cols-1' : photos.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-[4/5] overflow-hidden bg-[#D8D6D1] group">
                  <Image
                    src={photo.src}
                    alt={photo.title || ''}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
            <div className="max-w-wide mx-auto px-6 lg:px-14 py-10 border-t border-border">
              <Link href="/realisations" className="text-2xs tracking-caps uppercase text-noir border-b border-noir pb-0.5 hover:text-muted hover:border-muted transition-colors duration-200">
                Voir toutes les réalisations ↗
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Contact CTA ── */}
      <section className="border-t border-border bg-noir">
        <div className="max-w-wide mx-auto px-6 lg:px-14 py-24 md:py-36 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <h2 className="font-cormorant text-5xl md:text-6xl lg:text-7xl text-cream leading-[1.05] max-w-lg">
            Un projet d'encadrement&nbsp;?
          </h2>
          <Link
            href="/contact"
            className="inline-block text-2xs tracking-caps uppercase border-b border-cream/60 pb-0.5 text-cream/70 hover:text-cream hover:border-cream transition-colors duration-200 whitespace-nowrap"
          >
            Nous contacter ↗
          </Link>
        </div>
      </section>
    </>
  )
}
