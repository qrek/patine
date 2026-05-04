import Image from 'next/image'
import Link from 'next/link'
import { getHome, getSavoirFaire, getRealisations } from '@/lib/content'
import Reveal from '@/components/Reveal'
import HeroParallax from '@/components/HeroParallax'
import FloatingIntro from './FloatingIntro'
import InstagramScroll from './InstagramScroll'
import ScrollHint from '@/components/ScrollHint'

export const dynamic = 'force-dynamic'

// Mélange Fisher–Yates
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default async function HomePage() {
  const [c, sf, real] = await Promise.all([getHome(), getSavoirFaire(), getRealisations()])
  const allPhotos   = real.photos ?? []
  // Photos flottantes : tirage aléatoire à chaque chargement
  const floatPhotos = shuffle(allPhotos).slice(0, 4)

  const subtitleSize  = c.hero.subtitleSize ?? 14
  const titleColor    = c.hero.titleColor   || '#F5F3EF'
  const titleSize     = c.hero.titleSize    ?? 9
  const titleWeight   = c.hero.titleWeight  ?? 400

  const feedPhotos = shuffle(c.instagramFeed ?? [])

  const introHtml    = c.intro.column1 || ''
  const introText    = introHtml.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()

  // Mise en forme citation
  const introSize   = c.intro.size   ?? 96
  const introFont   = c.intro.font   ?? 'power'
  const introItalic = c.intro.italic ?? false
  const introAlign  = c.intro.align  ?? 'center'
  const introQuoted = c.intro.quoted ?? false

  const editorialRaw = (c.intro.column2 || '')
    .replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()
  const editorialText = editorialRaw.length > 220
    ? editorialRaw.slice(0, 220).trimEnd()
    : editorialRaw

  // Paragraphes éditoriaux : valeurs par défaut si non remplies dans l'admin
  const paragraphsDefault = [
    { id: 'p1', text: 'Un travail d\'orfèvre, mené à la main, baguette après baguette.' },
    { id: 'p2', text: 'Des matières nobles, choisies pour leur grain, leur tenue, leur lumière.' },
    { id: 'p3', text: 'Une attention portée à chaque détail, du premier coup d\'œil à la pose finale.' },
  ]
  const savedParagraphs = (c.paragraphs ?? []).filter(p => p?.text?.trim())
  const paragraphs = savedParagraphs.length > 0 ? savedParagraphs : paragraphsDefault

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
        <FloatingIntro
          text={introText}
          photos={floatPhotos}
          size={introSize}
          font={introFont}
          italic={introItalic}
          align={introAlign}
          quoted={introQuoted}
        />
      )}

      {/* ── 3 paragraphes éditoriaux ── */}
      {paragraphs.length > 0 && (
        <section className="bg-cream border-t border-border">
          <div className="max-w-[1440px] mx-auto px-5 lg:px-12 py-24 md:py-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-14 gap-y-14">
              {paragraphs.slice(0, 3).map((p, i) => (
                <Reveal key={p.id} delay={i * 0.18} y={32}>
                  <div className="flex flex-col items-start">
                    <span className="font-power text-[11px] tracking-[0.32em] uppercase text-muted mb-6">
                      — {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="font-cormorant italic text-[clamp(1.35rem,1.6vw,1.75rem)] text-noir leading-[1.45] tracking-[-0.005em] max-w-[34ch]">
                      {p.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            {allPhotos.length > 0 && (
              <Reveal delay={0.4} className="mt-16 pt-10 border-t border-border">
                <Link href="/realisations" className="text-2xs tracking-caps uppercase text-noir border-b border-noir pb-0.5 hover:text-muted hover:border-muted transition-colors duration-200">
                  Voir toutes les réalisations ↗
                </Link>
              </Reveal>
            )}
          </div>
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
