'use client'

import { useRef, useCallback } from 'react'
import Image from 'next/image'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  type MotionValue,
} from 'framer-motion'

interface FloatPhoto {
  src: string
  top?: string; bottom?: string; left?: string; right?: string
  width: string
  aspectRatio: string
  baseRotate: number
  yOffset: number          // parallax scroll
  mxFactor: number         // amplitude souris X (px)
  myFactor: number         // amplitude souris Y (px)
  reveal: { t0: number; t1: number }
}

const EASE = [0.16, 1, 0.3, 1] as const

// ── Photo flottante ──────────────────────────────────────────────────────────
function Floating({
  photo, progress, mouseX, mouseY,
}: {
  photo: FloatPhoto
  progress: MotionValue<number>
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}) {
  const sy      = useTransform(progress, [0, 1], [photo.yOffset, -photo.yOffset])
  const opacity = useTransform(progress, [photo.reveal.t0, photo.reveal.t1], [0, 1])
  const scale   = useTransform(progress, [photo.reveal.t0, photo.reveal.t1], [0.86, 1])

  const mx  = useTransform(mouseX, [-1, 1], [-photo.mxFactor, photo.mxFactor])
  const my  = useTransform(mouseY, [-1, 1], [-photo.myFactor, photo.myFactor])
  const rot = useTransform(mouseX, [-1, 1], [photo.baseRotate - 3, photo.baseRotate + 3])

  const combinedY = useTransform([sy, my] as MotionValue<number>[], ([s, m]) => (s as number) + (m as number))

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: photo.top, bottom: photo.bottom, left: photo.left, right: photo.right,
        width: photo.width,
        x: mx, y: combinedY, rotate: rot, opacity, scale,
      }}
      className="hidden lg:block overflow-hidden shadow-[0_16px_56px_rgba(0,0,0,0.18)] will-change-transform"
    >
      <div style={{ aspectRatio: photo.aspectRatio }} className="relative w-full">
        <Image src={photo.src} alt="" fill className="object-cover" sizes="40vw" />
      </div>
    </motion.div>
  )
}

// ── Section éditoriale ──────────────────────────────────────────────────────
interface Props {
  title: string
  body: string
  imageSrc: string
  extras?: string[]
  index: number
  total: number
  warm: boolean
  textSize?: number
  textAlign?: 'left' | 'justify' | 'center'
  textWidth?: 'default' | 'wide'
}

export default function SavoirFaireSection({
  title, body, imageSrc, extras = [], index, total, warm,
  textSize = 16, textAlign = 'left', textWidth = 'default',
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Souris -1 → 1, normalisée par rapport à la section
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mouseX = useSpring(rawX, { stiffness: 38, damping: 15 })
  const mouseY = useSpring(rawY, { stiffness: 38, damping: 15 })

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    rawX.set(((e.clientX - r.left) / r.width  - 0.5) * 2)
    rawY.set(((e.clientY - r.top ) / r.height - 0.5) * 2)
  }, [rawX, rawY])

  const onMouseLeave = useCallback(() => { rawX.set(0); rawY.set(0) }, [rawX, rawY])

  // Layout : alterne gauche/droite
  const flip = index % 2 === 1

  const floats: FloatPhoto[] = []

  if (imageSrc) {
    floats.push(flip
      ? { src: imageSrc, top: '12%', left: '3%',  width: '34vw', aspectRatio: '3/4',
          baseRotate: -3, yOffset: -80, mxFactor: -28, myFactor: -16,
          reveal: { t0: 0.22, t1: 0.55 } }
      : { src: imageSrc, top: '14%', right: '3%', width: '34vw', aspectRatio: '3/4',
          baseRotate:  3, yOffset:  80, mxFactor:  28, myFactor: -14,
          reveal: { t0: 0.22, t1: 0.55 } }
    )
  }

  if (extras[0]) {
    floats.push(flip
      ? { src: extras[0], bottom: '10%', right: '8%', width: '20vw', aspectRatio: '4/5',
          baseRotate: 4, yOffset: 60, mxFactor: 22, myFactor: 18,
          reveal: { t0: 0.32, t1: 0.62 } }
      : { src: extras[0], bottom: '12%', left: '6%', width: '20vw', aspectRatio: '4/5',
          baseRotate: -5, yOffset: -60, mxFactor: -22, myFactor: 18,
          reveal: { t0: 0.32, t1: 0.62 } }
    )
  }

  if (extras[1]) {
    floats.push(flip
      ? { src: extras[1], top: '8%', right: '12%', width: '14vw', aspectRatio: '1/1',
          baseRotate: -6, yOffset: -45, mxFactor: 18, myFactor: -12,
          reveal: { t0: 0.42, t1: 0.7 } }
      : { src: extras[1], top: '6%', left: '12%', width: '14vw', aspectRatio: '1/1',
          baseRotate: 6, yOffset: 45, mxFactor: -18, myFactor: -12,
          reveal: { t0: 0.42, t1: 0.7 } }
    )
  }

  const widthClass = textWidth === 'wide' ? 'max-w-[680px]' : 'max-w-[460px]'
  const alignClass =
    textAlign === 'center'  ? 'text-center mx-auto'
    : textAlign === 'justify' ? 'text-justify hyphens-auto'
    : 'text-left'

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden border-t border-border ${warm ? 'bg-warm' : 'bg-cream'}`}
      style={{ minHeight: '110vh' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Photos flottantes — desktop */}
      {floats.map((p, i) => (
        <Floating key={i} photo={p} progress={scrollYProgress} mouseX={mouseX} mouseY={mouseY} />
      ))}

      {/* Bloc texte central */}
      <div className="relative z-10 min-h-[110vh] flex items-center px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 56 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 1.4, ease: EASE }}
          className={`${widthClass} ${alignClass} mx-auto`}
        >
          <p className="text-[11px] tracking-[0.28em] uppercase text-muted mb-8">
            <span className="text-noir">{String(index + 1).padStart(2, '0')}</span>
            <span className="mx-2 opacity-40">—</span>
            {String(total).padStart(2, '0')}
          </p>

          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.12 }}
            className="font-power text-[clamp(2.2rem,4vw,3.6rem)] text-noir leading-[1.05] tracking-[-0.01em] mb-10"
          >
            {title}
          </motion.h2>

          {body && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-120px' }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.28 }}
              className="text-noir-soft rich-text"
              style={{ fontSize: textSize, lineHeight: 1.85 }}
              dangerouslySetInnerHTML={{ __html: body }}
            />
          )}
        </motion.div>
      </div>

      {/* Mobile : photo principale empilée sous le texte */}
      {imageSrc && (
        <div className="lg:hidden relative aspect-[4/5] mx-6 mb-12 overflow-hidden bg-[#D8D6D1]">
          <Image src={imageSrc} alt={title} fill className="object-cover" sizes="100vw" />
        </div>
      )}
    </section>
  )
}
