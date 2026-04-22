'use client'

import { useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'

interface Photo { id: string; src: string }

interface PhotoConfig {
  top?: string; bottom?: string; left?: string; right?: string
  width: string; aspectRatio: string; rotate: number; depth: number
  parallaxFactor: number
}

const CONFIGS: PhotoConfig[] = [
  { top: '8%',    left:  '2%',  width: '20vw', aspectRatio: '3/4',  rotate: -4,  depth: 28, parallaxFactor: -0.18 },
  { top: '10%',   right: '3%',  width: '16vw', aspectRatio: '4/5',  rotate:  5,  depth: 16, parallaxFactor: -0.10 },
  { bottom: '8%', left:  '5%',  width: '17vw', aspectRatio: '1/1',  rotate:  3,  depth: 12, parallaxFactor:  0.12 },
  { bottom: '10%',right: '4%',  width: '18vw', aspectRatio: '3/4',  rotate: -6,  depth: 22, parallaxFactor:  0.16 },
]

const EASE = [0.16, 1, 0.3, 1] as const
type SpringValue = ReturnType<typeof useSpring>

function FloatingPhoto({
  src, config, scrollY, mouseX, mouseY,
}: {
  src: string
  config: PhotoConfig
  scrollY: ReturnType<typeof useScroll>['scrollYProgress']
  mouseX: SpringValue
  mouseY: SpringValue
}) {
  const scrollParallax = useTransform(scrollY, [0, 1], [
    config.parallaxFactor * -120,
    config.parallaxFactor * 120,
  ])
  const mx = useTransform(mouseX, (v: number) => v * config.depth)
  const my = useTransform(mouseY, (v: number) => v * config.depth)

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: config.top, bottom: config.bottom,
        left: config.left, right: config.right,
        width: config.width,
        rotate: config.rotate,
        x: mx,
        y: useTransform([scrollParallax, my], ([s, m]) => (s as number) + (m as number)),
      }}
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.1, ease: EASE }}
      whileHover={{ scale: 1.08, zIndex: 20 }}
      className="hidden lg:block overflow-hidden shadow-[0_16px_56px_rgba(0,0,0,0.18)] cursor-pointer"
    >
      <Link href="/realisations" tabIndex={-1} aria-label="Voir les réalisations">
        <div style={{ aspectRatio: config.aspectRatio }} className="relative w-full overflow-hidden">
          <Image
            src={src} alt="" fill
            className="object-cover transition-transform duration-700 hover:scale-[1.07]"
            sizes="22vw"
          />
        </div>
      </Link>
    </motion.div>
  )
}

function WordReveal({ text, mouseX, mouseY }: {
  text: string
  mouseX: SpringValue
  mouseY: SpringValue
}) {
  const words = text.split(' ')
  const rotateX = useTransform(mouseY, (v: number) => v * -6)
  const rotateY = useTransform(mouseX, (v: number) => v * 6)

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="relative z-10 px-8 md:px-24 lg:px-48 xl:px-52 text-center max-w-[1200px] mx-auto"
    >
      <motion.p
        className="font-power text-[clamp(2rem,4.8vw,6.5rem)] leading-[1.08] tracking-[-0.01em] text-noir"
        whileHover={{ color: '#2B4BD5' }}
        transition={{ color: { duration: 0.6 } }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block"
            style={{ marginRight: '0.28em' }}
            initial={{ opacity: 0, y: 36, filter: 'blur(8px)' }}
            whileInView={{
              opacity: 1, y: 0, filter: 'blur(0px)',
              transition: { duration: 1.3, ease: EASE, delay: i * 0.06 },
            }}
            viewport={{ once: true, margin: '-40px' }}
          >
            {word}
          </motion.span>
        ))}
      </motion.p>
    </motion.div>
  )
}

export default function FloatingIntro({ text, photos }: { text: string; photos: Photo[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const innerRef   = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)
  const mouseX = useSpring(rawMouseX, { stiffness: 45, damping: 20 })
  const mouseY = useSpring(rawMouseY, { stiffness: 45, damping: 20 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = innerRef.current?.getBoundingClientRect()
    if (!rect) return
    rawMouseX.set((e.clientX - rect.left) / rect.width * 2 - 1)
    rawMouseY.set((e.clientY - rect.top)  / rect.height * 2 - 1)
  }, [rawMouseX, rawMouseY])

  const handleMouseLeave = useCallback(() => {
    rawMouseX.set(0); rawMouseY.set(0)
  }, [rawMouseX, rawMouseY])

  return (
    <div
      ref={sectionRef}
      id="intro"
      className="relative min-h-[75vh] py-32 md:py-52 flex items-center justify-center bg-warm overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={innerRef} className="absolute inset-0 pointer-events-none">
        {CONFIGS.map((config, i) =>
          photos[i] ? (
            <FloatingPhoto
              key={i}
              src={photos[i].src}
              config={config}
              scrollY={scrollYProgress}
              mouseX={mouseX}
              mouseY={mouseY}
            />
          ) : null
        )}
      </div>

      <WordReveal text={text} mouseX={mouseX} mouseY={mouseY} />
    </div>
  )
}
