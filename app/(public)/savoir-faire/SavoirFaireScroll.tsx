'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface Section {
  id: string
  title: string
  body: string
  image: string
}

interface Props {
  sections: Section[]
  heroImage: string
  gallery: string[]
}

export default function SavoirFaireScroll({ sections, heroImage, gallery }: Props) {
  const [active, setActive] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Priorité : image propre à la section → pool heroImage + gallery
  const imagePool = [heroImage, ...gallery].filter(Boolean)
  const getImage = (i: number): string => {
    if (sections[i]?.image) return sections[i].image
    return imagePool[i % imagePool.length] || ''
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const containerTop = containerRef.current.offsetTop
      const relativeScroll = Math.max(0, window.scrollY - containerTop)
      const idx = Math.min(
        sections.length - 1,
        Math.max(0, Math.floor(relativeScroll / window.innerHeight))
      )
      setActive(idx)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections.length])

  const n = sections.length

  return (
    <>
      {/* ── Desktop : sticky 2 panneaux ── */}
      <div
        ref={containerRef}
        className="relative hidden lg:block"
        style={{ height: `${n * 100}vh` }}
      >
        <div className="sticky top-0 h-screen grid grid-cols-2">

          {/* Gauche — texte */}
          <div className="relative flex flex-col justify-center px-16 xl:px-24 pt-20 pb-12 overflow-hidden border-r border-border bg-cream">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 56 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] } }}
                exit={{ opacity: 0, y: -32, transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } }}
              >
                {/* Compteur */}
                <p className="text-[11px] tracking-[0.2em] uppercase text-muted mb-10">
                  <span className="text-noir">{String(active + 1).padStart(2, '0')}</span>
                  <span className="mx-2 opacity-40">—</span>
                  {String(n).padStart(2, '0')}
                </p>

                <h2 className="font-power text-4xl xl:text-[3.25rem] text-noir leading-[1.05] mb-8">
                  {sections[active]?.title}
                </h2>

                {sections[active]?.body && (
                  <div
                    className="text-[15px] leading-[1.85] text-noir-soft max-w-[420px] rich-text"
                    dangerouslySetInnerHTML={{ __html: sections[active].body }}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Barre de progression */}
            <div className="absolute bottom-10 left-16 xl:left-24 flex gap-2">
              {sections.map((_, i) => (
                <div
                  key={i}
                  className={`h-[1px] transition-all duration-700 ${i === active ? 'w-10 bg-noir' : 'w-4 bg-border'}`}
                />
              ))}
            </div>
          </div>

          {/* Droite — image */}
          <div className="relative overflow-hidden bg-[#D8D6D1]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.07 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } }}
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
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Mobile : sections empilées ── */}
      <div className="lg:hidden">
        {sections.map((section, i) => (
          <div key={section.id} className={i > 0 ? 'border-t border-border' : ''}>
            <div className="relative aspect-[4/3] bg-[#D8D6D1] overflow-hidden">
              {getImage(i) && (
                <Image
                  src={getImage(i)}
                  alt={section.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              )}
            </div>
            <div className="px-6 py-12">
              <p className="text-[11px] tracking-[0.2em] uppercase text-muted mb-4">
                <span className="text-noir">{String(i + 1).padStart(2, '0')}</span>
                <span className="mx-2 opacity-40">—</span>
                {String(n).padStart(2, '0')}
              </p>
              <h2 className="font-power text-3xl text-noir mb-6">{section.title}</h2>
              {section.body && (
                <div
                  className="text-[15px] leading-[1.85] text-noir-soft rich-text"
                  dangerouslySetInnerHTML={{ __html: section.body }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
