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
        transform: 'translateY(28px)',
        transition: `opacity 0.65s ease ${(index % 3) * 0.12}s, transform 0.65s ease ${(index % 3) * 0.12}s`,
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
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
        />
          {/* Overlay hover avec titre */}
        {(photo.title || photo.caption) && (
          <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/45 transition-colors duration-500 flex items-end">
            <div className="w-full p-5 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
              {photo.title   && <p className="text-[15px] font-medium text-cream leading-tight">{photo.title}</p>}
              {photo.caption && <p className="text-[12px] text-cream/70 mt-1">{photo.caption}</p>}
            </div>
          </div>
        )}
      </div>
    </button>
  )
}

export default function RealisationsGrid({ photos }: { photos: Photo[] }) {
  const [idx, setIdx] = useState<number | null>(null)

  const col0 = photos.filter((_, i) => i % 3 === 0)
  const col1 = photos.filter((_, i) => i % 3 === 1)
  const col2 = photos.filter((_, i) => i % 3 === 2)

  return (
    <>
      <div className="px-2 sm:px-3 lg:px-5">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            {col0.map((photo) => {
              const i = photos.indexOf(photo)
              return <PhotoCard key={photo.id} photo={photo} index={i} onClick={() => setIdx(i)} />
            })}
          </div>
          <div className="space-y-2 sm:space-y-3 lg:space-y-4 mt-10 sm:mt-16">
            {col1.map((photo) => {
              const i = photos.indexOf(photo)
              return <PhotoCard key={photo.id} photo={photo} index={i} onClick={() => setIdx(i)} />
            })}
          </div>
          <div className="hidden lg:block space-y-4 lg:mt-28">
            {col2.map((photo) => {
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
