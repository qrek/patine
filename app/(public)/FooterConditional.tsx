'use client'

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
  return <Footer {...props} />
}
