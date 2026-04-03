import Image from 'next/image'
import { getSavoirFaire } from '@/lib/content'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Notre Savoir-faire — Patine',
}

export default async function SavoirFairePage() {
  const { sections } = await getSavoirFaire()

  return (
    <div className="pt-14">
      {/* En-tête */}
      <div className="max-w-wide mx-auto px-6 lg:px-10 pt-16 pb-10 border-b border-border">
        <p className="text-2xs tracking-caps uppercase text-muted mb-4">Notre Savoir-faire</p>
        <h1 className="font-cormorant text-5xl md:text-6xl text-noir">
          L'art de l'encadrement
        </h1>
      </div>

      {/* Sections */}
      {sections.map((section, i) => (
        <article key={section.id}>
          {/* Photo pleine largeur */}
          <div className="w-full aspect-[16/7] relative bg-border overflow-hidden">
            {section.image ? (
              <Image src={section.image} alt={section.title} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-[#D8D6D1]" />
            )}
          </div>

          {/* Texte */}
          <div className="max-w-wide mx-auto px-6 lg:px-10 py-14 border-b border-border">
            <div className="grid md:grid-cols-[200px_1fr] gap-10">
              <div>
                <p className="text-2xs tracking-caps uppercase text-muted">0{i + 1}</p>
              </div>
              <div>
                <h2 className="font-cormorant text-3xl md:text-4xl text-noir mb-6">
                  {section.title}
                </h2>
                <p className="text-[15px] leading-relaxed text-noir-soft max-w-[540px]">
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
