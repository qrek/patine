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
    <section className={`grid grid-cols-1 lg:grid-cols-2 border-t border-border ${warm ? 'bg-warm' : 'bg-cream'}`}>

      {/* Image */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.6, ease: EASE }}
        className={`relative h-[60vw] lg:h-auto min-h-[420px] overflow-hidden bg-[#D8D6D1] ${reversed ? 'lg:order-2' : 'lg:order-1'}`}
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
        initial={{ opacity: 0, x: reversed ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
        className={`flex flex-col justify-start px-8 lg:px-14 xl:px-16 py-14 lg:py-20 ${reversed ? 'lg:order-1' : 'lg:order-2'}`}
      >
        {/* Ligne décorative */}
        <div className="w-8 h-px bg-gold mb-10" />

        <h2 className="font-power text-3xl xl:text-[2.6rem] text-noir leading-[1.1] mb-7">
          {title}
        </h2>

        {body && (
          <div
            className="text-[15px] leading-[1.9] text-noir-soft max-w-[440px] rich-text"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        )}
      </motion.div>

    </section>
  )
}
