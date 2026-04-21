'use client'

import Image from 'next/image'
import { useRef } from 'react'

interface Photo {
  id: string
  src: string
  caption?: string
}

export default function InstagramScroll({ photos }: { photos: Photo[] }) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div className="relative">
      {/* Scroll horizontal avec snap */}
      <div
        ref={ref}
        className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative flex-shrink-0 snap-start overflow-hidden bg-[#D8D6D1] group"
            style={{ width: 'clamp(120px, 16vw, 200px)', aspectRatio: '1/1' }}
          >
            <Image
              src={photo.src}
              alt={photo.caption || ''}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width:640px) 80vw, 30vw"
            />
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-noir/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-[12px] text-cream/80">{photo.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
