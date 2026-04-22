import Image from 'next/image'
import Link from 'next/link'
import { getHome, getSavoirFaire, getRealisations } from '@/lib/content'
import Reveal from '@/components/Reveal'
import HeroParallax from '@/components/HeroParallax'
import FloatingIntro from './FloatingIntro'
import InstagramScroll from './InstagramScroll'
import ScrollHint from '@/components/ScrollHint'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [c, sf, real] = await Promise.all([getHome(), getSavoirFaire(), getRealisations()])
  const allPhotos   = [...(real.photos ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const heroPhotos  = allPhotos.slice(0, 3)
  const floatPhotos = allPhotos.slice(0, 4)

  const subtitleSize  = c.hero.subtitleSize ?? 14
  const titleColor    = c.hero.titleColor   || '#F5F3EF'
  const titleSize     = c.hero.titleSize    ?? 9
  const titleWeight   = c.hero.titleWeight  ?? 400

  const feedPhotos = [...(c.instagramFeed ?? [])].sort(() => Math.random() - 0.5)

  const introHtml    = c.intro.column1 || ''
  const introText    = introHtml.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()

  const editorialRaw = (c.intro.column2 || '')
    .replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()
  const editorialText = editorialRaw.length > 220
    ? editorialRaw.slice(0, 220).trimEnd()
    : editorialRaw

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[88vh] flex flex-col overflow-hidden">
        {c.hero.image ? (
          <HeroParallax>
            <Image src={c.hero.image} alt="Atelier Patine" fill className="object-cover" priority />
          </HeroParallax>
        ) : (
          <div className="absolute inset-0 bg-[#D8D6D1]" />
        )}
        <div className="absolute inset-0 bg-noir/25" />
        {/* gradient hint vers le bas */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-noir/30 to-transparent pointer-events-none" />

        <div className="relative mt-auto px-5 lg:px-6 pb-14 w-full">
          <h1
            className="font-power fade-in leading-[1.0]"
            style={{
              color: titleColor,
              fontSize: `clamp(2.6rem, 9vw, ${titleSize}rem)`,
              fontWeight: titleWeight,
            }}
          >
            {c.hero.title || "L'art d'encadrer"}
          </h1>
          <div className="mt-5 flex items-end justify-between">
            <p className="tracking-caps uppercase text-cream/70 fade-in-2" style={{ fontSize: subtitleSize }}>
              {c.hero.subtitle || 'Atelier Patine — Paris'}
            </p>
            <ScrollHint />
          </div>
        </div>
      </section>

      {/* ── Intro — texte paragraphes ── */}
      {introHtml && (
        <section id="intro" className="bg-warm">
          <div className="max-w-wide mx-auto px-5 lg:px-6 py-20 md:py-32">
            <div className="grid md:grid-cols-2 gap-10 md:gap-24">
              <Reveal className="text-[16px] leading-relaxed text-noir-soft rich-text">
                <div dangerouslySetInnerHTML={{ __html: introHtml }} />
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ── Savoir-faire — texte éditorial ── */}
      {editorialText && (
        <section className="border-b border-border bg-cream overflow-hidden">
          <div className="px-5 lg:px-6 py-20 md:py-28 max-w-[1440px] mx-auto">
            <Reveal>
              <p className="text-2xs tracking-caps uppercase text-muted mb-10">Notre Savoir-faire</p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="font-cormorant text-[clamp(1.9rem,3.8vw,4.2rem)] text-noir leading-[1.18] max-w-[1100px]">
                {editorialText}
                {editorialRaw.length > 220 && (
                  <Link
                    href="/savoir-faire"
                    className="inline-block ml-2 text-[0.6em] tracking-caps uppercase text-muted border-b border-muted pb-0.5 hover:text-noir hover:border-noir transition-colors duration-200 align-middle"
                  >
                    En savoir plus ↗
                  </Link>
                )}
              </p>
            </Reveal>
            {editorialRaw.length <= 220 && (
              <Reveal delay={0.3} className="mt-10">
                <Link href="/savoir-faire" className="text-2xs tracking-caps uppercase text-noir border-b border-noir pb-0.5 hover:text-muted hover:border-muted transition-colors duration-200">
                  En savoir plus ↗
                </Link>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ── Intro flottante ── */}
      {introText && (
        <FloatingIntro text={introText} photos={floatPhotos} />
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
          <Reveal className="px-5 lg:px-6 py-8 border-t border-border">
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
