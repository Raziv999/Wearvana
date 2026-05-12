const BASE = 'https://getwearvana.com'

export default async function sitemap() {
  // Static pages
  const staticPages = [
    { url: BASE,                       changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/#sneakers`,        changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/#caps`,            changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/#how-it-works`,    changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/faq`,              changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/track`,            changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/about`,            changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/blog`,             changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/blog/best-sneakers-to-preorder-nepal-2025`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/blog/nike-dunk-vs-air-force-1-nepal`,       changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/blog/how-to-choose-sneaker-size-nepal`,     changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/blog/streetwear-nepal-kathmandu-guide`,     changeFrequency: 'monthly', priority: 0.6 },
  ].map((p) => ({ ...p, lastModified: new Date() }))

  // Dynamic product pages — fetched from MongoDB via API
  let productPages = []
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
      next: { revalidate: 3600 }, // re-fetch every hour
    })
    const products = await res.json()
    productPages = products
      .filter((p) => p.slug && p.available)
      .map((p) => ({
        url: `${BASE}/product/${p.slug}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
  } catch {}

  return [...staticPages, ...productPages]
}
