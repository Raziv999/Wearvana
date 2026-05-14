/**
 * Cloudinary automatic image optimization.
 *
 * Inserts f_auto,q_auto (format + quality) and an optional width cap
 * into any Cloudinary upload URL.  Non-Cloudinary URLs are returned unchanged.
 *
 * Usage:
 *   clImage(product.image)          → …/upload/f_auto,q_auto,w_800/…
 *   clImage(product.image, 400)     → …/upload/f_auto,q_auto,w_400/…
 *   clImage(product.image, 'full')  → …/upload/f_auto,q_auto/…  (no width cap)
 */
export function clImage(url, width = 800) {
  if (!url || !url.includes('res.cloudinary.com')) return url
  // Already has transformations — don't double-add
  if (url.includes('/f_auto') || url.includes('/q_auto')) return url

  const transforms = width === 'full'
    ? 'f_auto,q_auto'
    : `f_auto,q_auto,w_${width}`

  return url.replace('/upload/', `/upload/${transforms}/`)
}
