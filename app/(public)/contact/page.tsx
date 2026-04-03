import { getSettings } from '@/lib/content'
import ContactForm from './ContactForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Contact — Patine' }

export default async function ContactPage() {
  const s = await getSettings()

  return (
    <div className="pt-14">
      {/* En-tête */}
      <div className="max-w-wide mx-auto px-6 lg:px-10 pt-16 pb-10 border-b border-border">
        <p className="text-2xs tracking-caps uppercase text-muted mb-4">Nous contacter</p>
        <h1 className="font-cormorant text-5xl md:text-6xl text-noir">Contact</h1>
      </div>

      <div className="max-w-wide mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-2 gap-16 md:gap-24">
        {/* Formulaire */}
        <div>
          <p className="text-2xs tracking-caps uppercase text-muted mb-8">Votre projet</p>
          <ContactForm />
        </div>

        {/* Infos */}
        <div className="space-y-10">
          <p className="text-2xs tracking-caps uppercase text-muted">L'atelier</p>

          {(s.address.street || s.address.city) && (
            <div>
              <p className="text-2xs tracking-caps uppercase text-muted mb-2">Adresse</p>
              <p className="text-[15px] text-noir leading-relaxed">
                {s.address.street && <span className="block">{s.address.street}</span>}
                {s.address.city && <span className="block">{s.address.city}</span>}
              </p>
            </div>
          )}

          {s.email && (
            <div>
              <p className="text-2xs tracking-caps uppercase text-muted mb-2">Email</p>
              <a href={`mailto:${s.email}`} className="text-[15px] text-noir hover:text-muted transition-colors duration-200">
                {s.email}
              </a>
            </div>
          )}

          {s.phone && (
            <div>
              <p className="text-2xs tracking-caps uppercase text-muted mb-2">Téléphone</p>
              <a href={`tel:${s.phone.replace(/\s/g,'')}`} className="text-[15px] text-noir hover:text-muted transition-colors duration-200">
                {s.phone}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
