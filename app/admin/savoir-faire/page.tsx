'use client'

import { useState, useEffect, FormEvent } from 'react'
import ImageUpload from '@/components/ImageUpload'

interface Section {
  id: string
  title: string
  body: string
  image: string
}

const DEFAULT_SECTIONS: Section[] = [
  { id: 'matieres',  title: 'Le Choix des matières',    body: '', image: '' },
  { id: 'processus', title: 'Le Processus',              body: '', image: '' },
  { id: 'clientele', title: "Une clientèle d'exception", body: '', image: '' },
]

const SECTION_LABELS: Record<string, string> = {
  matieres:  'Le Choix des matières',
  processus: 'Le Processus',
  clientele: "Une clientèle d'exception",
}

export default function AdminSavoirFaire() {
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/admin/get?section=savoir-faire')
      .then((r) => r.json())
      .then((d) => {
        if (d.sections && d.sections.length > 0) setSections(d.sections)
      })
      .catch(() => {})
  }, [])

  function updateSection(id: string, field: keyof Section, value: string) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('saving')
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'savoir-faire', data: { sections } }),
      })
      setStatus(res.ok ? 'saved' : 'error')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Savoir-faire</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {sections.map((section, i) => (
          <section key={section.id} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-3">
              <span className="text-[#B8A87A] mr-2">0{i + 1}</span>
              {SECTION_LABELS[section.id] || section.id}
            </h2>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Titre</label>
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Texte</label>
              <textarea
                rows={5}
                value={section.body}
                onChange={(e) => updateSection(section.id, 'body', e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-2">Photo</label>
              <ImageUpload
                value={section.image}
                onChange={(url) => updateSection(section.id, 'image', url)}
                destination={`savoir-faire-${section.id}`}
              />
            </div>
          </section>
        ))}

        <div className="flex items-center gap-4 pt-2">
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
