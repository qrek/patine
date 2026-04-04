'use client'

import { useState, useEffect, FormEvent } from 'react'
import ImageUpload from '@/components/ImageUpload'

interface Settings {
  address: { street: string; city: string; country: string }
  email: string
  phone: string
  instagram: string
  footer: string
  logo: { src: string; srcDark: string; width: number }
}

const DEFAULT: Settings = {
  address: { street: '', city: '', country: '' },
  email: '',
  phone: '',
  instagram: '',
  footer: '© 2025 Patine',
  logo: { src: '', srcDark: '', width: 100 },
}

export default function AdminParametres() {
  const [settings, setSettings] = useState<Settings>(DEFAULT)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/admin/get?section=settings')
      .then((r) => r.json())
      .then((d) => setSettings({ ...DEFAULT, ...d, logo: { ...DEFAULT.logo, ...(d.logo ?? {}) } as Settings['logo'] }))
      .catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('saving')
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'settings', data: settings }),
      })
      setStatus(res.ok ? 'saved' : 'error')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
    }
  }

  const set = (field: keyof Settings, value: string) =>
    setSettings((s) => ({ ...s, [field]: value }))
  const setAddr = (field: keyof Settings['address'], value: string) =>
    setSettings((s) => ({ ...s, address: { ...s.address, [field]: value } }))
  const setLogo = (field: keyof Settings['logo'], value: string | number) =>
    setSettings((s) => ({ ...s, logo: { ...s.logo, [field]: value } }))

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Paramètres</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Logo */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
          <h2 className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-3">Logo</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">Logo — fond clair (noir)</label>
              <ImageUpload value={settings.logo.src} onChange={(url) => setLogo('src', url)} destination="logo-light" />
              <p className="text-[10px] text-gray-300 mt-1">Visible dans la nav après scroll</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Logo — fond sombre (blanc)</label>
              <ImageUpload value={settings.logo.srcDark} onChange={(url) => setLogo('srcDark', url)} destination="logo-dark" />
              <p className="text-[10px] text-gray-300 mt-1">Visible sur le hero de l'accueil</p>
            </div>
          </div>
          {(settings.logo.src || settings.logo.srcDark) && (
            <button type="button" onClick={() => { setLogo('src', ''); setLogo('srcDark', '') }}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors">
              Supprimer les logos → afficher le nom texte
            </button>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-500">Taille du logo</label>
              <span className="text-xs font-medium text-gray-700">{settings.logo.width} px</span>
            </div>
            <input
              type="range"
              min={40}
              max={220}
              step={5}
              value={settings.logo.width}
              onChange={(e) => setLogo('width', Number(e.target.value))}
              className="w-full accent-[#B8A87A]"
            />
            <div className="flex justify-between text-[10px] text-gray-300 mt-1">
              <span>Petit</span>
              <span>Grand</span>
            </div>
          </div>

          {/* Aperçu */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-gray-400 mb-1.5">Sur fond sombre (hero)</p>
              <div className="bg-[#1C1C1A] rounded px-4 py-3 flex items-center min-h-[52px]">
                {settings.logo.srcDark ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.logo.srcDark} alt="logo" style={{ width: settings.logo.width, height: 'auto' }} className="object-contain" />
                ) : settings.logo.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.logo.src} alt="logo" style={{ width: settings.logo.width, height: 'auto' }} className="object-contain brightness-0 invert" />
                ) : (
                  <span className="font-cormorant text-cream leading-none" style={{ fontSize: Math.max(settings.logo.width * 0.3, 22) }}>Patine</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1.5">Sur fond clair (nav scrollée)</p>
              <div className="bg-[#F5F3EF] border border-gray-100 rounded px-4 py-3 flex items-center min-h-[52px]">
                {settings.logo.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.logo.src} alt="logo" style={{ width: settings.logo.width, height: 'auto' }} className="object-contain" />
                ) : settings.logo.srcDark ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.logo.srcDark} alt="logo" style={{ width: settings.logo.width, height: 'auto' }} className="object-contain brightness-0" />
                ) : (
                  <span className="font-cormorant text-noir leading-none" style={{ fontSize: Math.max(settings.logo.width * 0.3, 22) }}>Patine</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Adresse */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-3">
            Adresse de l'atelier
          </h2>
          {[
            { label: 'Rue', field: 'street' as const },
            { label: 'Code postal & Ville', field: 'city' as const },
            { label: 'Pays', field: 'country' as const },
          ].map(({ label, field }) => (
            <div key={field}>
              <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
              <input
                type="text"
                value={settings.address[field]}
                onChange={(e) => setAddr(field, e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors"
              />
            </div>
          ))}
        </section>

        {/* Contact */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-3">
            Informations de contact
          </h2>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Email</label>
            <input type="email" value={settings.email} onChange={(e) => set('email', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Téléphone</label>
            <input type="text" value={settings.phone} onChange={(e) => set('phone', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Lien Instagram</label>
            <input type="url" value={settings.instagram} onChange={(e) => set('instagram', e.target.value)}
              placeholder="https://www.instagram.com/..."
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors" />
          </div>
        </section>

        {/* Footer */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-3 mb-4">Footer</h2>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Texte du footer</label>
            <input type="text" value={settings.footer} onChange={(e) => set('footer', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors" />
          </div>
        </section>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={status === 'saving'}
            className="px-8 py-2.5 text-sm bg-[#1A1A18] text-white rounded hover:bg-[#B8A87A] transition-colors duration-300 disabled:opacity-50">
            {status === 'saving' ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          {status === 'saved' && <span className="text-sm text-green-600">✓ Enregistré</span>}
          {status === 'error'  && <span className="text-sm text-red-500">Erreur lors de la sauvegarde</span>}
        </div>
      </form>
    </div>
  )
}
