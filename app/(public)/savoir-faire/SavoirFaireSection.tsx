'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface Props {
  title: string
  body: string
  imageSrc: string
  index: number
  total: number
  reversed: boolean
  warm: boolean
}

const EASE = [0.16, 1, 0.3, 1] as const

export default function SavoirFaireSection({ title, body, imageSrc, reversed, warm }: Props) {
  return (
    <section className={`grid grid-cols-1 lg:grid-cols-2 min-h-[88vh] border-t border-border ${warm ? 'bg-warm' : 'bg-cream'}`}>

      {/* Image */}
      <motion.div
        initial={{ opacity: 0, y: 72 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.9, ease: EASE }}
        className={`relative h-[64vw] lg:h-auto overflow-hidden bg-[#D8D6D1] ${reversed ? 'lg:order-2' : 'lg:order-1'}`}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#D8D6D1]" />
        )}
      </motion.div>

      {/* Texte */}
      <motion.div
        initial={{ opacity: 0, y: 72 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.9, ease: EASE, delay: 0.28 }}
        className={`flex flex-col justify-center px-8 lg:px-16 xl:px-20 py-20 ${reversed ? 'lg:order-1' : 'lg:order-2'}`}
      >
        <h2 className="font-power text-4xl xl:text-5xl text-noir leading-[1.05] mb-8">
          {title}
        </h2>
        {body && (
          <div
            className="text-[15px] leading-[1.9] text-noir-soft max-w-[400px] rich-text"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        )}
      </motion.div>

    </section>
  )
}
