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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
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

      // RESEND_FROM doit être une adresse sur un domaine vérifié dans Resend
      // Ex: RESEND_FROM="Patine <noreply@patine.fr>"
      const fromAddress = process.env.RESEND_FROM || 'onboarding@resend.dev'

      const safeName    = escapeHtml(body.name)
      const safeEmail   = escapeHtml(body.email)
      const safePhone   = body.phone ? escapeHtml(body.phone) : ''
      const safeMessage = escapeHtml(body.message)

      await resend.emails.send({
        from: fromAddress,
        to: contactEmail,
        replyTo: body.email,
        subject: `Nouveau message de ${body.name}`,
        text: `Nouveau message via le site Patine\n\nNom : ${body.name}\nEmail : ${body.email}${body.phone ? `\nTéléphone : ${body.phone}` : ''}\n\n${body.message}\n`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1A1A18;">Nouveau message via le site Patine</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 120px;">Nom</td>
                <td style="padding: 8px 0;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Email</td>
                <td style="padding: 8px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
              </tr>
              ${safePhone ? `<tr><td style="padding: 8px 0; color: #666;">Téléphone</td><td style="padding: 8px 0;">${safePhone}</td></tr>` : ''}
            </table>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="white-space: pre-wrap; line-height: 1.7;">${safeMessage}</p>
          </div>
        `,
      })

      return NextResponse.json({ success: true })
    }

    // ── Fallback : aucun service email configuré ──────────────────────────────
    console.error('[contact] RESEND_API_KEY non configuré — message non envoyé:', body)
    return NextResponse.json({ error: 'Service email non configuré' }, { status: 503 })
  } catch (err) {
    console.error('[contact] Error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
