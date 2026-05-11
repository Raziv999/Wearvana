'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const BADGE_STYLES = {
  HOT:            'bg-[#C0231E] text-white',
  NEW:            'bg-[#F4F4F4] text-[#0A0A0A]',
  'SELLING FAST': 'border border-[#C0231E]/60 text-[#C0231E]',
  ICONIC:         'bg-[#1C1C1C] text-[#909090]',
}

export default function ProductGallery({ product, gradient, accent }) {
  // Merge main + gallery images, remove blanks and dupes
  const allImages = [product.image, ...(product.images ?? [])]
    .map(s => s?.trim())
    .filter(Boolean)
    .filter((src, i, arr) => arr.indexOf(src) === i)

  const [activeIdx, setActiveIdx] = useState(0)
  const active   = allImages[activeIdx] ?? null
  const hasMany  = allImages.length > 1

  const touchStartX = useRef(null)

  const prev = () => setActiveIdx(i => (i - 1 + allImages.length) % allImages.length)
  const next = () => setActiveIdx(i => (i + 1) % allImages.length)

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
        {active ? (
          <Image
            key={active}
            src={active}
            alt={`${product.name} — photo ${activeIdx + 1}`}
            fill
            className="object-contain transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, 55vw"
            priority={activeIdx === 0}
          />
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

        {/* Prev / Next arrows — always visible on mobile, hover on desktop */}
        {hasMany && (
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
        {hasMany && (
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
        {product.slotsRemaining !== null && product.slotsRemaining <= 5 && (
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
              onClick={() => setActiveIdx(i)}
              aria-label={`View photo ${i + 1}`}
              className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden border-2 transition-all duration-150 ${
                i === activeIdx
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
    </div>
  )
}
