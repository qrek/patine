import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getHome, getSavoirFaire, getRealisations, getSettings } from '@/lib/content'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const section = req.nextUrl.searchParams.get('section')

  switch (section) {
    case 'home':
      return NextResponse.json(await getHome())
    case 'savoir-faire':
      return NextResponse.json(await getSavoirFaire())
    case 'realisations':
      return NextResponse.json(await getRealisations())
    case 'settings':
      return NextResponse.json(await getSettings())
    default:
      return NextResponse.json({ error: 'Unknown section' }, { status: 400 })
  }
}
