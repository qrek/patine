import Image from 'next/image'
import Link from 'next/link'
import { getHome, getSavoirFaire, getRealisations } from '@/lib/content'
import Reveal from '@/components/Reveal'
import HeroParallax from '@/components/HeroParallax'
import FloatingIntro from './FloatingIntro'
import InstagramScroll from './InstagramScroll'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [c, sf, real] = await Promise.all([getHome(), getSavoirFaire(), getRealisations()])
  const sections   = sf.sections ?? []
  const allPhotos  = [...(real.photos ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const heroPhotos = allPhotos.slice(0, 3)      // pour la grille réalisations
  const floatPhotos = allPhotos.slice(0, 4)     // pour les photos flottantes
  const subtitleSize = c.hero.subtitleSize ?? 14
  const titleColor   = c.hero.titleColor || '#F5F3EF'

  // Bandeau photos : mélange aléatoire de l'instagramFeed
  const feedPhotos = [...(c.instagramFeed ?? [])].sort(() => Math.random() - 0.5)

  // Texte d'intro — strip HTML pour l'affichage en gros plan
  const introText = (c.intro.column1 || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-screen flex flex-col overflow-hidden">
        {c.hero.image ? (
          <HeroParallax>
            <Image src={c.hero.image} alt="Atelier Patine" fill className="object-cover" priority />
          </HeroParallax>
        ) : (
          <div className="absolute inset-0 bg-[#D8D6D1]" />
        )}
        <div className="absolute inset-0 bg-noir/25" />

        <div className="relative mt-auto px-5 lg:px-8 pb-14 max-w-wide mx-auto w-full">
          <h1 className="font-power text-[clamp(2.6rem,9vw,9rem)] fade-in leading-[1.0]" style={{ color: titleColor }}>
            {c.hero.title || "L'art d'encadrer"}
          </h1>
          <div className="mt-5 flex items-end justify-between">
            <p className="tracking-caps uppercase text-cream/70 fade-in-2" style={{ fontSize: subtitleSize }}>
              {c.hero.subtitle || 'Atelier Patine — Paris'}
            </p>
            <Link href="#intro" className="text-cream/60 hover:text-cream transition-colors duration-200 fade-in-3 text-xl leading-none">
              ↓
            </Link>
          </div>
        </div>
      </section>

      {/* ── Intro flottante ── */}
      {introText && (
        <FloatingIntro text={introText} photos={floatPhotos} />
      )}

      {/* ── Savoir-faire ── */}
      {sections.length > 0 && (
        <section className="border-t border-border">
          <div className="max-w-wide mx-auto px-5 lg:px-8 py-20 md:py-28">
            <Reveal>
              <p className="text-2xs tracking-caps uppercase text-muted mb-14">Notre Savoir-faire</p>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
              {sections.map((s, i) => (
                <Reveal key={s.id} delay={i * 0.14} className="py-10 md:py-0 md:px-10 first:pl-0 last:pr-0">
                  <h3 className="font-power text-xl text-noir mb-4">{s.title}</h3>
                  {s.body && (
                    <div
                      className="text-[14px] leading-relaxed text-noir-soft line-clamp-4 rich-text"
                      dangerouslySetInnerHTML={{ __html: s.body }}
                    />
                  )}
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2} className="mt-14 pt-10 border-t border-border">
              <Link href="/savoir-faire" className="text-2xs tracking-caps uppercase text-noir border-b border-noir pb-0.5 hover:text-muted hover:border-muted transition-colors duration-200">
                En savoir plus ↗
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Réalisations preview ── */}
      {heroPhotos.length > 0 && (
        <section className="border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {heroPhotos.map((photo, i) => (
              <Reveal key={photo.id} delay={i * 0.12} className="relative aspect-[4/5] overflow-hidden bg-[#D8D6D1] group">
                <Image
                  src={photo.src}
                  alt={photo.title || ''}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </Reveal>
            ))}
          </div>
          <Reveal className="max-w-wide mx-auto px-5 lg:px-8 py-8 border-t border-border">
            <Link href="/realisations" className="text-2xs tracking-caps uppercase text-noir border-b border-noir pb-0.5 hover:text-muted hover:border-muted transition-colors duration-200">
              Voir toutes les réalisations ↗
            </Link>
          </Reveal>
        </section>
      )}

      {/* ── Bandeau photos ── */}
      {feedPhotos.length > 0 && (
        <section className="border-t border-border py-5">
          <InstagramScroll photos={feedPhotos} />
        </section>
      )}
    </>
  )
}
