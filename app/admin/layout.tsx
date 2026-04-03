import AdminNav from './AdminNav'
import SessionProvider from './SessionProvider'

export const metadata = {
  title: 'Backoffice — Patine',
}

// La protection est assurée par middleware.ts (next-auth/middleware)
// qui redirige vers /admin/login si non authentifié.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <AdminNav />
        <main className="flex-1 p-6 md:p-10 ml-0 md:ml-56">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
