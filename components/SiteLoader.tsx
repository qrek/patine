'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  logoSrc?: string
  logoSrcDark?: string
  logoWidth?: number
}

export default function SiteLoader({ logoSrc = '', logoSrcDark = '', logoWidth = 120 }: Props) {
  const [done, setDone]         = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const ANIM_DURATION = 1800 // durée du fake 0→100 en ms
    const start = Date.now()

    // Compteur qui suit une courbe ease-out sur ANIM_DURATION ms
    const intervalId = window.setInterval(() => {
      const elapsed = Date.now() - start
      const t = Math.min(elapsed / ANIM_DURATION, 1)
      // ease-out: avance vite, ralentit à la fin
      const eased = 1 - Math.pow(1 - t, 2.5)
      setProgress(eased * 100)
      if (t >= 1) {
        clearInterval(intervalId)
        // Pause à 100 puis disparition
        setTimeout(() => setDone(true), 400)
      }
    }, 30)

    return () => clearInterval(intervalId)
  }, [])

  const displayWidth = Math.round(logoWidth * 1.4)

  const logoEl = logoSrcDark
    ? <img src={logoSrcDark} alt="Patine" style={{ width: displayWidth, height: 'auto' }} className="object-contain" />
    : logoSrc
      ? <img src={logoSrc} alt="Patine" style={{ width: displayWidth, height: 'auto' }} className="object-contain brightness-0 invert" />
      : <span className="font-cormorant text-[#F5F3EF] tracking-[0.45em] text-5xl uppercase">Patine</span>

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[500] flex items-center justify-center bg-[#2B4BD5] select-none"
          exit={{ y: '-100%' }}
          transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-col items-center gap-5"
          >
            {logoEl}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="font-power text-[12px] text-[#F5F3EF]/55 tracking-[0.22em] tabular-nums"
            >
              {String(Math.min(100, Math.round(progress))).padStart(3, '0')}
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
