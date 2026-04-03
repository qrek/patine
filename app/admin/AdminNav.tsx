'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/admin',             label: 'Tableau de bord', exact: true  },
  { href: '/admin/accueil',     label: 'Accueil'                        },
  { href: '/admin/savoir-faire',label: 'Savoir-faire'                   },
  { href: '/admin/realisations',label: 'Réalisations'                   },
  { href: '/admin/parametres',  label: 'Paramètres'                     },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 w-52 bg-white border-r border-gray-100 flex flex-col hidden md:flex">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <Link href="/" target="_blank" className="block">
          <span className="font-cormorant text-[18px] text-gray-900 leading-none">Patine</span>
          <span className="block text-[10px] tracking-widest uppercase text-gray-400 mt-0.5">Backoffice</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3 overflow-y-auto">
        {navItems.map(item => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center h-9 px-3 rounded-md text-[13px] transition-colors duration-150 mb-0.5 ${
                active
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Voir le site + déconnexion */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center h-9 px-3 rounded-md text-[13px] text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-150"
        >
          Voir le site ↗
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center h-9 px-3 rounded-md text-[13px] text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-150"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
