import { NextRequest, NextResponse } from 'next/server'
import { getSettings } from '@/lib/content'

interface ContactPayload {
  name: string
  email: string
  phone?: string
  message: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactPayload

    // Validation basique
    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }
    if (!isValidEmail(body.email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const settings = await getSettings()
    const contactEmail = process.env.CONTACT_EMAIL || settings.email

    // ── Option A : Resend (si RESEND_API_KEY est défini) ─────────────────────
    if (process.env.RESEND_API_KEY && contactEmail) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      await resend.emails.send({
        from: 'Patine <noreply@patine.fr>',
        to: contactEmail,
        reply_to: body.email,
        subject: `Nouveau message de ${body.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1A1A18;">Nouveau message via le site Patine</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 120px;">Nom</td>
                <td style="padding: 8px 0;">${body.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Email</td>
                <td style="padding: 8px 0;"><a href="mailto:${body.email}">${body.email}</a></td>
              </tr>
              ${body.phone ? `<tr><td style="padding: 8px 0; color: #666;">Téléphone</td><td style="padding: 8px 0;">${body.phone}</td></tr>` : ''}
            </table>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="white-space: pre-wrap; line-height: 1.7;">${body.message}</p>
          </div>
        `,
      })

      return NextResponse.json({ success: true })
    }

    // ── Option B : fallback — log en dev, succès silencieux en prod ───────────
    if (process.env.NODE_ENV === 'development') {
      console.log('[contact] Message reçu:', body)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact] Error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
