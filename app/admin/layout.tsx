import AdminNav from './AdminNav'
import SessionProvider from './SessionProvider'

export const metadata = { title: 'Backoffice — Patine' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#F8F8F7] flex font-jost">
        <AdminNav />
        <div className="flex-1 md:pl-52">
          <main className="max-w-3xl mx-auto px-6 py-10">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  )
}
