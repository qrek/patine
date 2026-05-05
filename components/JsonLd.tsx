import type { SettingsContent } from '@/lib/content'

export const SITE_URL = 'https://atelier-patine.fr'
export const SITE_NAME = 'Patine'
export const BUSINESS_LEGAL_NAME = "Atelier Patine"

function jsonLdScript(data: object) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/**
 * Schemas globaux (LocalBusiness + Organization + WebSite),
 * injectés une seule fois sur l'ensemble du site public.
 */
export function SiteJsonLd({ settings }: { settings: SettingsContent }) {
  const sameAs = [settings.instagram, settings.linkedin].filter(Boolean) as string[]

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: BUSINESS_LEGAL_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/opengraph-image`,
    image: `${SITE_URL}/opengraph-image`,
    description:
      "Atelier d'encadrement artisanal à Paris : fabrication sur mesure, mise en valeur et conservation d'œuvres d'art.",
    sameAs,
  }

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${SITE_URL}/#localbusiness`,
    name: BUSINESS_LEGAL_NAME,
    alternateName: 'Patine',
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    logo: `${SITE_URL}/opengraph-image`,
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    priceRange: '€€€',
    description:
      "Atelier d'encadrement artisanal à Paris 18e — encadrement sur mesure, mise en valeur d'œuvres d'art et de photographies, conservation muséale.",
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address.street,
      postalCode: (settings.address.city.match(/\b\d{5}\b/) || [''])[0],
      addressLocality: 'Paris',
      addressRegion: 'Île-de-France',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 48.8896,
      longitude: 2.3387,
    },
    areaServed: [
      { '@type': 'City', name: 'Paris' },
      { '@type': 'AdministrativeArea', name: 'Île-de-France' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '17:00',
      },
    ],
    sameAs,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: "Services d'encadrement",
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Fabrication sur mesure',
            description:
              "Fabrication artisanale d'encadrements sur mesure : baguettes en bois massif, passepartouts, verres conservation.",
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: "Mise en valeur d'œuvres",
            description:
              "Conseil et conception d'encadrements pour magnifier œuvres d'art, photographies, tirages, objets et souvenirs.",
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Conservation',
            description:
              "Encadrement de conservation aux normes muséales : matériaux non acides, verres anti-UV, montage réversible.",
          },
        },
      ],
    },
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: 'fr-FR',
    publisher: { '@id': `${SITE_URL}/#organization` },
  }

  return (
    <>
      {jsonLdScript(organization)}
      {jsonLdScript(localBusiness)}
      {jsonLdScript(website)}
    </>
  )
}

/**
 * Fil d'Ariane structuré pour une page donnée.
 * `items` = liste ordonnée [{ name, path }] où path commence par '/'.
 */
export function BreadcrumbsJsonLd({
  items,
}: {
  items: { name: string; path: string }[]
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
  return jsonLdScript(data)
}
