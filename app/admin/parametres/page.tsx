'use client'

import { useState, useEffect, FormEvent } from 'react'

interface Settings {
  address: { street: string; city: string; country: string }
  email: string
  phone: string
  instagram: string
  footer: string
}

export default function AdminParametres() {
  const [settings, setSettings] = useState<Settings>({
    address: { street: '', city: '', country: '' },
    email: '',
    phone: '',
    instagram: '',
    footer: '© 2025 Patine',
  })
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/admin/get?section=settings')
      .then((r) => r.json())
      .then((d) => setSettings(d))
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

  function setAddr(field: keyof Settings['address'], value: string) {
    setSettings((s) => ({ ...s, address: { ...s.address, [field]: value } }))
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Paramètres</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Adresse */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-3">
            Adresse de l'atelier
          </h2>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Rue</label>
            <input
              type="text"
              value={settings.address.street}
              onChange={(e) => setAddr('street', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Code postal & Ville</label>
            <input
              type="text"
              value={settings.address.city}
              onChange={(e) => setAddr('city', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Pays</label>
            <input
              type="text"
              value={settings.address.country}
              onChange={(e) => setAddr('country', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors"
            />
          </div>
        </section>

        {/* Contact */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-3">
            Informations de contact
          </h2>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings((s) => ({ ...s, email: e.target.value }))}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Téléphone</label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings((s) => ({ ...s, phone: e.target.value }))}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Lien Instagram</label>
            <input
              type="url"
              value={settings.instagram}
              onChange={(e) => setSettings((s) => ({ ...s, instagram: e.target.value }))}
              placeholder="https://www.instagram.com/..."
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors"
            />
          </div>
        </section>

        {/* Footer */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-3 mb-4">
            Footer
          </h2>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Texte du footer</label>
            <input
              type="text"
              value={settings.footer}
              onChange={(e) => setSettings((s) => ({ ...s, footer: e.target.value }))}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B8A87A] transition-colors"
            />
          </div>
        </section>

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
