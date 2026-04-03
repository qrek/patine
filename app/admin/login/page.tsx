'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.ok) {
      router.push('/admin')
    } else {
      setError('Identifiants incorrects.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1
            className="font-cormorant italic text-4xl text-[#1A1A18]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Patine
          </h1>
          <p
            className="text-xs tracking-widest uppercase text-[#1A1A18]/40 mt-2"
            style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
          >
            Backoffice
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-xs tracking-widest uppercase text-[#1A1A18]/50 mb-2"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full bg-white border border-[#1A1A18]/15 px-4 py-3 text-sm text-[#1A1A18] focus:outline-none focus:border-[#B8A87A] transition-colors duration-300"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs tracking-widest uppercase text-[#1A1A18]/50 mb-2"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="w-full bg-white border border-[#1A1A18]/15 px-4 py-3 text-sm text-[#1A1A18] focus:outline-none focus:border-[#B8A87A] transition-colors duration-300"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
            />
          </div>

          {error && (
            <p
              className="text-sm text-red-500/70"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs tracking-widest uppercase bg-[#1A1A18] text-[#F7F5F2] hover:bg-[#B8A87A] transition-colors duration-500 disabled:opacity-50"
            style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
