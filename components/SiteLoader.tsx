'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SiteLoader() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Attend que le document soit chargé + petit délai pour l'effet
    const go = () => setTimeout(() => setDone(true), 400)
    if (document.readyState === 'complete') {
      go()
    } else {
      window.addEventListener('load', go, { once: true })
      // Fallback si "load" ne se déclenche pas
      const t = setTimeout(() => setDone(true), 2800)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[500] flex items-center justify-center bg-[#2B4BD5] select-none"
          exit={{ y: '-100%' }}
          transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
        >
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="font-cormorant text-[#F5F3EF] tracking-[0.45em] text-4xl uppercase"
          >
            Patine
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
