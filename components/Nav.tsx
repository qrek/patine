'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/savoir-faire', label: 'Notre Savoir-faire' },
  { href: '/realisations',  label: 'Réalisations' },
  { href: '/contact',       label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname  = usePathname()
  const isHome    = pathname === '/'
  const transparent = isHome && !scrolled

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          transparent ? 'bg-transparent' : 'bg-cream border-b border-border'
        }`}
      >
        <div className="max-w-wide mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className={`font-cormorant text-[22px] tracking-tight leading-none transition-colors duration-300 ${
              transparent ? 'text-cream hover:text-cream/70' : 'text-noir hover:text-muted'
            }`}
          >
            Patine
          </Link>

          {/* Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-2xs tracking-caps uppercase transition-colors duration-300 ${
                  transparent
                    ? pathname.startsWith(l.href) ? 'text-cream' : 'text-cream/70 hover:text-cream'
                    : pathname.startsWith(l.href) ? 'text-noir'  : 'text-muted hover:text-noir'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Mobile burger */}
          <button
            className="md:hidden w-7 h-5 flex flex-col justify-between"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <span className={`block h-px transition-all duration-300 origin-center ${transparent ? 'bg-cream' : 'bg-noir'} ${menuOpen ? 'rotate-45 translate-y-[10px]' : ''}`} />
            <span className={`block h-px transition-all duration-200 ${transparent ? 'bg-cream' : 'bg-noir'} ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px transition-all duration-300 origin-center ${transparent ? 'bg-cream' : 'bg-noir'} ${menuOpen ? '-rotate-45 -translate-y-[10px]' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 bg-cream flex flex-col justify-center px-10 md:hidden transition-opacity duration-300 ${
        menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <nav className="space-y-6">
          {links.map(l => (
            <div key={l.href}>
              <Link
                href={l.href}
                className="font-cormorant text-4xl text-noir hover:text-muted transition-colors duration-200"
              >
                {l.label}
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}
