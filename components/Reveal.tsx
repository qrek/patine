'use client'

import { motion } from 'framer-motion'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}

// Ease expressif : démarre lentement, accélère puis arrive doucement
const EASE = [0.16, 1, 0.3, 1] as const

export default function Reveal({ children, delay = 0, y = 44, className }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.2, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
