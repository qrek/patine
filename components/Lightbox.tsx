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

      {/* Image + légende */}
      <div
        className="flex flex-col items-center gap-3 max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.title || photo.caption || ''}
          width={1200}
          height={900}
          className="object-contain max-w-full max-h-[78vh]"
          priority
        />
        {(photo.title || photo.caption) && (
          <div className="text-center px-4">
            {photo.title && (
              <p className="text-white/90 text-[15px] font-medium">
                {photo.title}
              </p>
            )}
            {photo.caption && (
              <p className="text-white/50 text-xs tracking-wide mt-1">
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
