import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { put } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const MAX_SIZE = 10 * 1024 * 1024 // 10 Mo
const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const destination = (formData.get('destination') as string) || 'uploads'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 10 Mo)' }, { status: 413 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    if (!ALLOWED_EXTS.includes(ext)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const safeDest = destination.replace(/[^a-zA-Z0-9-_]/g, '')
    const filename = `${safeDest}-${Date.now()}.${ext}`

    // En production : Vercel Blob (persistant)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, file, { access: 'public' })
      return NextResponse.json({ path: blob.url })
    }

    // En développement : fichier local
    const uploadDir = path.join(process.cwd(), 'public', 'images')
    await mkdir(uploadDir, { recursive: true })
    const bytes = await file.arrayBuffer()
    await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))
    return NextResponse.json({ path: `/images/${filename}` })

  } catch (err) {
    console.error('[upload] Error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
