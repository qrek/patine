import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { saveHome, saveSavoirFaire, saveRealisations, saveSettings } from '@/lib/content'
import type { HomeContent, SavoirFaireContent, RealisationsContent, SettingsContent } from '@/lib/content'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { section, data } = body

    switch (section) {
      case 'home':
        await saveHome(data as HomeContent)
        break
      case 'savoir-faire':
        await saveSavoirFaire(data as SavoirFaireContent)
        break
      case 'realisations':
        await saveRealisations(data as RealisationsContent)
        break
      case 'settings':
        await saveSettings(data as SettingsContent)
        break
      default:
        return NextResponse.json({ error: 'Unknown section' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[save] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
