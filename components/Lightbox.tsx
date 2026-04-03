'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'

interface Photo {
  id: string
  src: string
  title?: string
  caption?: string
}

interface LightboxProps {
  photos: Photo[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Lightbox({
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const photo = photos[currentIndex]

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!photo) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-6 right-8 text-white/70 hover:text-white text-3xl transition-colors duration-200 z-10"
        onClick={onClose}
        aria-label="Fermer"
      >
        ×
      </button>

      {/* Counter */}
      <span
        className="absolute top-7 left-8 text-white/40 text-xs tracking-widest"
        style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
      >
        {currentIndex + 1} / {photos.length}
      </span>

      {/* Prev */}
      {photos.length > 1 && (
        <button
          className="absolute left-4 md:left-8 text-white/50 hover:text-white text-4xl transition-colors duration-200 z-10 p-4"
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          aria-label="Précédent"
        >
          ‹
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={photo.src}
            alt={photo.title || photo.caption || ''}
            width={1200}
            height={900}
            className="object-contain max-w-full max-h-[80vh]"
            priority
          />
        </div>
        {(photo.title || photo.caption) && (
          <div className="absolute bottom-0 left-0 right-0 text-center pb-2">
            {photo.title && (
              <p
                className="text-white/90 font-cormorant italic text-lg"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                {photo.title}
              </p>
            )}
            {photo.caption && (
              <p
                className="text-white/50 text-xs tracking-wide mt-1"
                style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
              >
                {photo.caption}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Next */}
      {photos.length > 1 && (
        <button
          className="absolute right-4 md:right-8 text-white/50 hover:text-white text-4xl transition-colors duration-200 z-10 p-4"
          onClick={(e) => { e.stopPropagation(); onNext() }}
          aria-label="Suivant"
        >
          ›
        </button>
      )}
    </div>
  )
}
