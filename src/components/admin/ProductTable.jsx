'use client'

import { useState } from 'react'
import { Pencil, Trash2, ExternalLink, ImageOff, Bell } from 'lucide-react'
import Image from 'next/image'
import { clImage } from '@/lib/cloudinary'

const API = process.env.NEXT_PUBLIC_API_URL

const BADGE_STYLES = {
  HOT:            'bg-[#C0231E] text-white',
  NEW:            'bg-[#F4F4F4] text-[#0A0A0A]',
  'SELLING FAST': 'border border-[#C0231E]/60 text-[#C0231E]',
  ICONIC:         'bg-[#1C1C1C] text-[#909090]',
}

export default function ProductTable({ products, loading, onEdit, onRefresh, onSelect, selectedId, waitlistCounts = {}, onWaitlist }) {
  const [deletingId, setDeletingId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  const handleToggleAvailable = async (product) => {
    setTogglingId(product._id)
    try {
      await fetch(`${API}/api/products/${product._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !product.available }),
      })
      onRefresh()
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    setDeletingId(product._id)
    try {
      await fetch(`${API}/api/products/${product._id}`, { method: 'DELETE' })
      onRefresh()
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#111111] border border-[#242424] p-4 animate-pulse">
            <div className="aspect-square bg-[#1C1C1C] mb-4" />
            <div className="h-3 bg-[#1C1C1C] rounded mb-2 w-1/2" />
            <div className="h-5 bg-[#1C1C1C] rounded mb-2 w-3/4" />
            <div className="h-3 bg-[#1C1C1C] rounded w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="border border-dashed border-[#242424] p-16 text-center">
        <p className="font-body text-[#525252] text-sm tracking-wide">No products yet.</p>
        <p className="font-body text-[#383838] text-xs mt-1">Click "Add Product" to create your first drop.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product._id}
          onClick={() => onSelect?.(product)}
          className={`bg-[#111111] border flex flex-col transition-all cursor-pointer ${
            selectedId === product._id
              ? 'border-[#C0231E] ring-1 ring-[#C0231E]/30'
              : product.available
                ? 'border-[#242424] hover:border-[#383838]'
                : 'border-[#1C1C1C] opacity-60 hover:opacity-80'
          }`}
        >
          {/* Image */}
          <div className="relative aspect-square bg-[#0A0A0A] overflow-hidden">
            {product.image ? (
              <Image
                src={clImage(product.image, 600)}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <ImageOff size={24} className="text-[#383838]" />
                <p className="font-body text-[#383838] text-[9px] tracking-widest uppercase">No Image</p>
              </div>
            )}

            {/* Badge */}
            {product.badge && (
              <span className={`absolute top-2 left-2 font-body font-bold text-[9px] tracking-[0.15em] uppercase px-2 py-1 ${BADGE_STYLES[product.badge] ?? 'bg-[#242424] text-[#909090]'}`}>
                {product.badge}
              </span>
            )}
            {product.limited && (
              <span className="absolute top-2 right-2 font-body text-[9px] font-semibold text-[#C0231E] tracking-[0.15em] uppercase">
                LIMITED
              </span>
            )}

            {/* Photo count badge */}
            {(() => {
              const count = [product.image, ...(product.images ?? [])].filter(s => s?.trim()).length
              return count > 1 ? (
                <div className="absolute bottom-2 left-2 bg-black/70 font-body text-white text-[8px] tracking-widest px-1.5 py-0.5 z-10">
                  {count} photos
                </div>
              ) : null
            })()}

            {/* Sold out overlay */}
            {!product.available && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="font-heading font-black text-[#525252] text-xl uppercase tracking-widest">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4 flex flex-col flex-1">
            <p className="font-body text-[9px] text-[#525252] tracking-[0.2em] uppercase mb-0.5">
              {product.brand} · {product.category}
            </p>
            <p className="font-heading font-black text-[#F4F4F4] text-base uppercase leading-tight mb-1">
              {product.name}
            </p>
            <p className="font-body text-[#525252] text-[11px] mb-3 flex-1 line-clamp-1">
              {product.colorway}
            </p>

            {/* Price + slots */}
            <div className="flex items-center justify-between mb-4">
              <p className="font-product font-bold text-[#F4F4F4] text-sm">
                NPR {product.price.toLocaleString()}
              </p>
              <p className="font-body text-[10px] text-[#525252]">
                {product.slotsRemaining === null
                  ? 'Unlimited slots'
                  : `${product.slotsRemaining} slots left`}
              </p>
            </div>

            {/* Actions row */}
            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              {/* Available toggle */}
              <button
                onClick={() => handleToggleAvailable(product)}
                disabled={togglingId === product._id}
                className={`flex-1 font-body font-bold text-[9px] tracking-[0.12em] uppercase py-2 border transition-all ${
                  product.available
                    ? 'border-[#34D399]/30 text-[#34D399] hover:bg-[#34D399]/10'
                    : 'border-[#525252]/30 text-[#525252] hover:border-[#34D399]/30 hover:text-[#34D399]'
                }`}
              >
                {togglingId === product._id
                  ? '...'
                  : product.available ? '● Live' : '○ Off'}
              </button>

              {/* Waitlist badge */}
              <button
                onClick={() => onWaitlist?.(product)}
                title="View waitlist"
                className="relative border border-[#242424] hover:border-[#FBBF24]/50 text-[#525252] hover:text-[#FBBF24] p-2 transition-all"
              >
                <Bell size={13} />
                {(waitlistCounts[product._id] ?? 0) > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-[#FBBF24] text-[#0A0A0A] font-body font-bold text-[8px] flex items-center justify-center rounded-full px-0.5">
                    {waitlistCounts[product._id]}
                  </span>
                )}
              </button>

              {/* Edit */}
              <button
                onClick={() => onEdit(product)}
                className="border border-[#242424] hover:border-[#C0231E]/50 text-[#525252] hover:text-[#F4F4F4] p-2 transition-all"
                title="Edit product"
              >
                <Pencil size={13} />
              </button>

              {/* Product page link */}
              <a
                href={`/product/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#242424] hover:border-[#C0231E]/50 text-[#525252] hover:text-[#F4F4F4] p-2 transition-all"
                title="View product page"
              >
                <ExternalLink size={13} />
              </a>

              {/* Delete */}
              <button
                onClick={() => handleDelete(product)}
                disabled={deletingId === product._id}
                className="border border-[#242424] hover:border-[#C0231E] text-[#525252] hover:text-[#C0231E] p-2 transition-all"
                title="Delete product"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
