'use client'

import { useState, useEffect, FormEvent } from 'react'
import ImageUpload from '@/components/ImageUpload'
import RichTextEditor from '@/components/RichTextEditor'

interface Section { id: string; title: string; body: string; image: string }
interface SavoirFaireData {
  pageTitle: string
  heroImage: string
  gallery: string[]
  sections: Section[]
}

const DEFAULT: SavoirFaireData = {
  pageTitle: "L'art de l'encadrement",
  heroImage: '',
  gallery: ['', '', '', ''],
  sections: [
    { id: 'matieres',  title: 'Le Choix des matières',    body: '', image: '' },
    { id: 'processus', title: 'Le Processus',              body: '', image: '' },
    { id: 'clientele', title: "Une clientèle d'exception", body: '', image: '' },
  ],
}

const LABELS: Record<string, string> = {
  matieres:  'Le Choix des matières',
  processus: 'Le Processus',
  clientele: "Une clientèle d'exception",
}

export default function AdminSavoirFaire() {
  const [data, setData]     = useState<SavoirFaireData>(DEFAULT)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/admin/get?section=savoir-faire')
      .then((r) => r.json())
      .then((d) => setData({
        pageTitle: d.pageTitle ?? DEFAULT.pageTitle,
        heroImage: d.heroImage ?? '',
        gallery:   d.gallery?.length === 4 ? d.gallery : ['', '', '', ''],
        sections:  d.sections?.length > 0 ? d.sections : DEFAULT.sections,
      }))
      .catch(() => {})
  }, [])

  const setHero    = (url: string) => setData((d) => ({ ...d, heroImage: url }))
  const setGallery = (i: number, url: string) =>
    setData((d) => { const g = [...d.gallery]; g[i] = url; return { ...d, gallery: g } })
  const updateSection = (id: string, field: keyof Section, value: string) =>
    setData((d) => ({ ...d, sections: d.sections.map((s) => s.id === id ? { ...s, [field]: value } : s) }))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('saving')
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'savoir-faire', data }),
      })
      setStatus(res.ok ? 'saved' : 'error')
      setTimeout(() => setStatus('idle'), 3000)
    } catch { setStatus('error') }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-lg font-medium text-gray-900 mb-8">Savoir-faire</h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Titre de la page */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-[13px] font-medium text-gray-700 border-b border-gray-100 pb-3 mb-4">Titre de la page</h2>
          <input
            type="text"
            value={data.pageTitle}
            onChange={(e) => setData((d) => ({ ...d, pageTitle: e.target.value }))}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            placeholder="L'art de l'encadrement"
          />
        </section>

        {/* Grande image hero */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
          <h2 className="text-[13px] font-medium text-gray-700 border-b border-gray-100 pb-3">Grande image (hero droit)</h2>
          <ImageUpload value={data.heroImage} onChange={setHero} destination="savoir-faire-hero" />
        </section>

        {/* 4 petites photos */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-[13px] font-medium text-gray-700 border-b border-gray-100 pb-3">Frise de 4 photos</h2>
          <div className="grid grid-cols-2 gap-3">
            {data.gallery.map((src, i) => (
              <div key={i}>
                <p className="text-[11px] text-gray-400 mb-1.5">Photo {i + 1}</p>
                <ImageUpload value={src} onChange={(url) => setGallery(i, url)} destination={`savoir-faire-gallery-${i}`} />
              </div>
            ))}
          </div>
        </section>

        {/* Sections de texte */}
        {data.sections.map((section, i) => (
          <section key={section.id} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-[13px] font-medium text-gray-700 border-b border-gray-100 pb-3">
              {i === 0 ? 'Texte d\'introduction (affiché sur le hero)' : `Section — ${LABELS[section.id] || section.id}`}
            </h2>
            <div>
              <label className="block text-[11px] text-gray-400 mb-1.5">Titre</label>
              <input type="text" value={section.title}
                onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 mb-2">Texte</label>
              <RichTextEditor
                value={section.body}
                onChange={(html) => updateSection(section.id, 'body', html)}
              />
            </div>
          </section>
        ))}

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={status === 'saving'}
            className="px-8 py-2.5 text-[13px] bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-40">
            {status === 'saving' ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          {status === 'saved' && <span className="text-[13px] text-green-600">✓ Enregistré</span>}
          {status === 'error'  && <span className="text-[13px] text-red-500">Erreur</span>}
        </div>
      </form>
    </div>
  )
}
