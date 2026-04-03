'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from '@/components/Lightbox'

interface Photo {
  id: string; src: string; title?: string; caption?: string; order: number
}

export default function RealisationsGrid({ photos }: { photos: Photo[] }) {
  const [idx, setIdx] = useState<number | null>(null)

  return (
    <>
      {/* Grille — gap 1px comme dans la référence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setIdx(i)}
            className="group relative aspect-square overflow-hidden bg-cream focus:outline-none"
            aria-label={photo.title || `Photo ${i + 1}`}
          >
            <Image
              src={photo.src}
              alt={photo.title || ''}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
            />
            {/* Légende au hover */}
            {(photo.title || photo.caption) && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-noir/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {photo.title   && <p className="font-cormorant text-lg text-cream">{photo.title}</p>}
                {photo.caption && <p className="text-[12px] text-cream/60 mt-0.5">{photo.caption}</p>}
              </div>
            )}
          </button>
        ))}
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
