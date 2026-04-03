'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form  = e.currentTarget
    const email    = (form.elements.namedItem('email')    as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.ok) {
      router.push('/admin')
    } else {
      setError('Identifiants incorrects.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F8F7] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10">
          <p className="font-cormorant text-2xl text-gray-900">Patine</p>
          <p className="text-[11px] tracking-widest uppercase text-gray-400 mt-0.5">Backoffice</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] tracking-widest uppercase text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email" name="email" id="email" required
              className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-900 outline-none focus:border-gray-400 transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-[11px] tracking-widest uppercase text-gray-400 mb-2" htmlFor="password">
              Mot de passe
            </label>
            <input
              type="password" name="password" id="password" required
              className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-900 outline-none focus:border-gray-400 transition-colors duration-200"
            />
          </div>

          {error && <p className="text-[13px] text-red-500">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full mt-2 py-2.5 bg-gray-900 text-white text-[13px] tracking-wide rounded-md hover:bg-gray-700 transition-colors duration-200 disabled:opacity-40"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
