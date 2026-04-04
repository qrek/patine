/**
 * Couche d'abstraction pour la lecture/écriture du contenu.
 * En développement : lecture/écriture dans /content/*.json
 * En production (Vercel) : utilise Upstash Redis
 */

import fs from 'fs'
import path from 'path'

// Support des deux conventions de nommage (Vercel KV legacy + Upstash marketplace)
const kvUrl   = process.env.KV_REST_API_URL   ?? process.env.UPSTASH_REDIS_REST_URL
const kvToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN

const isProduction = process.env.NODE_ENV === 'production' && !!kvUrl

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HomeContent {
  hero: { title: string; subtitle: string; image: string }
  intro: { column1: string; column2: string }
}

export interface SavoirFaireSection {
  id: string
  title: string
  body: string
  image: string
}

export interface SavoirFaireContent {
  sections: SavoirFaireSection[]
}

export interface RealisationPhoto {
  id: string
  src: string
  title?: string
  caption?: string
  order: number
}

export interface RealisationsContent {
  photos: RealisationPhoto[]
}

export interface SettingsContent {
  address: { street: string; city: string; country: string }
  email: string
  phone: string
  instagram: string
  footer: string
  logo: { src: string; width: number }
}

// ─── Helpers locaux ───────────────────────────────────────────────────────────

function readJson<T>(filename: string, fallback: T): T {
  try {
    const filePath = path.join(process.cwd(), 'content', filename)
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(filename: string, data: unknown): void {
  const filePath = path.join(process.cwd(), 'content', filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

// ─── KV helpers ───────────────────────────────────────────────────────────────

async function kvGet<T>(key: string, fallback: T): Promise<T> {
  try {
    const { Redis } = await import('@upstash/redis')
    const redis = new Redis({ url: kvUrl!, token: kvToken! })
    const value = await redis.get<T>(key)
    return value ?? fallback
  } catch {
    return fallback
  }
}

async function kvSet(key: string, data: unknown): Promise<void> {
  const { Redis } = await import('@upstash/redis')
  const redis = new Redis({ url: kvUrl!, token: kvToken! })
  await redis.set(key, data)
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const homeDefault: HomeContent = {
  hero: { title: "L'art d'encadrer", subtitle: 'Atelier Patine — Paris', image: '' },
  intro: {
    column1: "Patine est un atelier d'encadrement artisanal fondé à Paris, dédié à la mise en valeur des œuvres d'art, photographies et créations qui vous sont chères.",
    column2: "Chaque encadrement est pensé comme une œuvre en soi — le choix des matières, la précision du geste, l'harmonie des proportions. Un savoir-faire transmis, une attention portée à chaque détail.",
  },
}

const sfDefault: SavoirFaireContent = {
  sections: [
    {
      id: 'matieres',
      title: 'Le Choix des matières',
      body: "Baguettes en bois massif, passepartouts en carton muséal, verres anti-reflets ou conservation UV — chaque matériau est sélectionné pour sa qualité, sa durabilité et son rapport à l'œuvre encadrée. Nous travaillons exclusivement avec des fournisseurs européens partageant notre exigence.",
      image: '',
    },
    {
      id: 'processus',
      title: 'Le Processus',
      body: "De la première consultation à la pose finale, chaque étape est conduite avec soin. Nous prenons le temps d'écouter vos attentes, d'étudier l'œuvre sous différentes lumières, de proposer plusieurs combinaisons avant de poser le premier coup de coupe. Rien n'est laissé au hasard.",
      image: '',
    },
    {
      id: 'clientele',
      title: "Une clientèle d'exception",
      body: "Collectionneurs, galeries parisiennes, institutions culturelles et particuliers passionnés — nous avons le privilège d'accompagner des projets d'une grande diversité. Chaque client apporte sa vision, et nous mettons notre expertise au service de cette singularité.",
      image: '',
    },
  ],
}

const realisationsDefault: RealisationsContent = { photos: [] }

const settingsDefault: SettingsContent = {
  address: { street: '', city: '', country: '' },
  email: '',
  phone: '',
  instagram: '',
  footer: '© 2025 Patine',
  logo: { src: '', width: 100 },
}

// ─── Getters ──────────────────────────────────────────────────────────────────

export async function getHome(): Promise<HomeContent> {
  if (isProduction) return kvGet('home', homeDefault)
  return readJson('home.json', homeDefault)
}

export async function getSavoirFaire(): Promise<SavoirFaireContent> {
  if (isProduction) return kvGet('savoir-faire', sfDefault)
  return readJson('savoir-faire.json', sfDefault)
}

export async function getRealisations(): Promise<RealisationsContent> {
  if (isProduction) return kvGet('realisations', realisationsDefault)
  return readJson('realisations.json', realisationsDefault)
}

export async function getSettings(): Promise<SettingsContent> {
  if (isProduction) return kvGet('settings', settingsDefault)
  return readJson('settings.json', settingsDefault)
}

// ─── Setters ──────────────────────────────────────────────────────────────────

export async function saveHome(data: HomeContent): Promise<void> {
  if (isProduction) return kvSet('home', data)
  writeJson('home.json', data)
}

export async function saveSavoirFaire(data: SavoirFaireContent): Promise<void> {
  if (isProduction) return kvSet('savoir-faire', data)
  writeJson('savoir-faire.json', data)
}

export async function saveRealisations(data: RealisationsContent): Promise<void> {
  if (isProduction) return kvSet('realisations', data)
  writeJson('realisations.json', data)
}

export async function saveSettings(data: SettingsContent): Promise<void> {
  if (isProduction) return kvSet('settings', data)
  writeJson('settings.json', data)
}
