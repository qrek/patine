import Image from 'next/image'
import Link from 'next/link'
import { getHome } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const c = await getHome()

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-screen flex flex-col">
        {/* Image de fond */}
        {c.hero.image ? (
          <Image src={c.hero.image} alt="Atelier Patine" fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-[#D8D6D1]" />
        )}
        <div className="absolute inset-0 bg-noir/20" />

        {/* Titre en bas à gauche — style éditorial */}
        <div className="relative mt-auto px-6 lg:px-10 pb-12 max-w-wide mx-auto w-full">
          <h1 className="font-cormorant text-5xl md:text-7xl lg:text-8xl text-cream fade-in leading-[1.0]">
            {c.hero.title}
          </h1>
          <div className="mt-5 flex items-end justify-between">
            <p className="text-2xs tracking-caps uppercase text-cream/70 fade-in-2">
              {c.hero.subtitle}
            </p>
            <Link
              href="#intro"
              className="text-2xs tracking-caps uppercase text-cream/60 hover:text-cream transition-colors duration-200 fade-in-3"
            >
              Découvrir ↓
            </Link>
          </div>
        </div>
      </section>

      {/* ── Ligne règle ── */}
      <span className="rule" />

      {/* ── Intro ── */}
      <section id="intro" className="max-w-wide mx-auto px-6 lg:px-10 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 md:gap-20">
          {c.intro.column1 && (
            <p className="text-[15px] leading-relaxed text-noir-soft">{c.intro.column1}</p>
          )}
          {c.intro.column2 && (
            <p className="text-[15px] leading-relaxed text-noir-soft">{c.intro.column2}</p>
          )}
        </div>
        <div className="mt-16 border-t border-border pt-10 flex gap-6">
          <Link
            href="/savoir-faire"
            className="text-2xs tracking-caps uppercase text-noir border-b border-noir pb-0.5 hover:text-muted hover:border-muted transition-colors duration-200"
          >
            Notre Savoir-faire ↗
          </Link>
          <Link
            href="/realisations"
            className="text-2xs tracking-caps uppercase text-noir border-b border-noir pb-0.5 hover:text-muted hover:border-muted transition-colors duration-200"
          >
            Réalisations ↗
          </Link>
        </div>
      </section>
    </>
  )
}
