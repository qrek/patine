import Image from 'next/image'
import Link from 'next/link'
import { getHome, getSavoirFaire, getRealisations } from '@/lib/content'
import InstagramScroll from './InstagramScroll'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [c, sf, real] = await Promise.all([getHome(), getSavoirFaire(), getRealisations()])
  const sections  = sf.sections ?? []
  const photos    = [...(real.photos ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, 3)
  const instaFeed = c.instagramFeed ?? []
  const subtitleSize = c.hero.subtitleSize ?? 14

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
          <h1 className="font-power text-6xl md:text-8xl lg:text-9xl text-cream fade-in leading-[1.0]">
            {c.hero.title || "L'art d'encadrer"}
          </h1>
          <div className="mt-5 flex items-end justify-between">
            <p
              className="tracking-caps uppercase text-cream/70 fade-in-2"
              style={{ fontSize: subtitleSize }}
            >
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
          {c.intro.column1 && (
            <div
              className="text-[16px] leading-relaxed text-noir-soft rich-text"
              dangerouslySetInnerHTML={{ __html: c.intro.column1 }}
            />
          )}
          {c.intro.column2 && (
            <div
              className="text-[16px] leading-relaxed text-noir-soft rich-text"
              dangerouslySetInnerHTML={{ __html: c.intro.column2 }}
            />
          )}
        </div>
      </section>

      {/* ── Savoir-faire ── */}
      {sections.length > 0 && (
        <section className="border-t border-border">
          <div className="max-w-wide mx-auto px-6 lg:px-14 py-20 md:py-28">
            <p className="text-2xs tracking-caps uppercase text-muted mb-14">Notre Savoir-faire</p>
            <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
              {sections.map((s) => (
                <div key={s.id} className="py-10 md:py-0 md:px-10 first:pl-0 last:pr-0">
                  <h3 className="font-power text-xl text-noir mb-4">{s.title}</h3>
                  {s.body && (
                    <div
                      className="text-[14px] leading-relaxed text-noir-soft line-clamp-4 rich-text"
                      dangerouslySetInnerHTML={{ __html: s.body }}
                    />
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
          <div className="grid grid-cols-1 sm:grid-cols-3">
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
          <div className="max-w-wide mx-auto px-6 lg:px-14 py-8 border-t border-border">
            <Link href="/realisations" className="text-2xs tracking-caps uppercase text-noir border-b border-noir pb-0.5 hover:text-muted hover:border-muted transition-colors duration-200">
              Voir toutes les réalisations ↗
            </Link>
          </div>
        </section>
      )}

      {/* ── Instagram scroll ── */}
      {instaFeed.length > 0 && (
        <section className="border-t border-border py-16">
          <div className="px-6 lg:px-14 mb-8 flex items-end justify-between max-w-wide mx-auto">
            <p className="text-2xs tracking-caps uppercase text-muted">Instagram</p>
          </div>
          <InstagramScroll photos={instaFeed} />
        </section>
      )}
    </>
  )
}
