import { notFound } from 'next/navigation'
import ProductPageClient from '@/components/ProductPageClient'

const BASE_URL = 'https://wearvana.com'
const FALLBACK_IMAGE = `${BASE_URL}/og-image.jpg`

async function getProduct(slugOrId) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  try {
    const slugRes = await fetch(
      `${baseUrl}/api/products/slug/${slugOrId}`,
      { cache: 'no-store' }
    )
    if (slugRes.ok) return slugRes.json()

    if (slugRes.status !== 404) return null

    const idRes = await fetch(
      `${baseUrl}/api/products/${slugOrId}`,
      { cache: 'no-store' }
    )
    if (!idRes.ok) return null
    return idRes.json()
  } catch {
    return null
  }
}

// --- Prompt 1: Full Open Graph + Twitter Card ---
export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug)

  if (!product) {
    return {
      title: 'Product Not Found | Wearvana Pre-Order Nepal',
      description: 'This product is no longer available. Browse our latest drops.',
    }
  }

  const title       = `${product.brand} ${product.name} | Wearvana Pre-Order Nepal`
  const description = `Pre-order the ${product.brand} ${product.name} in ${product.colorway} for NPR ${product.price.toLocaleString()}. Pay only 50% advance via eSewa or Khalti. Authentic. Delivered in Nepal.`

  // Product image — Cloudinary URLs are already absolute, local paths need BASE_URL prefix
  const imageUrl = product.image
    ? product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`
    : FALLBACK_IMAGE

  const ogImage = {
    url: imageUrl,
    width: 1200,
    height: 630,
    alt: `${product.brand} ${product.name} — Wearvana Nepal`,
    type: 'image/jpeg',
  }

  return {
    title,
    description,
    keywords: [
      `${product.brand} ${product.name} Nepal`,
      `buy ${product.brand} Nepal`,
      `${product.name} pre-order Nepal`,
      `${product.brand} sneakers Nepal`,
      `${product.colorway}`,
      'streetwear Nepal',
      'sneakers Kathmandu',
      'Wearvana',
    ],
    alternates: {
      canonical: `${BASE_URL}/product/${product.slug}`,
    },
    openGraph: {
      type: 'website',
      siteName: 'Wearvana',
      locale: 'en_US',
      url: `${BASE_URL}/product/${product.slug}`,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@wearvana',
      title,
      description,
      images: [imageUrl],
    },
  }
}

// --- Prompt 2: JSON-LD Product Schema ---
function buildProductJsonLd(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.brand} ${product.name}`,
    description: `${product.name} in ${product.colorway}. Pre-order via Wearvana Nepal.`,
    image: product.image
      ? product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`
      : FALLBACK_IMAGE,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    sku: product.slug,
    mpn: product._id,
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/product/${product.slug}`,
      priceCurrency: 'NPR',
      price: product.price,
      priceValidUntil: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000  // 30 days from now
      ).toISOString().split('T')[0],
      availability: product.available
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/SoldOut',
      seller: {
        '@type': 'Organization',
        name: 'Wearvana',
        url: BASE_URL,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'NP',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 14, maxValue: 21, unitCode: 'DAY' },
        },
      },
    },
  }
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  const jsonLd = buildProductJsonLd(product)

  return (
    <>
      {/* Prompt 2: JSON-LD injected in page body — no hydration issues */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageClient product={product} />
    </>
  )
}
