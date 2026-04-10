import Link from 'next/link'

interface FooterProps {
  text?: string
  instagram?: string
  email?: string
  phone?: string
  hours?: string
  address?: { street: string; city: string; country?: string }
  logoSrc?: string
  logoWidth?: number
}

export default function Footer({ text, instagram, email, phone, hours, address, logoSrc, logoWidth = 100 }: FooterProps) {
  return (
    <footer className="border-t border-border bg-cream w-full">

      {/* ── Bande principale ── */}
      <div className="w-full max-w-wide mx-auto px-5 lg:px-8 py-8 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 items-start">

          {/* Logo / nom */}
          <div>
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt="Patine"
                style={{ width: Math.min(logoWidth, 120), height: 'auto' }}
                className="object-contain"
              />
            ) : (
              <span className="font-cormorant text-[18px] leading-tight text-noir">Patine</span>
            )}
          </div>

          {/* Adresse */}
          {address && (address.street || address.city) && (
            <div>
              <p className="text-[13px] text-noir leading-relaxed whitespace-pre-line">
                {[address.street, address.city].filter(Boolean).join('\n')}
              </p>
            </div>
          )}

          {/* Horaires */}
          {hours && (
            <div>
              <p className="text-[13px] text-noir leading-relaxed whitespace-pre-line">{hours}</p>
            </div>
          )}

          {/* Email + Tél */}
          {(email || phone) && (
            <div className="space-y-0.5">
              {email && (
                <a href={`mailto:${email}`} className="block text-[13px] text-noir hover:text-muted transition-colors duration-200">
                  {email}
                </a>
              )}
              {phone && (
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="block text-[13px] text-noir hover:text-muted transition-colors duration-200">
                  {phone}
                </a>
              )}
            </div>
          )}

          {/* Liens */}
          <div className="space-y-0.5">
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[13px] text-noir underline underline-offset-2 decoration-border hover:decoration-muted hover:text-muted transition-colors duration-200"
              >
                Instagram ↗
              </a>
            )}
            <Link href="/contact" className="block text-[13px] text-noir underline underline-offset-2 decoration-border hover:decoration-muted hover:text-muted transition-colors duration-200">
              Contact ↗
            </Link>
            <Link href="/savoir-faire" className="block text-[13px] text-noir underline underline-offset-2 decoration-border hover:decoration-muted hover:text-muted transition-colors duration-200">
              Notre Savoir-faire ↗
            </Link>
          </div>

        </div>
      </div>

      {/* ── Copyright ── */}
      <div className="border-t border-border">
        <div className="w-full max-w-wide mx-auto px-5 lg:px-8 py-3">
          <p className="text-[11px] text-muted tracking-wide">
            {text || '© 2025 Patine'}
          </p>
        </div>
      </div>

    </footer>
  )
}
