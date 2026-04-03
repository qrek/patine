'use client'

import { useState, FormEvent } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Nom */}
      <div className="floating-label-group">
        <input
          type="text"
          name="name"
          id="name"
          placeholder=" "
          required
          className="peer"
        />
        <label htmlFor="name">Nom</label>
      </div>

      {/* Email */}
      <div className="floating-label-group">
        <input
          type="email"
          name="email"
          id="email"
          placeholder=" "
          required
          className="peer"
        />
        <label htmlFor="email">Email</label>
      </div>

      {/* Téléphone */}
      <div className="floating-label-group">
        <input
          type="tel"
          name="phone"
          id="phone"
          placeholder=" "
          className="peer"
        />
        <label htmlFor="phone">Téléphone</label>
      </div>

      {/* Message */}
      <div className="floating-label-group">
        <textarea
          name="message"
          id="message"
          rows={5}
          placeholder=" "
          required
          className="peer resize-none"
        />
        <label htmlFor="message">Message</label>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full md:w-auto px-12 py-4 text-xs tracking-widest uppercase border border-[#1A1A18] text-[#1A1A18] hover:bg-[#1A1A18] hover:text-[#F7F5F2] transition-all duration-500 disabled:opacity-50"
          style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
        >
          {status === 'sending' ? 'Envoi…' : 'Envoyer'}
        </button>
      </div>

      {status === 'sent' && (
        <p
          className="text-sm text-[#B8A87A] tracking-wide"
          style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
        >
          Message envoyé. Nous vous répondrons dans les meilleurs délais.
        </p>
      )}
      {status === 'error' && (
        <p
          className="text-sm text-red-500/70 tracking-wide"
          style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
        >
          Une erreur est survenue. Veuillez réessayer ou nous écrire directement.
        </p>
      )}
    </form>
  )
}
