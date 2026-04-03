'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { href: '/savoir-faire', label: 'Notre Savoir-faire' },
    { href: '/realisations', label: 'Réalisations' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHome
            ? 'bg-[#F7F5F2] shadow-none'
            : 'bg-transparent'
        }`}
      >
        {/* Ligne accent au scroll */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-px bg-[#B8A87A] transition-opacity duration-500 ${
            scrolled || !isHome ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <nav className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-cormorant italic text-2xl tracking-tight text-[#1A1A18] hover:text-[#B8A87A] transition-colors duration-300"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Patine
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-xs tracking-widest uppercase transition-colors duration-300 hover:text-[#B8A87A] ${
                    pathname === link.href
                      ? 'text-[#B8A87A]'
                      : 'text-[#1A1A18]'
                  }`}
                  style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span
              className={`block w-6 h-px bg-[#1A1A18] transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-[7px]' : ''
              }`}
            />
            <span
              className={`block w-6 h-px bg-[#1A1A18] transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-px bg-[#1A1A18] transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#F7F5F2] flex flex-col items-center justify-center transition-all duration-500 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ul className="flex flex-col items-center gap-10">
          {navLinks.map((link, i) => (
            <li key={link.href} style={{ transitionDelay: `${i * 80}ms` }}>
              <Link
                href={link.href}
                className="font-cormorant italic text-3xl text-[#1A1A18] hover:text-[#B8A87A] transition-colors duration-300"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
