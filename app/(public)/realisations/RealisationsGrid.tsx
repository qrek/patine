'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from '@/components/Lightbox'

interface Photo {
  id: string
  src: string
  title?: string
  caption?: string
  order: number
}

export default function RealisationsGrid({ photos }: { photos: Photo[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openAt = (i: number) => setLightboxIndex(i)
  const close = () => setLightboxIndex(null)
  const prev = () =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length))
  const next = () =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % photos.length))

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 px-1">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            className="group relative aspect-square overflow-hidden bg-[#D6D3CE] focus:outline-none"
            onClick={() => openAt(i)}
            aria-label={photo.title || `Réalisation ${i + 1}`}
          >
            <Image
              src={photo.src}
              alt={photo.title || photo.caption || ''}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Overlay légende au hover */}
            {(photo.title || photo.caption) && (
              <div className="absolute inset-0 bg-[#1A1A18]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                <div>
                  {photo.title && (
                    <p
                      className="text-white font-cormorant italic text-lg"
                      style={{ fontFamily: 'var(--font-cormorant)' }}
                    >
                      {photo.title}
                    </p>
                  )}
                  {photo.caption && (
                    <p
                      className="text-white/60 text-xs mt-1 tracking-wide"
                      style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
                    >
                      {photo.caption}
                    </p>
                  )}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  )
}
