import Link from 'next/link'

interface FooterProps {
  text?: string
  instagram?: string
  email?: string
  phone?: string
  address?: { street: string; city: string }
}

export default function Footer({ text, instagram, email, phone, address }: FooterProps) {
  return (
    <footer className="border-t border-border mt-auto">
      {/* Grille principale */}
      <div className="max-w-wide mx-auto px-6 lg:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">

        {/* Logo + baseline */}
        <div className="col-span-2 md:col-span-1">
          <p className="font-cormorant text-xl leading-tight text-noir mb-1">Patine</p>
          <p className="text-2xs text-muted tracking-caps uppercase">Atelier d'encadrement</p>
        </div>

        {/* Adresse */}
        {address && (
          <div>
            <p className="text-2xs tracking-caps uppercase text-muted mb-3">Atelier</p>
            <p className="text-[13px] text-noir leading-relaxed">
              {address.street}<br />{address.city}
            </p>
          </div>
        )}

        {/* Contact */}
        {(email || phone) && (
          <div>
            <p className="text-2xs tracking-caps uppercase text-muted mb-3">Contact</p>
            <div className="space-y-1 text-[13px]">
              {email && (
                <a href={`mailto:${email}`} className="block text-noir hover:text-muted transition-colors duration-200">
                  {email}
                </a>
              )}
              {phone && (
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="block text-noir hover:text-muted transition-colors duration-200">
                  {phone}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Liens */}
        <div>
          <p className="text-2xs tracking-caps uppercase text-muted mb-3">Liens</p>
          <div className="space-y-1 text-[13px]">
            <Link href="/savoir-faire" className="block text-noir hover:text-muted transition-colors duration-200">Notre Savoir-faire ↗</Link>
            <Link href="/realisations"  className="block text-noir hover:text-muted transition-colors duration-200">Réalisations ↗</Link>
            <Link href="/contact"       className="block text-noir hover:text-muted transition-colors duration-200">Contact ↗</Link>
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer"
                className="block text-noir hover:text-muted transition-colors duration-200">
                Instagram ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bas de footer */}
      <div className="border-t border-border">
        <div className="max-w-wide mx-auto px-6 lg:px-10 py-4">
          <p className="text-2xs text-muted tracking-caps">
            {text || '© 2025 Patine'}
          </p>
        </div>
      </div>
    </footer>
  )
}
