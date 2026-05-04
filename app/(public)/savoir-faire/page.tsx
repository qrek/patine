import { getSavoirFaire } from '@/lib/content'
import SavoirFaireSection from './SavoirFaireSection'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Notre Savoir-faire — Patine' }

export default async function SavoirFairePage() {
  const data      = await getSavoirFaire()
  const heroImage = data.heroImage ?? ''
  const gallery   = (data.gallery ?? []).filter(Boolean)
  const sections  = (data.sections ?? []).filter(s => s.title || s.body)

  // Pool de photos secondaires (galerie + hero)
  const sharedPool = [heroImage, ...gallery].filter(Boolean)

  // 2 photos secondaires par section, en évitant la principale et en variant
  const buildExtras = (sectionImage: string, i: number): string[] => {
    const pool = sharedPool.filter(src => src !== sectionImage)
    if (pool.length === 0) return []
    return [
      pool[i % pool.length],
      pool[(i + 1) % pool.length],
    ].filter(Boolean)
  }

  return (
    <div className="pt-16">
      {sections.map((section, i) => {
        const mainImage = section.image || sharedPool[i % Math.max(sharedPool.length, 1)] || ''
        const extras    = buildExtras(mainImage, i)
        return (
          <SavoirFaireSection
            key={section.id}
            title={section.title}
            body={section.body}
            imageSrc={mainImage}
            extras={extras}
            index={i}
            total={sections.length}
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
