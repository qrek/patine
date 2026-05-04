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
  const mx       = useTransform(mouseX, (v: number) => v * config.depth)
  const myMouse  = useTransform(mouseY, (v: number) => v * config.depth)
  const combinedY = useTransform(
    [scrollParallax, myMouse] as const,
    ([s, m]: number[]) => s + m
  )

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: config.top, bottom: config.bottom,
        left: config.left, right: config.right,
        width: config.width,
        rotate: config.rotate,
        x: mx,
        y: combinedY,
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

type FontKey = 'power' | 'cormorant' | 'instrument'

const FONT_CSS: Record<FontKey, string> = {
  power:      "var(--font-power)",
  cormorant:  "var(--font-cormorant), Georgia, serif",
  instrument: "var(--font-instrument), system-ui, sans-serif",
}

function WordReveal({
  text, mouseX, mouseY, size, font, italic, align, quoted,
}: {
  text: string
  mouseX: SpringValue
  mouseY: SpringValue
  size: number
  font: FontKey
  italic: boolean
  align: 'left' | 'center'
  quoted: boolean
}) {
  const innerWords = text.split(' ').filter(Boolean)
  const words = quoted ? ['«', ...innerWords, '»'] : innerWords
  const rotateX  = useTransform(mouseY, (v: number) => v * -6)
  const rotateY  = useTransform(mouseX, (v: number) => v * 6)

  // Taille fluide : ~ 0.42× la valeur sur mobile → 1× au max
  const fluidSize = `clamp(${Math.round(size * 0.42)}px, ${(size * 0.85 / 16).toFixed(2)}vw + ${(size * 0.5 / 16).toFixed(2)}rem, ${size}px)`

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={`relative z-10 px-8 md:px-24 lg:px-48 xl:px-52 max-w-[1200px] mx-auto ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      <motion.p
        style={{
          fontFamily: FONT_CSS[font],
          fontSize: fluidSize,
          fontStyle: italic ? 'italic' : 'normal',
          lineHeight: font === 'cormorant' ? 1.12 : 1.08,
          letterSpacing: font === 'cormorant' ? '-0.005em' : '-0.01em',
          color: 'var(--noir)',
        }}
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

interface FloatingIntroProps {
  text: string
  photos: Photo[]
  size?: number
  font?: FontKey
  italic?: boolean
  align?: 'left' | 'center'
  quoted?: boolean
}

export default function FloatingIntro({
  text, photos,
  size = 96,
  font = 'power',
  italic = false,
  align = 'center',
  quoted = false,
}: FloatingIntroProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)
  const mouseX = useSpring(rawMouseX, { stiffness: 45, damping: 20 })
  const mouseY = useSpring(rawMouseY, { stiffness: 45, damping: 20 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect()
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
      id="intro-photos"
      className="relative min-h-[75vh] py-32 md:py-52 flex items-center justify-center bg-warm overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Photos absolues */}
      <div className="absolute inset-0">
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

      <WordReveal
        text={text}
        mouseX={mouseX}
        mouseY={mouseY}
        size={size}
        font={font}
        italic={italic}
        align={align}
        quoted={quoted}
      />
    </div>
  )
}
