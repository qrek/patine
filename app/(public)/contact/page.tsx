import { getSettings } from '@/lib/content'
import ContactForm from './ContactForm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Contact — Patine',
  description: 'Contactez l\'atelier Patine pour votre projet d\'encadrement artisanal à Paris.',
}

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <div className="pt-32 pb-28 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="accent-line mx-auto mb-8" />
          <h1
            className="font-cormorant italic text-5xl md:text-6xl font-light tracking-wider text-[#1A1A18]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Contact
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Formulaire */}
          <div>
            <p
              className="text-xs tracking-widest uppercase text-[#B8A87A] mb-8"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
            >
              Votre projet
            </p>
            <ContactForm />
          </div>

          {/* Adresse & infos */}
          <div className="md:pl-8">
            <p
              className="text-xs tracking-widest uppercase text-[#B8A87A] mb-8"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
            >
              L'atelier
            </p>

            <div className="space-y-8">
              {(settings.address.street || settings.address.city) && (
                <div>
                  <p
                    className="text-[15px] leading-loose text-[#1A1A18]/80"
                    style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
                  >
                    {settings.address.street && <span className="block">{settings.address.street}</span>}
                    {settings.address.city && <span className="block">{settings.address.city}</span>}
                    {settings.address.country && <span className="block">{settings.address.country}</span>}
                  </p>
                </div>
              )}

              {settings.email && (
                <div>
                  <p
                    className="text-xs tracking-widest uppercase text-[#1A1A18]/40 mb-1"
                    style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
                  >
                    Email
                  </p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-[15px] text-[#1A1A18]/80 hover:text-[#B8A87A] transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
                  >
                    {settings.email}
                  </a>
                </div>
              )}

              {settings.phone && (
                <div>
                  <p
                    className="text-xs tracking-widest uppercase text-[#1A1A18]/40 mb-1"
                    style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
                  >
                    Téléphone
                  </p>
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, '')}`}
                    className="text-[15px] text-[#1A1A18]/80 hover:text-[#B8A87A] transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
                  >
                    {settings.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
