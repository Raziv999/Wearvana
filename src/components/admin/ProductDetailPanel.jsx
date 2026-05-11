'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  X, Pencil, ExternalLink, Trash2,
  ChevronLeft, ChevronRight, ImageOff, Download,
} from 'lucide-react'

const API        = process.env.NEXT_PUBLIC_API_URL
const BADGE_OPTS = ['', 'HOT', 'NEW', 'SELLING FAST', 'ICONIC']

const BADGE_STYLES = {
  HOT:            'bg-[#C0231E] text-white',
  NEW:            'bg-[#F4F4F4] text-[#0A0A0A]',
  'SELLING FAST': 'border border-[#C0231E]/60 text-[#C0231E]',
  ICONIC:         'bg-[#1C1C1C] text-[#909090]',
}

export default function ProductDetailPanel({ product, onEdit, onClose, onRefresh, onDelete }) {
  // ── Gallery ──────────────────────────────────────────────────────
  const allImages = [product.image, ...(product.images ?? [])]
    .map(s => s?.trim())
    .filter(Boolean)
    .filter((src, i, arr) => arr.indexOf(src) === i)

  const [imgIdx, setImgIdx] = useState(0)

  // Reset gallery when product changes
  useEffect(() => { setImgIdx(0) }, [product._id])

  // ── Quick-edit state ─────────────────────────────────────────────
  const [available, setAvailable] = useState(product.available)
  const [limited,   setLimited]   = useState(product.limited)
  const [slots,     setSlots]     = useState(product.slotsRemaining ?? '')
  const [badge,     setBadge]     = useState(product.badge ?? '')
  const [updating,  setUpdating]  = useState(false)
  const [saved,     setSaved]     = useState(false)

  // Sync local state when product prop changes (e.g. after refresh)
  useEffect(() => {
    setAvailable(product.available)
    setLimited(product.limited)
    setSlots(product.slotsRemaining ?? '')
    setBadge(product.badge ?? '')
  }, [product])

  const patch = async (data) => {
    setUpdating(true)
    try {
      await fetch(`${API}/api/products/${product._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      onRefresh()
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    } finally {
      setUpdating(false)
    }
  }

  const prevImg = () => setImgIdx(i => (i - 1 + allImages.length) % allImages.length)
  const nextImg = () => setImgIdx(i => (i + 1)                    % allImages.length)

  return (
    <div className="bg-[#111111] border border-[#242424] flex flex-col h-full overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#242424] shrink-0">
        <div>
          <p className="font-body text-[9px] text-[#525252] tracking-[0.2em] uppercase">
            {product.brand} · {product.category}
            {product.subcategory && ` · ${product.subcategory}`}
          </p>
          <p className="font-heading font-black text-[#F4F4F4] text-base uppercase leading-tight">
            {product.name}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-[#525252] hover:text-[#F4F4F4] transition-colors shrink-0 ml-2"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      <div className="overflow-y-auto flex-1">

        {/* ── Main image + nav arrows ── */}
        <div className="relative aspect-square bg-[#0A0A0A] overflow-hidden group">
          {allImages[imgIdx] ? (
            <Image
              key={allImages[imgIdx]}
              src={allImages[imgIdx]}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-200"
              sizes="400px"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <ImageOff size={28} className="text-[#383838]" />
              <p className="font-body text-[9px] text-[#383838] tracking-widest uppercase">No Image</p>
            </div>
          )}

          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImg}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={14} className="text-white" />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={14} className="text-white" />
              </button>
              <div className="absolute bottom-2 right-2 bg-black/70 font-body text-white text-[9px] tracking-widest px-2 py-0.5">
                {imgIdx + 1} / {allImages.length}
              </div>
            </>
          )}

          {/* Badge overlay */}
          {product.badge && (
            <span className={`absolute top-2 left-2 font-body font-bold text-[9px] tracking-[0.15em] uppercase px-2 py-1 ${BADGE_STYLES[product.badge] ?? 'bg-[#242424] text-[#909090]'}`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* ── Thumbnail strip ── */}
        {allImages.length > 1 && (
          <div className="flex gap-1.5 p-2 bg-[#0A0A0A] border-b border-[#242424] overflow-x-auto">
            {allImages.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setImgIdx(i)}
                className={`relative shrink-0 w-12 h-12 overflow-hidden border-2 transition-all ${
                  i === imgIdx
                    ? 'border-[#C0231E] opacity-100'
                    : 'border-[#1C1C1C] opacity-40 hover:opacity-80 hover:border-[#383838]'
                }`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="48px" />
              </button>
            ))}
          </div>
        )}

        <div className="p-4 space-y-5">

          {/* ── Price info ── */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-[9px] text-[#525252] tracking-widest uppercase mb-0.5">Price</p>
              <p className="font-product font-bold text-[#F4F4F4] text-xl">
                NPR {product.price.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-body text-[9px] text-[#C0231E] tracking-widest uppercase mb-0.5">50% Advance</p>
              <p className="font-product font-bold text-[#C0231E] text-lg">
                NPR {Math.ceil(product.price / 2).toLocaleString()}
              </p>
            </div>
          </div>

          <p className="font-body text-[#525252] text-xs -mt-3">
            {product.colorway}
          </p>

          {/* ── Quick controls ── */}
          <div className="border border-[#242424] divide-y divide-[#242424]">

            {/* Available */}
            <div className="flex items-center justify-between px-3 py-2.5">
              <p className="font-body text-[10px] text-[#525252] tracking-[0.15em] uppercase">Status</p>
              <button
                onClick={() => { const next = !available; setAvailable(next); patch({ available: next }) }}
                disabled={updating}
                className={`flex items-center gap-2 font-body font-bold text-[9px] tracking-[0.12em] uppercase px-3 py-1.5 border transition-all ${
                  available
                    ? 'border-[#34D399]/40 text-[#34D399] bg-[#34D399]/5'
                    : 'border-[#383838] text-[#525252] hover:border-[#34D399]/30 hover:text-[#34D399]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${available ? 'bg-[#34D399] animate-pulse' : 'bg-[#525252]'}`} />
                {available ? 'Live' : 'Offline'}
              </button>
            </div>

            {/* Limited */}
            <div className="flex items-center justify-between px-3 py-2.5">
              <p className="font-body text-[10px] text-[#525252] tracking-[0.15em] uppercase">Limited Edition</p>
              <button
                onClick={() => { const next = !limited; setLimited(next); patch({ limited: next }) }}
                disabled={updating}
                className={`w-10 h-5 rounded-full transition-colors relative ${limited ? 'bg-[#C0231E]' : 'bg-[#242424]'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${limited ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Slots remaining */}
            <div className="flex items-center justify-between gap-3 px-3 py-2.5">
              <p className="font-body text-[10px] text-[#525252] tracking-[0.15em] uppercase shrink-0">Slots Left</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={slots}
                  onChange={e => setSlots(e.target.value)}
                  placeholder="∞"
                  className="w-20 bg-[#1C1C1C] border border-[#242424] focus:border-[#C0231E] text-[#F4F4F4] text-xs px-2 py-1.5 text-center outline-none transition-colors"
                />
                <button
                  onClick={() => patch({ slotsRemaining: slots === '' ? null : Number(slots) })}
                  disabled={updating}
                  className="font-body text-[9px] tracking-[0.12em] uppercase px-3 py-1.5 border border-[#242424] hover:border-[#C0231E]/50 text-[#525252] hover:text-[#F4F4F4] transition-all"
                >
                  {saved ? '✓' : 'Save'}
                </button>
              </div>
            </div>

            {/* Badge */}
            <div className="flex items-center justify-between gap-3 px-3 py-2.5">
              <p className="font-body text-[10px] text-[#525252] tracking-[0.15em] uppercase shrink-0">Badge</p>
              <select
                value={badge}
                onChange={e => {
                  const val = e.target.value
                  setBadge(val)
                  patch({ badge: val === '' ? null : val })
                }}
                disabled={updating}
                className="bg-[#1C1C1C] border border-[#242424] focus:border-[#C0231E] text-[#F4F4F4] text-xs px-2 py-1.5 outline-none cursor-pointer transition-colors"
              >
                {BADGE_OPTS.map(b => (
                  <option key={b} value={b}>{b === '' ? 'None' : b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={onEdit}
              className="flex flex-col items-center gap-1 border border-[#242424] hover:border-[#C0231E]/50 text-[#525252] hover:text-[#F4F4F4] py-3 transition-all"
            >
              <Pencil size={14} />
              <span className="font-body text-[8px] tracking-widest uppercase">Edit</span>
            </button>
            <a
              href={`/product/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 border border-[#242424] hover:border-[#C0231E]/50 text-[#525252] hover:text-[#F4F4F4] py-3 transition-all"
            >
              <ExternalLink size={14} />
              <span className="font-body text-[8px] tracking-widest uppercase">View</span>
            </a>
            <a
              href={`/api/story/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 border border-[#242424] hover:border-[#C0231E]/50 text-[#525252] hover:text-[#F4F4F4] py-3 transition-all"
            >
              <Download size={14} />
              <span className="font-body text-[8px] tracking-widest uppercase">Story</span>
            </a>
          </div>

          <button
            onClick={onDelete}
            className="w-full flex items-center justify-center gap-2 border border-[#242424] hover:border-[#C0231E] text-[#525252] hover:text-[#C0231E] font-body text-[10px] tracking-[0.15em] uppercase py-3 transition-all"
          >
            <Trash2 size={13} />
            Delete Product
          </button>

          {/* ── Photo paths ── */}
          {allImages.length > 0 && (
            <div className="border-t border-[#242424] pt-4">
              <p className="font-body text-[9px] text-[#383838] tracking-widest uppercase mb-2">
                {allImages.length} Photo{allImages.length !== 1 ? 's' : ''} on file
              </p>
              <div className="space-y-1">
                {allImages.map((src, i) => (
                  <p key={i} className="font-body text-[9px] text-[#383838] truncate font-mono">
                    {i + 1}. {src}
                  </p>
                ))}
              </div>
              {allImages.length < 5 && (
                <p className="font-body text-[9px] text-[#383838] mt-2 leading-relaxed">
                  ↑ Add up to {5 - allImages.length} more photo{5 - allImages.length !== 1 ? 's' : ''} via Edit →
                  Gallery Photos
                </p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
