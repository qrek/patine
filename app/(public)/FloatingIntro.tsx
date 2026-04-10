'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

interface Photo { id: string; src: string }

interface PhotoConfig {
  top?: string; bottom?: string; left?: string; right?: string
  width: string; aspectRatio: string; rotate: number; yOffset: number
}

const CONFIGS: PhotoConfig[] = [
  { top: '4%',   left:  '1%',  width: '21vw', aspectRatio: '3/4',  rotate: -3,  yOffset: -55 },
  { top: '6%',   right: '2%',  width: '17vw', aspectRatio: '4/5',  rotate:  4,  yOffset:  70 },
  { bottom: '5%',left:  '4%',  width: '18vw', aspectRatio: '1/1',  rotate:  2,  yOffset:  45 },
  { bottom: '7%',right: '3%',  width: '19vw', aspectRatio: '3/4',  rotate: -5,  yOffset: -60 },
]

const EASE = [0.16, 1, 0.3, 1] as const

function FloatingPhoto({
  src, config, scrollYProgress,
}: { src: string; config: PhotoConfig; scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const { top, bottom, left, right, width, aspectRatio, rotate, yOffset } = config
  const y = useTransform(scrollYProgress, [0, 1], [yOffset, -yOffset])

  return (
    <motion.div
      style={{ position: 'absolute', top, bottom, left, right, rotate, y, width }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.6, ease: EASE }}
      className="hidden lg:block overflow-hidden shadow-sm"
    >
      <div style={{ aspectRatio }} className="relative w-full overflow-hidden">
        <Image src={src} alt="" fill className="object-cover" sizes="22vw" />
      </div>
    </motion.div>
  )
}

interface Props {
  text: string
  photos: Photo[]
}

export default function FloatingIntro({ text, photos }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  return (
    <section
      ref={ref}
      id="intro"
      className="relative overflow-hidden bg-warm flex items-center justify-center min-h-[75vh] py-32 md:py-52"
    >
      {/* Photos flottantes (desktop uniquement) */}
      {CONFIGS.map((config, i) =>
        photos[i] ? (
          <FloatingPhoto key={i} src={photos[i].src} config={config} scrollYProgress={scrollYProgress} />
        ) : null
      )}

      {/* Phrase centrale */}
      <div className="relative z-10 px-8 md:px-24 lg:px-48 xl:px-56 text-center max-w-[1200px] mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.9, ease: EASE }}
          className="font-power text-[clamp(2rem,4.8vw,6.5rem)] text-noir leading-[1.08] tracking-[-0.01em]"
        >
          {text}
        </motion.p>
      </div>
    </section>
  )
}
