'use client'

import { useState, useEffect, FormEvent } from 'react'
import ImageUpload from '@/components/ImageUpload'

interface HomeContent {
  hero: { title: string; subtitle: string; image: string }
  intro: { column1: string; column2: string }
}

export default function AdminAccueil() {
  const [content, setContent] = useState<HomeContent>({
    hero: { title: '', subtitle: '', image: '' },
    intro: { column1: '', column2: '' },
  })
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/admin/get?section=home')
      .then((r) => r.json())
      .then((d) => setContent(d))
      .catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('saving')
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'home', data: content }),
      })
      setStatus(res.ok ? 'saved' : 'error')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Page d'accueil</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hero */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
          <h2 className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-3">
            Section Hero
          </h2>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Titre principal</label>
            <input
              type="text"
              value={content.hero.title}
              onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, title: e.target.value } }))}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Sous-titre</label>
            <input
              type="text"
              value={content.hero.subtitle}
              onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, subtitle: e.target.value } }))}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2">Image hero</label>
            <ImageUpload
              value={content.hero.image}
              onChange={(url) => setContent((c) => ({ ...c, hero: { ...c.hero, image: url } }))}
              destination="hero"
            />
          </div>
        </section>

        {/* Intro */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
          <h2 className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-3">
            Section Introduction
          </h2>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Colonne gauche</label>
            <textarea
              rows={5}
              value={content.intro.column1}
              onChange={(e) => setContent((c) => ({ ...c, intro: { ...c.intro, column1: e.target.value } }))}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Colonne droite</label>
            <textarea
              rows={5}
              value={content.intro.column2}
              onChange={(e) => setContent((c) => ({ ...c, intro: { ...c.intro, column2: e.target.value } }))}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors resize-none"
            />
          </div>
        </section>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={status === 'saving'}
            className="px-8 py-2.5 text-sm bg-[#1A1A18] text-white rounded hover:bg-[#B8A87A] transition-colors duration-300 disabled:opacity-50"
          >
            {status === 'saving' ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          {status === 'saved' && <span className="text-sm text-green-600">✓ Enregistré</span>}
          {status === 'error' && <span className="text-sm text-red-500">Erreur lors de la sauvegarde</span>}
        </div>
      </form>
    </div>
  )
}
