import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://getwearvana.com'

const BRAND_BG = {
  NIKE:          '#0d0d0d',
  JORDAN:        '#0d0808',
  ADIDAS:        '#080810',
  'NEW BALANCE': '#080d08',
  'NEW ERA':     '#0d0d08',
}

const BRAND_ACCENT = {
  NIKE:          '#C0231E',
  JORDAN:        '#C0231E',
  ADIDAS:        '#3b4cca',
  'NEW BALANCE': '#00802b',
  'NEW ERA':     '#C0231E',
}

export async function GET(request, { params }) {
  const { slug } = params

  let product = null
  try {
    const res = await fetch(`${API}/api/products/slug/${slug}`, { cache: 'no-store' })
    if (res.ok) product = await res.json()
  } catch {
    // use fallback below
  }

  const bg     = product ? (BRAND_BG[product.brand]     ?? '#0d0d0d') : '#0d0d0d'
  const accent = product ? (BRAND_ACCENT[product.brand] ?? '#C0231E') : '#C0231E'
  const name   = product?.name      ?? 'Exclusive Drop'
  const brand  = product?.brand     ?? 'WEARVANA'
  const color  = product?.colorway  ?? ''
  const price  = product?.price     ? `NPR ${product.price.toLocaleString()}` : ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '1080px',
          height: '1920px',
          background: bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background radial glow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 80% 50% at 50% 100%, ${accent}30 0%, transparent 60%)`,
        }} />

        {/* Grid overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `linear-gradient(to right, #F4F4F4 1px, transparent 1px), linear-gradient(to bottom, #F4F4F4 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }} />

        {/* PRE-ORDER badge */}
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '80px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          border: `1px solid ${accent}50`,
          background: `${accent}18`,
          padding: '14px 28px',
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: accent,
          }} />
          <span style={{
            color: accent,
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}>Pre-Order Now</span>
        </div>

        {/* Product image (if available) */}
        {product?.image && (
          <img
            src={`${BASE_URL}${product.image}`}
            style={{
              width: '860px',
              height: '860px',
              objectFit: 'cover',
              marginBottom: '40px',
            }}
          />
        )}

        {/* Brand initial circle (fallback when no image) */}
        {!product?.image && (
          <div style={{
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            border: `2px solid ${accent}40`,
            background: `${accent}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '60px',
          }}>
            <span style={{ color: `${accent}80`, fontSize: '120px', fontWeight: 900 }}>
              {brand.charAt(0)}
            </span>
          </div>
        )}

        {/* Content block */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 80px',
        }}>
          {/* Brand */}
          <span style={{
            color: '#525252',
            fontSize: '26px',
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>{brand}</span>

          {/* Name */}
          <span style={{
            color: '#F4F4F4',
            fontSize: '96px',
            fontWeight: 900,
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 0.9,
            marginBottom: '24px',
          }}>{name}</span>

          {/* Colorway */}
          {color && (
            <span style={{
              color: '#909090',
              fontSize: '32px',
              textAlign: 'center',
              marginBottom: '40px',
            }}>{color}</span>
          )}

          {/* Divider */}
          <div style={{
            width: '80px',
            height: '2px',
            background: accent,
            marginBottom: '40px',
          }} />

          {/* Price + payment */}
          {price && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{
                color: accent,
                fontSize: '64px',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}>{price}</span>
              <span style={{
                color: '#525252',
                fontSize: '24px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}>50% advance · eSewa / Khalti</span>
            </div>
          )}
        </div>

        {/* Bottom branding */}
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '600px',
            height: '1px',
            background: '#1C1C1C',
          }} />
          <span style={{
            color: '#F4F4F4',
            fontSize: '52px',
            fontWeight: 900,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>WEARVANA</span>
          <span style={{
            color: '#525252',
            fontSize: '22px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>@wearvana.kicks · getwearvana.com</span>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
    }
  )
}
