'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  logoSrc?: string
  logoSrcDark?: string
  logoWidth?: number
}

export default function SiteLoader({ logoSrc = '', logoSrcDark = '', logoWidth = 120 }: Props) {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const minTime = 1600
    const start = Date.now()
    const finish = () => {
      const elapsed = Date.now() - start
      setTimeout(() => setDone(true), Math.max(0, minTime - elapsed) + 300)
    }
    if (document.readyState === 'complete') {
      finish()
    } else {
      window.addEventListener('load', finish, { once: true })
      const t = setTimeout(() => setDone(true), 3500)
      return () => clearTimeout(t)
    }
  }, [])

  const logoEl = (() => {
    if (logoSrcDark) return <img src={logoSrcDark} alt="Patine" style={{ width: logoWidth, height: 'auto' }} className="object-contain" />
    if (logoSrc)     return <img src={logoSrc}     alt="Patine" style={{ width: logoWidth, height: 'auto' }} className="object-contain brightness-0 invert" />
    return (
      <span className="font-cormorant text-[#F5F3EF] tracking-[0.45em] text-4xl uppercase">
        Patine
      </span>
    )
  })()

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
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          >
            {logoEl}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
