import Nav from '@/components/Nav'
import FooterConditional from './FooterConditional'
import { getSettings } from '@/lib/content'
import { SiteJsonLd } from '@/components/JsonLd'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings()
  return (
    <div className="flex flex-col min-h-screen">
      <SiteJsonLd settings={s} />
      <Nav logoSrc={s.logo?.src ?? ''} logoSrcDark={s.logo?.srcDark ?? ''} logoWidth={s.logo?.width ?? 100} />
      <main className="flex-1">{children}</main>
      <FooterConditional
        text={s.footer}
        instagram={s.instagram}
        linkedin={s.linkedin}
        email={s.email}
        phone={s.phone}
        hours={s.hours}
        address={s.address}
        logoSrc={s.logo?.src ?? ''}
        logoWidth={s.logo?.width ?? 100}
      />
    </div>
  )
}
