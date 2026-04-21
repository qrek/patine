'use client'

import { useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'

interface Photo { id: string; src: string }

interface PhotoConfig {
  top?: string; bottom?: string; left?: string; right?: string
  width: string; aspectRatio: string; rotate: number; yOffset: number
  depth: number
}

const CONFIGS: PhotoConfig[] = [
  { top: '5%',    left:  '1%',  width: '20vw', aspectRatio: '3/4',  rotate: -3,  yOffset: -50, depth: 22 },
  { top: '8%',    right: '2%',  width: '16vw', aspectRatio: '4/5',  rotate:  4,  yOffset:  65, depth: 14 },
  { bottom: '6%', left:  '4%',  width: '17vw', aspectRatio: '1/1',  rotate:  2,  yOffset:  40, depth: 10 },
  { bottom: '8%', right: '3%',  width: '18vw', aspectRatio: '3/4',  rotate: -5,  yOffset: -55, depth: 18 },
]

const EASE = [0.16, 1, 0.3, 1] as const

type SpringValue = ReturnType<typeof useSpring>

function FloatingPhoto({
  src, config, scrollYProgress, mouseX, mouseY,
}: {
  src: string
  config: PhotoConfig
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
  mouseX: SpringValue
  mouseY: SpringValue
}) {
  const { top, bottom, left, right, width, aspectRatio, rotate, yOffset, depth } = config

  const scrollY = useTransform(scrollYProgress, [0, 1], [yOffset, -yOffset])
  const mx = useTransform(mouseX, (v: number) => v * depth)
  const my = useTransform(mouseY, (v: number) => v * depth)
  const combinedY = useTransform([scrollY, my], ([s, m]) => (s as number) + (m as number))

  return (
    <motion.div
      style={{ position: 'absolute', top, bottom, left, right, rotate, y: combinedY, x: mx, width }}
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.6, ease: EASE }}
      whileHover={{ scale: 1.06, zIndex: 20 }}
      className="hidden lg:block overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.14)] cursor-pointer"
    >
      <Link href="/realisations" tabIndex={-1} aria-label="Voir les réalisations">
        <div style={{ aspectRatio }} className="relative w-full overflow-hidden">
          <Image
            src={src}
            alt=""
            fill
            className="object-cover transition-transform duration-700 hover:scale-[1.06]"
            sizes="22vw"
          />
        </div>
      </Link>
    </motion.div>
  )
}

function AnimatedText({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <motion.p
      className="font-power text-[clamp(2rem,4.8vw,6.5rem)] leading-[1.08] tracking-[-0.01em] transition-colors duration-700 text-noir"
      whileHover={{ color: '#2B4BD5' }}
      transition={{ color: { duration: 0.6 } }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ marginRight: '0.28em' }}
          initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.2 + i * 0.07 }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  )
}

export default function FloatingIntro({ text, photos }: { text: string; photos: Photo[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })

  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)
  const mouseX = useSpring(rawMouseX, { stiffness: 50, damping: 22 })
  const mouseY = useSpring(rawMouseY, { stiffness: 50, damping: 22 })

  const rotateX = useTransform(mouseY, (v: number) => v * -2.5)
  const rotateY = useTransform(mouseX, (v: number) => v * 2.5)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    rawMouseX.set((e.clientX - rect.left) / rect.width * 2 - 1)
    rawMouseY.set((e.clientY - rect.top) / rect.height * 2 - 1)
  }, [rawMouseX, rawMouseY])

  const handleMouseLeave = useCallback(() => {
    rawMouseX.set(0)
    rawMouseY.set(0)
  }, [rawMouseX, rawMouseY])

  return (
    <section
      ref={sectionRef}
      id="intro"
      className="relative overflow-hidden bg-warm flex items-center justify-center min-h-[75vh] py-32 md:py-52"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Photos flottantes (desktop uniquement) */}
      {CONFIGS.map((config, i) =>
        photos[i] ? (
          <FloatingPhoto
            key={i}
            src={photos[i].src}
            config={config}
            scrollYProgress={scrollYProgress}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ) : null
      )}

      {/* Texte central avec effet 3D */}
      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        className="relative z-10 px-8 md:px-24 lg:px-48 xl:px-56 text-center max-w-[1200px] mx-auto"
      >
        <AnimatedText text={text} />
      </motion.div>
    </section>
  )
}
