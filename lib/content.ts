/**
 * Couche d'abstraction pour la lecture/écriture du contenu.
 * En développement : lecture/écriture dans /content/*.json
 * En production (Vercel) : utilise Vercel KV
 */

import fs from 'fs'
import path from 'path'

const isProduction = process.env.NODE_ENV === 'production' && process.env.KV_REST_API_URL

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HomeContent {
  hero: {
    title: string
    subtitle: string
    image: string
  }
  intro: {
    column1: string
    column2: string
  }
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
  address: {
    street: string
    city: string
    country: string
  }
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
    const { kv } = await import('@vercel/kv')
    const value = await kv.get<T>(key)
    return value ?? fallback
  } catch {
    return fallback
  }
}

async function kvSet(key: string, data: unknown): Promise<void> {
  const { kv } = await import('@vercel/kv')
  await kv.set(key, data)
}

// ─── Getters ──────────────────────────────────────────────────────────────────

const homeDefault: HomeContent = {
  hero: { title: "L'art d'encadrer", subtitle: 'Atelier Patine — Paris', image: '/images/hero.jpg' },
  intro: { column1: '', column2: '' },
}

export async function getHome(): Promise<HomeContent> {
  if (isProduction) return kvGet('home', homeDefault)
  return readJson('home.json', homeDefault)
}

const sfDefault: SavoirFaireContent = { sections: [] }

export async function getSavoirFaire(): Promise<SavoirFaireContent> {
  if (isProduction) return kvGet('savoir-faire', sfDefault)
  return readJson('savoir-faire.json', sfDefault)
}

const realisationsDefault: RealisationsContent = { photos: [] }

export async function getRealisations(): Promise<RealisationsContent> {
  if (isProduction) return kvGet('realisations', realisationsDefault)
  return readJson('realisations.json', realisationsDefault)
}

const settingsDefault: SettingsContent = {
  address: { street: '', city: '', country: '' },
  email: '',
  phone: '',
  instagram: '',
  footer: '© 2025 Patine',
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
