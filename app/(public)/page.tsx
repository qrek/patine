import Image from 'next/image'
import Link from 'next/link'
import { getHome } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const content = await getHome()

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {content.hero.image ? (
          <Image
            src={content.hero.image}
            alt="Atelier Patine"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[#D6D3CE]" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#1A1A18]/30" />

        {/* Text */}
        <div className="relative z-10 text-center text-white px-6">
          <h1
            className="font-cormorant italic text-6xl md:text-8xl lg:text-9xl font-light tracking-wider animate-fade-up"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {content.hero.title}
          </h1>
          <p
            className="mt-4 text-xs tracking-widest uppercase animate-fade-up-delay-1 text-white/70"
            style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
          >
            {content.hero.subtitle}
          </p>
          <Link
            href="#intro"
            className="inline-block mt-12 text-xs tracking-widest uppercase text-white/60 hover:text-white transition-colors duration-500 animate-fade-up-delay-2"
            style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
          >
            Découvrir ↓
          </Link>
        </div>
      </section>

      {/* ── Intro ── */}
      <section id="intro" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="accent-line mb-12 mx-auto" />
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 mt-12">
            {content.intro.column1 && (
              <p
                className="text-[15px] leading-[1.9] text-[#1A1A18]/80"
                style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
              >
                {content.intro.column1}
              </p>
            )}
            {content.intro.column2 && (
              <p
                className="text-[15px] leading-[1.9] text-[#1A1A18]/80"
                style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
              >
                {content.intro.column2}
              </p>
            )}
          </div>
          <div className="mt-16 text-center">
            <Link
              href="/savoir-faire"
              className="inline-block text-xs tracking-widest uppercase border border-[#1A1A18]/30 px-10 py-4 hover:border-[#B8A87A] hover:text-[#B8A87A] transition-all duration-500"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
            >
              Notre Savoir-faire
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
