import type { MetadataRoute } from 'next'

const SITE_URL = 'https://atelier-patine.fr'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: `${SITE_URL}/`,             lastModified, changeFrequency: 'monthly',  priority: 1.0 },
    { url: `${SITE_URL}/savoir-faire`, lastModified, changeFrequency: 'monthly',  priority: 0.9 },
    { url: `${SITE_URL}/realisations`, lastModified, changeFrequency: 'weekly',   priority: 0.9 },
    { url: `${SITE_URL}/contact`,      lastModified, changeFrequency: 'yearly',   priority: 0.7 },
  ]
}
