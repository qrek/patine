import { getSavoirFaire, getSettings } from '@/lib/content'
import SavoirFaireScroll from './SavoirFaireScroll'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Notre Savoir-faire — Patine' }

export default async function SavoirFairePage() {
  const [data, settings] = await Promise.all([getSavoirFaire(), getSettings()])
  const heroImage = data.heroImage ?? ''
  const gallery   = data.gallery   ?? ['', '', '', '']
  const sections  = (data.sections ?? []).filter(s => s.title || s.body)

  return (
    <div className="pt-16">
      <SavoirFaireScroll
        sections={sections}
        heroImage={heroImage}
        gallery={gallery}
        footerSettings={settings}
      />
    </div>
  )
}
