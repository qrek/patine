'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ScrollHint() {
  return (
    <Link href="#intro" className="flex flex-col items-center gap-1.5 group" aria-label="Défiler">
      <span className="text-[9px] tracking-[0.3em] uppercase text-cream/40 group-hover:text-cream/70 transition-colors duration-300">
        Défiler
      </span>
      <motion.span
        className="text-cream/35 text-sm group-hover:text-cream/60 transition-colors duration-300 leading-none"
        animate={{ y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: [0.45, 0, 0.55, 1] }}
      >
        ↓
      </motion.span>
    </Link>
  )
}
