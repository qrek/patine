import Image from 'next/image'
import type { Metadata } from 'next'
import { getSettings } from '@/lib/content'
import { BreadcrumbsJsonLd } from '@/components/JsonLd'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Contactez l'atelier Patine pour vos projets d'encadrement sur mesure à Paris. Atelier au 83 rue Lamarck, Paris 18e — devis et conseils personnalisés.",
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact — Atelier Patine',
    description:
      "Atelier d'encadrement à Paris 18e. Demandez un devis ou prenez rendez-vous.",
    url: 'https://atelier-patine.fr/contact',
    type: 'website',
  },
}

export default async function ContactPage() {
  const s = await getSettings()
  const hasImage = Boolean(s.contactImage)

  return (
    <div className="pt-14 min-h-[calc(100vh-3.5rem)] flex flex-col md:flex-row">
      <BreadcrumbsJsonLd
        items={[
          { name: 'Accueil', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />

      {/* ── Image (panneau gauche) ── */}
      {hasImage && (
        <div className="relative h-[55vw] max-h-[60vh] md:h-auto md:max-h-none md:w-[40%] flex-shrink-0 overflow-hidden">
          <Image
            src={s.contactImage!}
            alt="Atelier Patine"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      )}

      {/* ── Contenu ── */}
      <div className={`flex-1 flex flex-col justify-center px-8 lg:px-14 xl:px-20 py-12 md:py-16 ${!hasImage ? 'max-w-3xl mx-auto w-full' : ''}`}>

        {/* En-tête */}
        <div className="mb-10 md:mb-12">
          <p className="text-2xs tracking-caps uppercase text-muted mb-3">Nous contacter</p>
          <h1 className="font-power text-5xl md:text-6xl lg:text-7xl text-noir leading-none">Contact</h1>
        </div>

        {/* CTA email mis en avant + infos atelier */}
        <div className="space-y-12 lg:space-y-16">

          {/* Bloc principal : email en CTA */}
          {s.email && (
            <div>
              <p className="text-2xs tracking-caps uppercase text-muted mb-5">Votre projet</p>
              <p className="text-[15px] text-noir-soft leading-relaxed max-w-[460px] mb-7">
                Pour toute demande d&apos;encadrement, partagez-nous votre projet par email — nous vous répondons sous 48 h.
              </p>
              <a
                href={`mailto:${s.email}`}
                className="inline-block font-power text-3xl md:text-4xl lg:text-5xl text-noir leading-none border-b border-noir pb-1 hover:text-muted hover:border-muted transition-colors duration-200 break-all"
              >
                {s.email}
              </a>
            </div>
          )}

          {/* Infos secondaires : adresse + téléphone */}
          {(s.address.street || s.address.city || s.phone) && (
            <div className="grid sm:grid-cols-2 gap-8 lg:gap-12 pt-10 border-t border-border">
              {(s.address.street || s.address.city) && (
                <div>
                  <p className="text-2xs tracking-caps uppercase text-muted mb-2">Adresse</p>
                  <p className="text-[15px] text-noir leading-relaxed">
                    {s.address.street && <span className="block">{s.address.street}</span>}
                    {s.address.city   && <span className="block">{s.address.city}</span>}
                  </p>
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
          )}

        </div>
      </div>
    </div>
  )
}
