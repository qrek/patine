'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Lightbox from '@/components/Lightbox'

interface Photo {
  id: string; src: string; title?: string; caption?: string; order: number
}

function PhotoCard({ photo, index, onClick }: { photo: Photo; index: number; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.unobserve(el)
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <button
      ref={ref}
      onClick={onClick}
      style={{
        opacity: 0,
        transform: 'translateY(32px)',
        transition: `opacity 0.7s ease ${(index % 4) * 0.1}s, transform 0.7s ease ${(index % 4) * 0.1}s`,
      }}
      className="group relative overflow-hidden bg-[#D8D6D1] focus:outline-none w-full block"
      aria-label={photo.title || `Photo ${index + 1}`}
    >
      <div className="relative w-full aspect-[4/5]">
        <Image
          src={photo.src}
          alt={photo.title || ''}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width:640px) 100vw, 50vw"
        />
      </div>

      {(photo.title || photo.caption) && (
        <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-noir/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {photo.title   && <p className="font-cormorant text-lg text-cream">{photo.title}</p>}
          {photo.caption && <p className="text-[12px] text-cream/60 mt-0.5">{photo.caption}</p>}
        </div>
      )}
    </button>
  )
}

export default function RealisationsGrid({ photos }: { photos: Photo[] }) {
  const [idx, setIdx] = useState<number | null>(null)

  const left  = photos.filter((_, i) => i % 2 === 0)
  const right = photos.filter((_, i) => i % 2 === 1)

  return (
    <>
      <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-7">
          {/* Colonne gauche */}
          <div className="space-y-5 md:space-y-7">
            {left.map((photo) => {
              const i = photos.indexOf(photo)
              return <PhotoCard key={photo.id} photo={photo} index={i} onClick={() => setIdx(i)} />
            })}
          </div>
          {/* Colonne droite — décalée vers le bas */}
          <div className="space-y-5 md:space-y-7 sm:mt-20">
            {right.map((photo) => {
              const i = photos.indexOf(photo)
              return <PhotoCard key={photo.id} photo={photo} index={i} onClick={() => setIdx(i)} />
            })}
          </div>
        </div>
      </div>

      {idx !== null && (
        <Lightbox
          photos={photos}
          currentIndex={idx}
          onClose={() => setIdx(null)}
          onPrev={() => setIdx(i => i === null ? null : (i - 1 + photos.length) % photos.length)}
          onNext={() => setIdx(i => i === null ? null : (i + 1) % photos.length)}
        />
      )}
    </>
  )
}
