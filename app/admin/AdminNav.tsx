'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/admin', label: 'Accueil', icon: '⌂' },
  { href: '/admin/accueil', label: 'Page d\'accueil', icon: '✦' },
  { href: '/admin/savoir-faire', label: 'Savoir-faire', icon: '◈' },
  { href: '/admin/realisations', label: 'Réalisations', icon: '⊞' },
  { href: '/admin/parametres', label: 'Paramètres', icon: '⚙' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-white border-r border-gray-200 flex flex-col z-20 hidden md:flex">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-100">
        <Link
          href="/"
          target="_blank"
          className="font-cormorant italic text-xl text-[#1A1A18]"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Patine
        </Link>
        <p className="text-[10px] text-gray-400 mt-0.5 tracking-widest uppercase">
          Backoffice
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors duration-200 ${
                    isActive
                      ? 'bg-[#1A1A18] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Déconnexion */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-gray-500 hover:bg-gray-100 transition-colors duration-200"
        >
          <span>↩</span>
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
