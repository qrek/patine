import Image from 'next/image'
import { getSettings } from '@/lib/content'
import ContactForm from './ContactForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Contact — Patine' }

export default async function ContactPage() {
  const s = await getSettings()
  const hasImage = Boolean(s.contactImage)

  return (
    <div className="pt-14 min-h-[calc(100vh-3.5rem)] flex flex-col md:flex-row">

      {/* ── Image (panneau gauche) ── */}
      {hasImage && (
        <div className="relative h-[38vw] max-h-[55vh] md:h-auto md:max-h-none md:w-[40%] flex-shrink-0 overflow-hidden">
          <Image
            src={s.contactImage!}
            alt="Atelier Patine"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* ── Contenu ── */}
      <div className={`flex-1 flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-12 md:py-16 ${!hasImage ? 'max-w-3xl mx-auto w-full' : ''}`}>

        {/* En-tête */}
        <div className="mb-10 md:mb-12">
          <p className="text-2xs tracking-caps uppercase text-muted mb-3">Nous contacter</p>
          <h1 className="font-power text-5xl md:text-6xl lg:text-7xl text-noir leading-none">Contact</h1>
        </div>

        {/* Grille : infos | formulaire */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">

          {/* Infos atelier */}
          <div className="space-y-7">
            {(s.address.street || s.address.city) && (
              <div>
                <p className="text-2xs tracking-caps uppercase text-muted mb-2">Adresse</p>
                <p className="text-[15px] text-noir leading-relaxed">
                  {s.address.street && <span className="block">{s.address.street}</span>}
                  {s.address.city   && <span className="block">{s.address.city}</span>}
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

          {/* Formulaire */}
          <div>
            <p className="text-2xs tracking-caps uppercase text-muted mb-8">Votre projet</p>
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  )
}
