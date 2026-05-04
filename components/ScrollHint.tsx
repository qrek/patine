'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ScrollHint() {
  return (
    <Link href="#intro" className="flex flex-col items-center group" aria-label="Défiler">
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
