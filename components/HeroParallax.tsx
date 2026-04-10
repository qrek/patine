'use client'

import { useScroll, useTransform, motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  strength?: number
}

export default function HeroParallax({ children, strength = 140 }: Props) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 900], [0, strength])

  return (
    <motion.div
      style={{ y }}
      className="absolute inset-0 will-change-transform"
    >
      {children}
    </motion.div>
  )
}
