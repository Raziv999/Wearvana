'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn, Play } from 'lucide-react'
import { clImage } from '@/lib/cloudinary'

// Extract YouTube video ID from various URL formats
function getYouTubeId(url) {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

// Check if URL is a direct video file
function isDirectVideo(url) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url)
}

const BADGE_STYLES = {
  HOT:            'bg-[#C0231E] text-white',
  NEW:            'bg-[#F4F4F4] text-[#0A0A0A]',
  'SELLING FAST': 'border border-[#C0231E]/60 text-[#C0231E]',
  ICONIC:         'bg-[#1C1C1C] text-[#909090]',
}

export default function ProductGallery({ product, gradient, accent }) {
  // Merge main + gallery images, remove blanks and dupes, optimize
  const allImages = [product.image, ...(product.images ?? [])]
    .map(s => s?.trim())
    .filter(Boolean)
    .filter((src, i, arr) => arr.indexOf(src) === i)
    .map(src => clImage(src, 1200))

  const [activeIdx, setActiveIdx]   = useState(0)
  const [videoActive, setVideoActive] = useState(false)
  const [zoomed, setZoomed]         = useState(false)
  const active   = allImages[activeIdx] ?? null
  const hasVideo = Boolean(product.videoUrl)
  const hasMany  = allImages.length > 1 || hasVideo

  const ytId      = hasVideo ? getYouTubeId(product.videoUrl) : null
  const directVid = hasVideo && !ytId && isDirectVideo(product.videoUrl)

  const touchStartX = useRef(null)

  // Close zoom on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setZoomed(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const prev = () => { setVideoActive(false); setActiveIdx(i => (i - 1 + allImages.length) % allImages.length) }
  const next = () => { setVideoActive(false); setActiveIdx(i => (i + 1) % allImages.length) }

  // Touch/swipe support
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev()
    touchStartX.current = null
  }

  return (
    <div className="flex flex-col gap-3">

      {/* ── Main image ── */}
      <div
        className={`relative w-full bg-gradient-to-br ${gradient} overflow-hidden group`}
        style={{ aspectRatio: '1 / 1' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {videoActive && hasVideo ? (
          /* ── Video player ── */
          ytId ? (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              title={`${product.name} video`}
            />
          ) : directVid ? (
            <video
              src={product.videoUrl}
              controls
              autoPlay
              className="absolute inset-0 w-full h-full object-contain"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-body text-[#525252] text-xs">Unsupported video format</p>
            </div>
          )
        ) : active ? (
          <>
            <Image
              key={active}
              src={active}
              alt={`${product.name} — photo ${activeIdx + 1}`}
              fill
              className="object-contain transition-opacity duration-300 cursor-zoom-in"
              sizes="(max-width: 768px) 100vw, 55vw"
              priority={activeIdx === 0}
              onClick={() => setZoomed(true)}
            />
            {/* Zoom hint — desktop only */}
            <div className="absolute bottom-3 right-3 hidden md:flex items-center gap-1.5 bg-black/60 text-white/70 font-body text-[9px] tracking-widest uppercase px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
              <ZoomIn size={10} />
              Click to zoom
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center border"
              style={{ borderColor: `${accent}30`, backgroundColor: `${accent}12` }}
            >
              <span className="font-heading font-black text-5xl" style={{ color: `${accent}60` }}>
                {product.brand.charAt(0)}
              </span>
            </div>
            <p className="font-body text-[10px] tracking-[0.2em] uppercase" style={{ color: `${accent}40` }}>
              {product.brand}
            </p>
          </div>
        )}

        {/* Prev / Next arrows — only shown for images, not video */}
        {!videoActive && hasMany && (
          <>
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 bg-black/60 hover:bg-black/90 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 z-10"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 bg-black/60 hover:bg-black/90 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 z-10"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </>
        )}

        {/* Photo counter — top right */}
        {!videoActive && hasMany && allImages.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/70 font-body text-white text-[9px] tracking-widest px-2 py-1 z-10">
            {activeIdx + 1} / {allImages.length}
          </div>
        )}

        {/* Badges */}
        {product.badge && (
          <span className={`absolute top-3 left-3 font-body font-bold text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 z-10 ${BADGE_STYLES[product.badge] ?? 'bg-[#242424] text-[#909090]'}`}>
            {product.badge}
          </span>
        )}
        {product.limited && (
          <span className="absolute bottom-3 left-3 font-body text-[9px] font-bold text-[#C0231E] tracking-[0.15em] uppercase z-10 bg-black/60 px-2 py-1">
            LIMITED
          </span>
        )}
        {product.slotsRemaining !== null && product.slotsRemaining > 0 && product.slotsRemaining <= 5 && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#C0231E]/90 py-2 text-center z-10">
            <p className="font-body text-[10px] text-white font-bold tracking-[0.15em] uppercase">
              Only {product.slotsRemaining} slots left
            </p>
          </div>
        )}
      </div>

      {/* ── Thumbnail strip (below main image, scrolls horizontally if many) ── */}
      {hasMany && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {allImages.map((src, i) => (
            <button
              key={src + i}
              onClick={() => { setVideoActive(false); setActiveIdx(i) }}
              aria-label={`View photo ${i + 1}`}
              className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden border-2 transition-all duration-150 ${
                !videoActive && i === activeIdx
                  ? 'border-[#C0231E] opacity-100'
                  : 'border-[#1C1C1C] opacity-50 hover:opacity-80 hover:border-[#525252]'
              }`}
            >
              <Image
                src={src}
                alt={`${product.name} view ${i + 1}`}
                fill
                className="object-contain"
                sizes="80px"
              />
            </button>
          ))}

          {/* Video thumbnail */}
          {hasVideo && (
            <button
              onClick={() => setVideoActive(true)}
              aria-label="Watch video"
              className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden border-2 transition-all duration-150 flex items-center justify-center ${
                videoActive
                  ? 'border-[#C0231E] opacity-100 bg-[#1C1C1C]'
                  : 'border-[#1C1C1C] opacity-50 hover:opacity-80 hover:border-[#525252] bg-[#1C1C1C]'
              }`}
            >
              {ytId ? (
                <img
                  src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                  alt="Video preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : null}
              <div className="relative z-10 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center">
                <Play size={12} className="text-white fill-white ml-0.5" />
              </div>
            </button>
          )}
        </div>
      )}

      {/* ── Dot navigation (only shown when no thumbnails can render, fallback) ── */}
      {hasMany && allImages.every(s => !s) && (
        <div className="flex justify-center gap-2">
          {allImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeIdx ? 'bg-[#C0231E] w-4' : 'bg-[#383838]'}`}
            />
          ))}
        </div>
      )}

      {/* ── Lightbox / zoom overlay ── */}
      {zoomed && active && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={() => setZoomed(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setZoomed(false)}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
            aria-label="Close zoom"
          >
            <X size={28} />
          </button>

          {/* Counter */}
          {hasMany && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 font-body text-white/40 text-xs tracking-widest">
              {activeIdx + 1} / {allImages.length}
            </div>
          )}

          {/* Image */}
          <div
            className="relative w-full max-w-2xl"
            style={{ aspectRatio: '1 / 1' }}
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={active}
              alt={`${product.name} zoom`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Prev / Next in lightbox */}
          {hasMany && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={22} className="text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={22} className="text-white" />
              </button>
            </>
          )}

          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-body text-white/30 text-[10px] tracking-widest uppercase">
            Tap outside to close
          </p>
        </div>
      )}
    </div>
  )
}
