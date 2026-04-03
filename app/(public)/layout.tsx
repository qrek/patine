import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getSettings } from '@/lib/content'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings()
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer
        text={s.footer}
        instagram={s.instagram}
        email={s.email}
        phone={s.phone}
        address={s.address}
      />
    </div>
  )
}
