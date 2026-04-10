import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { put } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

const MAX_SIZE = 10 * 1024 * 1024 // 10 Mo
const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']

async function compress(buffer: Buffer): Promise<{ data: Buffer; ext: string }> {
  try {
    // .rotate() sans argument lit l'EXIF et corrige l'orientation automatiquement
    const meta = await sharp(buffer).metadata()
    let proc = sharp(buffer).rotate()
    if (meta.width && meta.width > 1920) {
      proc = proc.resize(1920, undefined, { withoutEnlargement: true })
    }
    const data = await proc.webp({ quality: 82 }).toBuffer()
    return { data, ext: 'webp' }
  } catch {
    return { data: buffer, ext: 'jpg' }
  }
}

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
      return NextResponse.json({ error: 'Fichier trop volumineux (max 10 Mo)' }, { status: 413 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    if (!ALLOWED_EXTS.includes(ext)) {
      return NextResponse.json({ error: 'Format non supporté' }, { status: 400 })
    }

    const safeDest = destination.replace(/[^a-zA-Z0-9-_]/g, '')
    const inputBuffer = Buffer.from(await file.arrayBuffer())
    const { data: outputBuffer, ext: outputExt } = await compress(inputBuffer)
    const filename = `${safeDest}-${Date.now()}.${outputExt}`

    // Production : Vercel Blob (persistant)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(filename, outputBuffer, {
          access: 'public',
          contentType: `image/${outputExt}`,
        })
        return NextResponse.json({ path: blob.url })
      } catch (blobErr) {
        const msg = blobErr instanceof Error ? blobErr.message : String(blobErr)
        console.error('[upload] Blob error:', msg)
        return NextResponse.json({ error: `Blob: ${msg}` }, { status: 500 })
      }
    }

    // Développement : fichier local
    if (process.env.NODE_ENV !== 'production') {
      const uploadDir = path.join(process.cwd(), 'public', 'images')
      await mkdir(uploadDir, { recursive: true })
      await writeFile(path.join(uploadDir, filename), outputBuffer)
      return NextResponse.json({ path: `/images/${filename}` })
    }

    return NextResponse.json(
      { error: 'Stockage non configuré — connectez Vercel Blob dans votre dashboard Vercel.' },
      { status: 503 }
    )

  } catch (err) {
    console.error('[upload] Error:', err)
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 })
  }
}
