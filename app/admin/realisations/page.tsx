'use client'

import { useState, useEffect, useCallback } from 'react'

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
  const [dragOver, setDragOver] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState('')

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

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('destination', 'realisations')
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.path) return data.path
    throw new Error(data.error || "Erreur lors de l'upload")
  }, [])

  async function handleFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (arr.length === 0) return
    setUploading(true)
    setUploadError('')
    try {
      const newPhotos: Photo[] = []
      for (const file of arr) {
        const path = await uploadFile(file)
        if (path) {
          newPhotos.push({
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            src: path,
            title: '',
            caption: '',
            order: photos.length + newPhotos.length,
          })
        }
      }
      const updated = [...photos, ...newPhotos]
      setPhotos(updated)
      await save(updated)
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Erreur lors de l'upload")
    } finally {
      setUploading(false)
    }
  }

  function updatePhoto(id: string, field: keyof Photo, value: string) {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  function deletePhoto(id: string) {
    const updated = photos.filter((p) => p.id !== id).map((p, i) => ({ ...p, order: i }))
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

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Réalisations</h1>
        <div className="flex items-center gap-3">
          {status === 'saved' && <span className="text-sm text-green-600">✓ Enregistré</span>}
          {status === 'error' && <span className="text-sm text-red-500">Erreur</span>}
          <button
            onClick={() => save(photos)}
            disabled={status === 'saving'}
            className="px-5 py-2 text-sm bg-[#1A1A18] text-white rounded hover:bg-[#B8A87A] transition-colors disabled:opacity-50"
          >
            {status === 'saving' ? 'Enregistrement…' : 'Tout enregistrer'}
          </button>
        </div>
      </div>

      {/* Zone d'upload drag & drop */}
      <div
        onDragOver={(e) => { e.preventDefault(); if (!uploading) setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          if (!uploading) handleFiles(e.dataTransfer.files)
        }}
        onClick={() => {
          if (uploading) return
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = 'image/*'
          input.multiple = true
          input.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files
            if (files) handleFiles(files)
          }
          input.click()
        }}
        className={`mb-6 p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200 ${
          uploading ? 'opacity-60 cursor-not-allowed' : ''
        } ${dragOver ? 'border-[#B8A87A] bg-[#B8A87A]/5' : 'border-gray-200 hover:border-gray-300'}`}
      >
        {uploading ? (
          <p className="text-sm text-gray-400">Upload en cours…</p>
        ) : (
          <>
            <p className="text-sm text-gray-500">Glisser-déposer des photos ici</p>
            <p className="text-xs text-gray-400 mt-1">ou cliquer pour parcourir — plusieurs fichiers acceptés</p>
            <p className="text-xs text-gray-300 mt-1">JPG, PNG, WebP — max 10 Mo par image</p>
          </>
        )}
      </div>

      {uploadError && (
        <p className="mb-4 text-sm text-red-500 px-1">{uploadError}</p>
      )}

      {/* Liste des photos */}
      {photos.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">
          Aucune photo pour l'instant. Ajoutez-en ci-dessus.
        </p>
      ) : (
        <div className="space-y-4">
          {photos.map((photo, i) => (
            <div key={photo.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex gap-4">
                {/* Miniature */}
                <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.src} alt={photo.title || ''} className="w-full h-full object-cover" />
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
                  >↑</button>
                  <button
                    onClick={() => moveDown(photo.id)}
                    disabled={i === photos.length - 1}
                    className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
                  >↓</button>

                  {deleteConfirm === photo.id ? (
                    <div className="flex flex-col gap-1 mt-1">
                      <button
                        onClick={() => deletePhoto(photo.id)}
                        className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >Ok</button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                      >Non</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(photo.id)}
                      className="text-xs px-2 py-1 bg-red-50 text-red-400 rounded hover:bg-red-100 transition-colors mt-1"
                    >✕</button>
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
