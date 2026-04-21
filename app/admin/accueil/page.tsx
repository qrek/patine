'use client'

import { useState, useEffect, FormEvent } from 'react'
import ImageUpload from '@/components/ImageUpload'
import RichTextEditor from '@/components/RichTextEditor'

interface InstagramPhoto { id: string; src: string; caption?: string }
interface HomeContent {
  hero: { title: string; subtitle: string; subtitleSize: number; titleColor: string; image: string }
  intro: { column1: string; column2: string }
  instagramFeed: InstagramPhoto[]
}

const DEFAULT: HomeContent = {
  hero: { title: "L'art d'encadrer", subtitle: 'Atelier d\'encadrement', subtitleSize: 14, titleColor: '#F5F3EF', image: '' },
  intro: { column1: '', column2: '' },
  instagramFeed: [],
}

export default function AdminAccueil() {
  const [content, setContent] = useState<HomeContent>(DEFAULT)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [uploadingInsta, setUploadingInsta] = useState(false)

  useEffect(() => {
    fetch('/api/admin/get?section=home')
      .then((r) => r.json())
      .then((d) => setContent({
        hero: { ...DEFAULT.hero, ...d.hero, titleColor: d.hero?.titleColor ?? '#F5F3EF' },
        intro: { ...DEFAULT.intro, ...d.intro },
        instagramFeed: d.instagramFeed ?? [],
      }))
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
    } catch { setStatus('error') }
  }

  const setHero = (field: keyof HomeContent['hero'], value: string | number) =>
    setContent((c) => ({ ...c, hero: { ...c.hero, [field]: value } }))

  // Instagram feed
  async function addInstaPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingInsta(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('destination', 'instagram')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.path) {
        const newPhoto: InstagramPhoto = {
          id: Date.now().toString(),
          src: data.path,
          caption: '',
        }
        setContent((c) => ({ ...c, instagramFeed: [...c.instagramFeed, newPhoto] }))
      }
    } finally {
      setUploadingInsta(false)
      e.target.value = ''
    }
  }

  function updateInstaCaption(id: string, caption: string) {
    setContent((c) => ({
      ...c,
      instagramFeed: c.instagramFeed.map((p) => p.id === id ? { ...p, caption } : p),
    }))
  }

  function removeInstaPhoto(id: string) {
    setContent((c) => ({ ...c, instagramFeed: c.instagramFeed.filter((p) => p.id !== id) }))
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-lg font-medium text-gray-900 mb-2">Page d'accueil</h1>
      <p className="text-[13px] text-gray-400 mb-8">Modifiez le contenu de la page d'accueil.</p>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Hero ── */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
          <h2 className="text-[13px] font-medium text-gray-700 border-b border-gray-100 pb-3">Section Hero</h2>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">
              Grand titre <span className="text-gray-300">(texte affiché en très grand sur la photo)</span>
            </label>
            <input type="text" value={content.hero.title}
              onChange={(e) => setHero('title', e.target.value)}
              placeholder="L'art d'encadrer"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">
              Couleur du grand titre
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={content.hero.titleColor}
                onChange={(e) => setHero('titleColor', e.target.value)}
                className="w-10 h-9 rounded border border-gray-200 cursor-pointer p-0.5 bg-white"
              />
              <span className="text-[12px] text-gray-500 font-mono">{content.hero.titleColor}</span>
              <button
                type="button"
                onClick={() => setHero('titleColor', '#F5F3EF')}
                className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
              >
                Réinitialiser (crème)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">
              Texte secondaire <span className="text-gray-300">(petite taille, sous le grand titre)</span>
            </label>
            <input type="text" value={content.hero.subtitle}
              onChange={(e) => setHero('subtitle', e.target.value)}
              placeholder="Atelier d'encadrement — Paris"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] text-gray-400">Taille du texte secondaire</label>
              <span className="text-[11px] font-medium text-gray-600">{content.hero.subtitleSize}px</span>
            </div>
            <input type="range" min={10} max={48} step={1}
              value={content.hero.subtitleSize}
              onChange={(e) => setHero('subtitleSize', Number(e.target.value))}
              className="w-full accent-gray-900"
            />
            <div className="flex justify-between text-[10px] text-gray-300 mt-0.5">
              <span>Petit</span><span>Grand</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-2">Image hero</label>
            <ImageUpload
              value={content.hero.image}
              onChange={(url) => setHero('image', url)}
              destination="hero"
            />
          </div>
        </section>

        {/* ── Intro ── */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
          <h2 className="text-[13px] font-medium text-gray-700 border-b border-gray-100 pb-3">Section Introduction</h2>
          <div>
            <label className="block text-[11px] text-gray-400 mb-2">Colonne gauche</label>
            <RichTextEditor
              value={content.intro.column1}
              onChange={(html) => setContent((c) => ({ ...c, intro: { ...c.intro, column1: html } }))}
            />
          </div>
          <div>
            <label className="block text-[11px] text-gray-400 mb-2">Colonne droite</label>
            <RichTextEditor
              value={content.intro.column2}
              onChange={(html) => setContent((c) => ({ ...c, intro: { ...c.intro, column2: html } }))}
            />
          </div>
        </section>

        {/* ── Instagram feed ── */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-[13px] font-medium text-gray-700 border-b border-gray-100 pb-3">
            Section Instagram (scroll de photos)
          </h2>
          <p className="text-[12px] text-gray-400">Ces photos s'affichent en défilement horizontal en bas de la page d'accueil.</p>

          {/* Liste photos existantes */}
          {content.instagramFeed.length > 0 && (
            <div className="space-y-3">
              {content.instagramFeed.map((photo) => (
                <div key={photo.id} className="flex gap-3 items-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.src} alt="" className="w-16 h-16 object-cover rounded flex-shrink-0" />
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Légende (optionnelle)"
                      value={photo.caption || ''}
                      onChange={(e) => updateInstaCaption(photo.id, e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-1.5 text-[13px] focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInstaPhoto(photo.id)}
                    className="text-[11px] text-gray-400 hover:text-red-400 transition-colors flex-shrink-0 mt-1.5"
                  >
                    Suppr.
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Ajouter */}
          <label className="inline-flex items-center gap-2 cursor-pointer text-[12px] text-gray-500 border border-gray-200 rounded px-4 py-2 hover:border-gray-400 transition-colors">
            {uploadingInsta ? 'Upload…' : '+ Ajouter une photo'}
            <input type="file" accept="image/*" className="hidden" onChange={addInstaPhoto} disabled={uploadingInsta} />
          </label>
        </section>

        {/* ── Enregistrer ── */}
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
