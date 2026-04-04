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
  intro: { column1: '', column2: '' },
}

const sfDefault: SavoirFaireContent = {
  sections: [
    { id: 'matieres',  title: 'Le Choix des matières', body: '', image: '' },
    { id: 'processus', title: 'Le Processus',           body: '', image: '' },
    { id: 'clientele', title: "Une clientèle d'exception", body: '', image: '' },
  ],
}

const realisationsDefault: RealisationsContent = { photos: [] }

const settingsDefault: SettingsContent = {
  address: { street: '', city: '', country: '' },
  email: '',
  phone: '',
  instagram: '',
  footer: '© 2025 Patine',
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
