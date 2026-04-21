import { getSavoirFaire } from '@/lib/content'
import SavoirFaireSection from './SavoirFaireSection'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Notre Savoir-faire — Patine' }

export default async function SavoirFairePage() {
  const data     = await getSavoirFaire()
  const heroImage = data.heroImage ?? ''
  const gallery   = data.gallery   ?? ['', '', '', '']
  const sections  = (data.sections ?? []).filter(s => s.title || s.body)

  // Associer une image à chaque section
  const imagePool = [heroImage, ...gallery].filter(Boolean)
  const getImage  = (i: number) => sections[i]?.image || imagePool[i % imagePool.length] || ''

  return (
    <div className="pt-16">

      {/* ── Sections éditoriales ── */}
      {sections.map((section, i) => (
        <SavoirFaireSection
          key={section.id}
          title={section.title}
          body={section.body}
          imageSrc={getImage(i)}
          index={i}
          total={sections.length}
          reversed={i % 2 !== 0}
          warm={i % 2 !== 0}
        />
      ))}


    </div>
  )
}
