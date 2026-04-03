'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Photo {
  id: string
  src: string
  title?: string
  caption?: string
  order: number
}

export default function AdminRealisations() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [uploading, setUploading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/get?section=realisations')
      .then((r) => r.json())
      .then((d) => setPhotos((d.photos ?? []).sort((a: Photo, b: Photo) => (a.order ?? 0) - (b.order ?? 0))))
      .catch(() => {})
  }, [])

  async function save(updatedPhotos: Photo[]) {
    setStatus('saving')
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'realisations', data: { photos: updatedPhotos } }),
      })
      setStatus(res.ok ? 'saved' : 'error')
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('destination', 'realisations')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.path) {
        const newPhoto: Photo = {
          id: Date.now().toString(),
          src: data.path,
          title: '',
          caption: '',
          order: photos.length,
        }
        const updated = [...photos, newPhoto]
        setPhotos(updated)
        await save(updated)
      }
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function updatePhoto(id: string, field: keyof Photo, value: string) {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  function deletePhoto(id: string) {
    const updated = photos
      .filter((p) => p.id !== id)
      .map((p, i) => ({ ...p, order: i }))
    setPhotos(updated)
    setDeleteConfirm(null)
    save(updated)
  }

  function moveUp(id: string) {
    const idx = photos.findIndex((p) => p.id === id)
    if (idx === 0) return
    const updated = [...photos]
    ;[updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]]
    const reordered = updated.map((p, i) => ({ ...p, order: i }))
    setPhotos(reordered)
    save(reordered)
  }

  function moveDown(id: string) {
    const idx = photos.findIndex((p) => p.id === id)
    if (idx === photos.length - 1) return
    const updated = [...photos]
    ;[updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]]
    const reordered = updated.map((p, i) => ({ ...p, order: i }))
    setPhotos(reordered)
    save(reordered)
  }

  async function saveAll() {
    await save(photos)
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Réalisations</h1>
        <div className="flex items-center gap-3">
          {status === 'saved' && <span className="text-sm text-green-600">✓ Enregistré</span>}
          {status === 'error' && <span className="text-sm text-red-500">Erreur</span>}
          <button
            onClick={saveAll}
            disabled={status === 'saving'}
            className="px-5 py-2 text-sm bg-[#1A1A18] text-white rounded hover:bg-[#B8A87A] transition-colors disabled:opacity-50"
          >
            {status === 'saving' ? 'Enregistrement…' : 'Tout enregistrer'}
          </button>
        </div>
      </div>

      {/* Ajouter une photo */}
      <div className="mb-8 p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
        <label
          htmlFor="photo-upload"
          className="inline-block cursor-pointer text-sm px-6 py-2.5 bg-white border border-gray-300 rounded text-gray-600 hover:border-[#B8A87A] hover:text-[#B8A87A] transition-colors"
        >
          {uploading ? 'Upload en cours…' : '+ Ajouter une photo'}
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
        <p className="text-xs text-gray-400 mt-2">JPG, PNG, WebP — max 10 Mo</p>
      </div>

      {/* Liste des photos */}
      {photos.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">
          Aucune photo pour l'instant. Ajoutez-en une ci-dessus.
        </p>
      ) : (
        <div className="space-y-4">
          {photos.map((photo, i) => (
            <div key={photo.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex gap-4">
                {/* Miniature */}
                <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image src={photo.src} alt={photo.title || ''} fill className="object-cover" />
                </div>

                {/* Champs */}
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Titre (optionnel)"
                    value={photo.title || ''}
                    onChange={(e) => updatePhoto(photo.id, 'title', e.target.value)}
                    className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Légende (optionnelle)"
                    value={photo.caption || ''}
                    onChange={(e) => updatePhoto(photo.id, 'caption', e.target.value)}
                    className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    onClick={() => moveUp(photo.id)}
                    disabled={i === 0}
                    className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
                    title="Monter"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(photo.id)}
                    disabled={i === photos.length - 1}
                    className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
                    title="Descendre"
                  >
                    ↓
                  </button>

                  {deleteConfirm === photo.id ? (
                    <div className="flex flex-col gap-1 mt-1">
                      <button
                        onClick={() => deletePhoto(photo.id)}
                        className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(photo.id)}
                      className="text-xs px-2 py-1 bg-red-50 text-red-400 rounded hover:bg-red-100 transition-colors mt-1"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
