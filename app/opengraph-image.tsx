import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = "Patine — Atelier d'encadrement à Paris"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background:
            'linear-gradient(135deg, #1a1a18 0%, #2a2724 55%, #3a3530 100%)',
          color: '#F5F3EF',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 8,
            textTransform: 'uppercase',
            opacity: 0.7,
          }}
        >
          Patine · Paris
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.05,
              fontWeight: 400,
              letterSpacing: -1,
            }}
          >
            Atelier d&apos;encadrement
            <br />
            artisanal à Paris
          </div>
          <div
            style={{
              fontSize: 28,
              opacity: 0.78,
              fontStyle: 'italic',
              maxWidth: 900,
            }}
          >
            Fabrication sur mesure · Mise en valeur · Conservation
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 20,
            opacity: 0.6,
          }}
        >
          <div>83 rue Lamarck — 75018 Paris</div>
          <div>atelier-patine.fr</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
