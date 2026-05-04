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

  // Clients ("Ils nous font confiance") — séparés en avec/sans logo
  const allClients     = (c.clients ?? []).filter(cl => cl?.name?.trim() || cl?.logo)
  const logoClients    = allClients.filter(cl => cl.logo)
  const textClients    = allClients.filter(cl => !cl.logo)
  const hasAnyClient   = allClients.length > 0

  // Normalise une URL : ajoute https:// si pas de protocole
  const normalizeUrl = (url?: string) => {
    if (!url?.trim()) return undefined
    const trimmed = url.trim()
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  }

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

      {/* ── Ils nous font confiance ── */}
      {hasAnyClient && (
        <section className="bg-cream border-t border-border">
          <div className="max-w-[1440px] mx-auto px-5 lg:px-12 py-20 md:py-28">
            <Reveal>
              <p className="text-2xs tracking-caps uppercase text-muted text-center mb-14">
                Ils nous font confiance
              </p>
            </Reveal>

            {/* Zone 1 : clients avec logo (mis en avant) */}
            {logoClients.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 lg:gap-x-14 gap-y-16 items-center">
                {logoClients.map((client, i) => {
                  const href = normalizeUrl(client.url)
                  const inner = (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={client.logo}
                      alt={client.name || ''}
                      className="max-h-14 max-w-[150px] w-auto object-contain grayscale opacity-55 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    />
                  )
                  return (
                    <Reveal key={client.id} delay={(i % 5) * 0.08} y={20}>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={client.name || 'Site du client'}
                          className="flex items-center justify-center h-24 group"
                        >
                          {inner}
                        </a>
                      ) : (
                        <div className="flex items-center justify-center h-24 group cursor-default">
                          {inner}
                        </div>
                      )}
                    </Reveal>
                  )
                })}
              </div>
            )}

            {/* Zone 2 : clients sans logo, en liste fluide */}
            {textClients.length > 0 && (
              <Reveal delay={0.2}>
                <ul className={`flex flex-wrap items-center justify-center gap-x-6 lg:gap-x-8 gap-y-4 ${logoClients.length > 0 ? 'mt-20 pt-12 border-t border-border' : ''}`}>
                  {textClients.map((client, i) => {
                    const href = normalizeUrl(client.url)
                    const label = (
                      <span className="relative font-power text-[11px] tracking-[0.26em] uppercase text-muted group-hover:text-noir transition-colors duration-500">
                        {client.name}
                        <span className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-px bg-gold group-hover:w-5 transition-all duration-500 ease-out" />
                      </span>
                    )
                    return (
                      <li key={client.id} className="flex items-center gap-x-6 lg:gap-x-8">
                        {i > 0 && (
                          <span aria-hidden className="text-muted/40 text-[10px] -ml-3 lg:-ml-4">•</span>
                        )}
                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-block py-1"
                          >
                            {label}
                          </a>
                        ) : (
                          <span className="group inline-block py-1 cursor-default">
                            {label}
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </Reveal>
            )}

            {allPhotos.length > 0 && (
              <Reveal delay={0.4} className="mt-16 pt-10 border-t border-border text-center">
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
