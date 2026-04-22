'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { SettingsContent } from '@/lib/content'

interface Section {
  id: string; title: string; body: string; image: string
}

interface Props {
  sections: Section[]
  heroImage: string
  gallery: string[]
  footerSettings?: SettingsContent
}

const EASE = [0.16, 1, 0.3, 1] as const

const titleVariants = {
  hidden: { opacity: 0, y: 52, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.1, ease: EASE } },
  exit:    { opacity: 0, y: -28, filter: 'blur(4px)', transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] } },
}

const bodyVariants = {
  hidden: { opacity: 0, y: 36, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.1, ease: EASE, delay: 0.32 } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] } },
}

const labelVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: EASE } },
  exit:    { opacity: 0, transition: { duration: 0.25 } },
}

export default function SavoirFaireScroll({ sections, heroImage, gallery, footerSettings }: Props) {
  const [active, setActive] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const imagePool = [heroImage, ...gallery].filter(Boolean)
  const getImage = (i: number): string => {
    if (sections[i]?.image) return sections[i].image
    return imagePool[i % imagePool.length] || ''
  }

  const n = sections.length
  const totalPanels = n + (footerSettings ? 1 : 0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      // getBoundingClientRect + scrollY pour un calcul toujours correct
      const rect = containerRef.current.getBoundingClientRect()
      const containerTop = rect.top + window.scrollY
      const relativeScroll = Math.max(0, window.scrollY - containerTop)
      const idx = Math.min(
        totalPanels - 1,
        Math.max(0, Math.floor((relativeScroll + window.innerHeight * 0.35) / window.innerHeight))
      )
      setActive(idx)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [totalPanels])

  const isFooter = active === n && Boolean(footerSettings)

  return (
    <>
      {/* ── Desktop : sticky 2 panneaux ── */}
      <div
        ref={containerRef}
        className="relative hidden lg:block"
        style={{ height: `${totalPanels * 100}vh` }}
      >
        <div className="sticky top-0 h-screen grid grid-cols-2">

          {/* Gauche — texte / footer gauche */}
          <div className="relative flex flex-col justify-center px-16 xl:px-24 pt-20 pb-12 overflow-hidden border-r border-border bg-cream">
            <AnimatePresence mode="wait">
              {isFooter ? (
                <motion.div
                  key="footer-left"
                  initial={{ opacity: 0, y: 56 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 1.3, ease: EASE } }}
                  exit={{ opacity: 0, y: -32, transition: { duration: 0.5 } }}
                  className="space-y-8"
                >
                  <div className="w-8 h-px bg-gold mb-12" />
                  <p className="font-cormorant text-5xl xl:text-6xl text-noir leading-[1.0]">Patine</p>
                  {footerSettings?.address && (footerSettings.address.street || footerSettings.address.city) && (
                    <div>
                      <p className="text-2xs tracking-caps uppercase text-muted mb-2">Atelier</p>
                      <p className="text-[14px] text-noir leading-relaxed">
                        {footerSettings.address.street}<br />{footerSettings.address.city}
                      </p>
                    </div>
                  )}
                  {footerSettings?.hours && (
                    <div>
                      <p className="text-2xs tracking-caps uppercase text-muted mb-2">Horaires</p>
                      <p className="text-[14px] text-noir leading-relaxed whitespace-pre-line">{footerSettings.hours}</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div key={active} className="flex flex-col">
                  <motion.h2
                    variants={titleVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="font-power text-4xl xl:text-[3.25rem] text-noir leading-[1.05] mb-8"
                  >
                    {sections[active]?.title}
                  </motion.h2>
                  {sections[active]?.body && (
                    <motion.div
                      variants={bodyVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="text-[15px] leading-[1.85] text-noir-soft max-w-[420px] rich-text"
                      dangerouslySetInnerHTML={{ __html: sections[active].body }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Barre de progression */}
            {!isFooter && (
              <div className="absolute bottom-10 left-16 xl:left-24 flex gap-2">
                {sections.map((_, i) => (
                  <div
                    key={i}
                    className={`h-[1px] transition-all duration-700 ${i === active ? 'w-10 bg-noir' : 'w-4 bg-border'}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Droite — image / footer droite */}
          <div className="relative overflow-hidden bg-[#D8D6D1]">
            <AnimatePresence mode="wait">
              {isFooter ? (
                <motion.div
                  key="footer-right"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 1.3, ease: EASE } }}
                  exit={{ opacity: 0, transition: { duration: 0.4 } }}
                  className="absolute inset-0 bg-noir flex flex-col justify-end px-16 xl:px-24 pb-16"
                >
                  <div className="space-y-4">
                    {footerSettings?.email && (
                      <a href={`mailto:${footerSettings.email}`} className="block text-[14px] text-cream/70 hover:text-cream transition-colors">
                        {footerSettings.email}
                      </a>
                    )}
                    {footerSettings?.instagram && (
                      <a href={footerSettings.instagram} target="_blank" rel="noopener noreferrer" className="block text-[14px] text-cream/70 hover:text-cream transition-colors">
                        Instagram ↗
                      </a>
                    )}
                    {footerSettings?.linkedin && (
                      <a href={footerSettings.linkedin} target="_blank" rel="noopener noreferrer" className="block text-[14px] text-cream/70 hover:text-cream transition-colors">
                        LinkedIn ↗
                      </a>
                    )}
                    <Link href="/contact" className="block text-[14px] text-cream/70 hover:text-cream transition-colors">
                      Contact ↗
                    </Link>
                  </div>
                  <p className="absolute bottom-6 right-8 text-[11px] text-cream/30 tracking-wide">
                    {footerSettings?.footer || '© 2025 Patine'}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 1.07 }}
                  animate={{ opacity: 1, scale: 1, transition: { duration: 1.5, ease: EASE } }}
                  exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } }}
                  className="absolute inset-0"
                >
                  {getImage(active) ? (
                    <Image
                      src={getImage(active)}
                      alt={sections[active]?.title || ''}
                      fill
                      className="object-cover"
                      priority={active === 0}
                      sizes="50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#D8D6D1]" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Mobile : sections empilées ── */}
      <div className="lg:hidden pt-16">
        {sections.map((section, i) => (
          <div key={section.id} className={i > 0 ? 'border-t border-border' : ''}>
            <div className="relative aspect-[4/3] bg-[#D8D6D1] overflow-hidden">
              {getImage(i) && (
                <Image src={getImage(i)} alt={section.title} fill className="object-cover" sizes="100vw" />
              )}
            </div>
            <div className="px-6 py-12">
              <h2 className="font-power text-3xl text-noir mb-6">{section.title}</h2>
              {section.body && (
                <div className="text-[15px] leading-[1.85] text-noir-soft rich-text" dangerouslySetInnerHTML={{ __html: section.body }} />
              )}
            </div>
          </div>
        ))}

        {/* Footer mobile */}
        {footerSettings && (
          <div className="border-t border-border bg-noir px-6 py-14 space-y-6">
            <p className="font-cormorant text-4xl text-cream">Patine</p>
            {(footerSettings.address?.street || footerSettings.address?.city) && (
              <p className="text-[14px] text-cream/60 leading-relaxed">
                {footerSettings.address.street}<br />{footerSettings.address.city}
              </p>
            )}
            <div className="space-y-2">
              {footerSettings.email && <a href={`mailto:${footerSettings.email}`} className="block text-[14px] text-cream/60">{footerSettings.email}</a>}
              {footerSettings.instagram && <a href={footerSettings.instagram} target="_blank" rel="noopener noreferrer" className="block text-[14px] text-cream/60">Instagram ↗</a>}
              <Link href="/contact" className="block text-[14px] text-cream/60">Contact ↗</Link>
            </div>
            <p className="text-[11px] text-cream/30">{footerSettings.footer || '© 2025 Patine'}</p>
          </div>
        )}
      </div>
    </>
  )
}
