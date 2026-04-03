import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getSettings } from '@/lib/content'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()

  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer text={settings.footer} instagram={settings.instagram} />
    </>
  )
}
