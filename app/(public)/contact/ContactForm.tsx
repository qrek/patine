'use client'

import { useState, FormEvent } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = {
      name:    (form.elements.namedItem('name')    as HTMLInputElement).value,
      email:   (form.elements.namedItem('email')   as HTMLInputElement).value,
      phone:   (form.elements.namedItem('phone')   as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'sent' : 'error')
      if (res.ok) form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="field">
        <input type="text"  name="name"    id="name"    placeholder=" " required />
        <label htmlFor="name">Nom</label>
      </div>
      <div className="field">
        <input type="email" name="email"   id="email"   placeholder=" " required />
        <label htmlFor="email">Email</label>
      </div>
      <div className="field">
        <input type="tel"   name="phone"   id="phone"   placeholder=" " />
        <label htmlFor="phone">Téléphone</label>
      </div>
      <div className="field">
        <textarea name="message" id="message" rows={4} placeholder=" " required className="resize-none" />
        <label htmlFor="message">Message</label>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="text-2xs tracking-caps uppercase border-b border-noir text-noir pb-0.5 hover:text-muted hover:border-muted transition-colors duration-200 disabled:opacity-40"
        >
          {status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message ↗'}
        </button>
      </div>

      {status === 'sent' && (
        <p className="text-[13px] text-muted">Message envoyé — nous reviendrons vers vous rapidement.</p>
      )}
      {status === 'error' && (
        <p className="text-[13px] text-red-500/60">Une erreur est survenue. Écrivez-nous directement.</p>
      )}
    </form>
  )
}
