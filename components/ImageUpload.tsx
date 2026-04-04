'use client'

import { useState, useCallback, useRef } from 'react'

interface Props {
  value: string
  onChange: (url: string) => void
  destination: string
  disabled?: boolean
}

export default function ImageUpload({ value, onChange, destination, disabled }: Props) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(async (file: File) => {
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    fd.append('destination', destination)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.path) {
        onChange(data.path)
      } else {
        setError(data.error || "Erreur lors de l'upload")
      }
    } catch {
      setError("Erreur lors de l'upload")
    } finally {
      setUploading(false)
    }
  }, [destination, onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (disabled || uploading) return
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }, [upload, disabled, uploading])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) upload(file)
    e.target.value = ''
  }, [upload])

  const isDisabled = disabled || uploading

  return (
    <div className="space-y-1.5">
      <div
        onDragOver={(e) => { e.preventDefault(); if (!isDisabled) setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isDisabled && inputRef.current?.click()}
        className={`relative rounded-lg overflow-hidden border-2 border-dashed transition-colors duration-200 ${
          isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
        } ${dragOver ? 'border-[#B8A87A] bg-[#B8A87A]/5' : 'border-gray-200 hover:border-gray-300'}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
          disabled={isDisabled}
        />

        {value ? (
          <div className="relative w-full aspect-video bg-gray-100 group min-h-[100px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
              <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {uploading ? 'Upload…' : '↑ Changer l\'image'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            {uploading ? (
              <p className="text-sm text-gray-400">Upload en cours…</p>
            ) : (
              <>
                <p className="text-sm text-gray-500">Glisser-déposer une image ici</p>
                <p className="text-xs text-gray-400 mt-1">ou cliquer pour parcourir</p>
                <p className="text-xs text-gray-300 mt-2">JPG, PNG, WebP — max 10 Mo</p>
              </>
            )}
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="text-sm text-gray-500">Upload…</span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 px-0.5">{error}</p>
      )}
    </div>
  )
}
