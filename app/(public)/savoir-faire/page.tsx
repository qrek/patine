import { getSavoirFaire } from '@/lib/content'
import SavoirFaireSection from './SavoirFaireSection'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Notre Savoir-faire — Patine' }

export default async function SavoirFairePage() {
  const data      = await getSavoirFaire()
  const heroImage = data.heroImage ?? ''
  const gallery   = (data.gallery ?? []).filter(Boolean)
  const sections  = (data.sections ?? []).filter(s => s.title || s.body)

  // Pool d'images de secours (galerie + hero) si une section n'a pas la sienne
  const fallbackPool = [heroImage, ...gallery].filter(Boolean)

  return (
    <div className="pt-16">
      {sections.map((section, i) => {
        const imageSrc = section.image || fallbackPool[i % Math.max(fallbackPool.length, 1)] || ''
        return (
          <SavoirFaireSection
            key={section.id}
            title={section.title}
            body={section.body}
            imageSrc={imageSrc}
            index={i}
            total={sections.length}
            reversed={i % 2 !== 0}
            warm={i % 2 !== 0}
            textSize={section.textSize}
            textAlign={section.textAlign}
            textWidth={section.textWidth}
          />
        )
      })}
    </div>
  )
}
