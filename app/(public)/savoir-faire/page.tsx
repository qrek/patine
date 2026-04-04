import Image from 'next/image'
import { getSavoirFaire } from '@/lib/content'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Notre Savoir-faire — Patine' }

export default async function SavoirFairePage() {
  const data = await getSavoirFaire()
  const heroImage = data.heroImage ?? ''
  const gallery   = data.gallery   ?? ['', '', '', '']
  const sections  = data.sections  ?? []

  return (
    <div>
      {/* ── Hero : split écran ── */}
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Gauche — texte */}
        <div className="flex flex-col justify-between px-8 lg:px-16 pt-32 pb-14 bg-cream">
          <div>
            <p className="text-2xs tracking-caps uppercase text-muted mb-6">Notre Savoir-faire</p>
            <h1 className="font-cormorant text-5xl md:text-6xl lg:text-7xl text-noir leading-[1.05]">
              L'art de<br />l'encadrement
            </h1>
          </div>
          {sections[0]?.body && (
            <p className="text-[15px] leading-relaxed text-noir-soft max-w-[480px] mt-auto pt-16">
              {sections[0].body}
            </p>
          )}
        </div>

        {/* Droite — grande image */}
        <div className="relative h-[60vh] lg:h-auto bg-[#D8D6D1] overflow-hidden">
          {heroImage ? (
            <Image
              src={heroImage}
              alt="Savoir-faire Patine"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-[#D8D6D1]" />
          )}
        </div>
      </section>

      {/* ── Frise de 4 petites photos ── */}
      <section className="grid grid-cols-2 md:grid-cols-4">
        {(gallery.slice(0, 4).concat(['', '', '', '']).slice(0, 4)).map((src, i) => (
          <div key={i} className="relative aspect-square bg-[#E0DEDB] overflow-hidden">
            {src ? (
              <Image
                src={src}
                alt={`Galerie ${i + 1}`}
                fill
                className="object-cover hover:scale-[1.04] transition-transform duration-700"
                sizes="(max-width:768px) 50vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 bg-[#D8D6D1]" />
            )}
          </div>
        ))}
      </section>

      {/* ── Sections de texte ── */}
      {sections.slice(1).map((section, i) => (
        <article key={section.id} className="border-t border-border">
          <div className="max-w-wide mx-auto px-8 lg:px-16 py-16 md:py-20">
            <div className="grid md:grid-cols-[160px_1fr] gap-10">
              <p className="text-2xs tracking-caps uppercase text-muted pt-1">0{i + 2}</p>
              <div>
                <h2 className="font-cormorant text-3xl md:text-4xl text-noir mb-6">
                  {section.title}
                </h2>
                <p className="text-[15px] leading-relaxed text-noir-soft max-w-[560px]">
                  {section.body}
                </p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
