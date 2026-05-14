import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const API      = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://getwearvana.com'

const BRAND_BG = {
  NIKE:          ['#0d0d0d', '#1a0505'],
  JORDAN:        ['#0d0808', '#1f0404'],
  ADIDAS:        ['#080810', '#050518'],
  'NEW BALANCE': ['#080d08', '#041204'],
  'NEW ERA':     ['#0d0d08', '#1a1a06'],
}

const BRAND_ACCENT = {
  NIKE:          '#C0231E',
  JORDAN:        '#C0231E',
  ADIDAS:        '#4a5cf0',
  'NEW BALANCE': '#00802b',
  'NEW ERA':     '#C0231E',
}

export async function GET(request, { params }) {
  const { slug } = params

  let product = null
  try {
    const res = await fetch(`${API}/api/products/slug/${slug}`, { cache: 'no-store' })
    if (res.ok) product = await res.json()
  } catch { /* use fallback */ }

  const [bgTop, bgBot] = product ? (BRAND_BG[product.brand] ?? ['#0d0d0d', '#1a0505']) : ['#0d0d0d', '#1a0505']
  const accent  = product ? (BRAND_ACCENT[product.brand] ?? '#C0231E') : '#C0231E'
  const name    = product?.name     ?? 'Exclusive Drop'
  const brand   = product?.brand    ?? 'WEARVANA'
  const color   = product?.colorway ?? ''
  const price   = product?.price    ? `NPR ${Number(product.price).toLocaleString()}` : ''
  const advance = product?.price    ? `NPR ${Math.ceil(product.price / 2).toLocaleString()} advance` : ''
  const isLimited = product?.limited ?? false
  const badge   = product?.badge ?? null

  // Fix: Cloudinary URLs are absolute; local paths need BASE_URL prefix
  const imgSrc = product?.image
    ? (product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`)
    : null

  return new ImageResponse(
    (
      <div
        style={{
          width: '1080px',
          height: '1920px',
          background: `linear-gradient(160deg, ${bgTop} 0%, ${bgBot} 60%, #000 100%)`,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ── Noise texture overlay ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }} />

        {/* ── Diagonal accent stripe ── */}
        <div style={{
          position: 'absolute',
          top: '-200px',
          right: '-100px',
          width: '700px',
          height: '2400px',
          background: `linear-gradient(180deg, ${accent}18 0%, transparent 50%)`,
          transform: 'rotate(15deg)',
          transformOrigin: 'top center',
        }} />

        {/* ── Bottom radial glow ── */}
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '600px',
          background: `radial-gradient(ellipse at center, ${accent}35 0%, transparent 70%)`,
        }} />

        {/* ── TOP BAR ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '70px 80px 0',
        }}>
          {/* Logo wordmark */}
          <span style={{
            color: '#F4F4F4',
            fontSize: '38px',
            fontWeight: 900,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>WEARVANA</span>

          {/* Status pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: `${accent}22`,
            border: `1px solid ${accent}55`,
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
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>{badge ?? 'Pre-Order'}</span>
          </div>
        </div>

        {/* ── PRODUCT IMAGE ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          padding: '60px 60px 20px',
          position: 'relative',
        }}>
          {imgSrc ? (
            <img
              src={imgSrc}
              style={{
                maxWidth: '900px',
                maxHeight: '780px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.8))',
              }}
            />
          ) : (
            <div style={{
              width: '340px',
              height: '340px',
              borderRadius: '50%',
              border: `3px solid ${accent}35`,
              background: `${accent}12`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: `${accent}70`, fontSize: '180px', fontWeight: 900 }}>
                {brand.charAt(0)}
              </span>
            </div>
          )}
          {isLimited && (
            <div style={{
              position: 'absolute',
              bottom: '30px',
              left: '80px',
              background: accent,
              color: '#fff',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              padding: '10px 22px',
              textTransform: 'uppercase',
            }}>LIMITED</div>
          )}
        </div>

        {/* ── PRODUCT INFO BLOCK ── */}
        <div style={{
          padding: '0 80px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}>
          {/* Brand label */}
          <span style={{
            color: '#525252',
            fontSize: '24px',
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>{brand}</span>

          {/* Product name */}
          <span style={{
            color: '#F4F4F4',
            fontSize: name.length > 20 ? '80px' : '96px',
            fontWeight: 900,
            textTransform: 'uppercase',
            lineHeight: 0.88,
            marginBottom: '24px',
            letterSpacing: '-0.01em',
          }}>{name}</span>

          {/* Colorway */}
          {color && (
            <span style={{
              color: '#6A6A6A',
              fontSize: '28px',
              marginBottom: '36px',
              letterSpacing: '0.02em',
            }}>{color}</span>
          )}

          {/* Divider */}
          <div style={{
            width: '100%',
            height: '1px',
            background: `linear-gradient(to right, ${accent}80, transparent)`,
            marginBottom: '36px',
          }} />

          {/* Price row */}
          {price && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{
                  color: '#525252',
                  fontSize: '20px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}>Pre-Order Price</span>
                <span style={{
                  color: accent,
                  fontSize: '72px',
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: '0.02em',
                }}>{price}</span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '8px',
              }}>
                <span style={{
                  color: '#525252',
                  fontSize: '20px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}>Pay Today</span>
                <span style={{
                  color: '#F4F4F4',
                  fontSize: '38px',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                }}>{advance}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── BOTTOM BAR ── */}
        <div style={{
          borderTop: '1px solid #1C1C1C',
          padding: '32px 80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ color: '#525252', fontSize: '18px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              eSewa · Khalti · 100% Authentic
            </span>
            <span style={{ color: '#383838', fontSize: '16px', letterSpacing: '0.1em' }}>
              getwearvana.com
            </span>
          </div>
          <span style={{
            color: '#2a2a2a',
            fontSize: '20px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>@wearvana.kicks</span>
        </div>
      </div>
    ),
    { width: 1080, height: 1920 }
  )
}
