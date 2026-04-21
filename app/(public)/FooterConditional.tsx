'use client'

import { usePathname } from 'next/navigation'
import Footer from '@/components/Footer'

interface FooterProps {
  text?: string
  instagram?: string
  linkedin?: string
  email?: string
  phone?: string
  hours?: string
  address?: { street: string; city: string; country?: string }
  logoSrc?: string
  logoWidth?: number
}

export default function FooterConditional(props: FooterProps) {
  const pathname = usePathname()
  // Sur /savoir-faire le footer est intégré dans le scroll sticky
  if (pathname === '/savoir-faire') return null
  return <Footer {...props} />
}
