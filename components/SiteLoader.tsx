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
    const minTime = 1800
    const start   = Date.now()

    // Fake smooth progress: rapide au début, ralentit vers 90
    let current = 0
    const intervalId = window.setInterval(() => {
      const remaining = 90 - current
      const step = remaining * 0.12 + Math.random() * 3
      current = Math.min(current + step, 90)
      setProgress(current)
    }, 80)

    const finish = () => {
      clearInterval(intervalId)
      setProgress(100)
      const elapsed = Date.now() - start
      setTimeout(() => setDone(true), Math.max(0, minTime - elapsed) + 200)
    }

    if (document.readyState === 'complete') {
      finish()
    } else {
      window.addEventListener('load', finish, { once: true })
      const t = setTimeout(finish, 4000)
      return () => { clearTimeout(t); clearInterval(intervalId) }
    }

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
            {/* Pourcentage — directement sous le logo */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
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
