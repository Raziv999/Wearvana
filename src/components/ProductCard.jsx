'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, Bell } from 'lucide-react'
import GrailButton from './GrailButton'
import { clImage } from '@/lib/cloudinary'
import WaitlistModal from './WaitlistModal'

// Replace with your actual WhatsApp business number (with country code, no +)
const WA_NUMBER = '9779705477470'

const BADGE_STYLES = {
  HOT:            'bg-[#C0231E] text-white',
  NEW:            'bg-[#F4F4F4] text-[#0A0A0A]',
  'SELLING FAST': 'bg-transparent border border-[#C0231E]/60 text-[#C0231E]',
  ICONIC:         'bg-[#1C1C1C] text-[#909090]',
}

// Unique gradient per brand so placeholders look intentional
const BRAND_GRADIENTS = {
  NIKE:          'from-[#1a1a1a] to-[#0d0d0d]',
  JORDAN:        'from-[#1a0d0d] to-[#0d0808]',
  ADIDAS:        'from-[#0d0d1a] to-[#080810]',
  'NEW BALANCE': 'from-[#0d1a0d] to-[#080d08]',
  'NEW ERA':     'from-[#1a1a0d] to-[#0d0d08]',
}

const BRAND_ACCENT = {
  NIKE:          '#C0231E',
  JORDAN:        '#C0231E',
  ADIDAS:        '#3b4cca',
  'NEW BALANCE': '#00802b',
  'NEW ERA':     '#C0231E',
}

export default function ProductCard({ product }) {
  const [waitlistOpen, setWaitlistOpen] = useState(false)

  const waMessage = encodeURIComponent(
    `Hi Wearvana! I'm interested in pre-ordering the ${product.name} (${product.colorway}). Can you check availability for me?`
  )
  const waLink = `https://wa.me/${WA_NUMBER}?text=${waMessage}`

  const gradient = BRAND_GRADIENTS[product.brand] ?? 'from-[#1a1a1a] to-[#0d0d0d]'
  const accent   = BRAND_ACCENT[product.brand]   ?? '#C0231E'

  return (
    <div className="group relative flex flex-col bg-[#111111] border border-[#242424] hover:border-[#C0231E]/40 transition-all duration-300 overflow-hidden">

      {/* Animated red top-edge accent on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C0231E] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-10" />

      {/* Product image — whole area links to product page */}
      <Link href={`/product/${product.slug || product._id}`} className={`relative aspect-square bg-gradient-to-br ${gradient} overflow-hidden block`}>

        {/* Placeholder — only visible when no image */}
        {!product.image && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center border"
              style={{ borderColor: `${accent}30`, backgroundColor: `${accent}12` }}
            >
              <span className="font-heading font-black text-2xl" style={{ color: `${accent}80` }}>
                {product.brand.charAt(0)}
              </span>
            </div>
            <p className="font-body text-[9px] tracking-[0.2em] uppercase" style={{ color: `${accent}50` }}>
              {product.brand}
            </p>
          </div>
        )}

        {/* Product image — renders above placeholder */}
        {product.image && (
          <Image
            src={clImage(product.image, 600)}
            alt={product.name}
            fill
            loading="lazy"
            className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 font-body font-bold text-[9px] tracking-[0.15em] uppercase px-2 py-1 z-10 ${
              BADGE_STYLES[product.badge] ?? 'bg-[#242424] text-[#909090]'
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Limited flag */}
        {product.limited && !product.badge && (
          <span className="absolute top-3 right-3 font-body text-[9px] font-semibold text-[#C0231E] tracking-[0.15em] uppercase z-10">
            LIMITED
          </span>
        )}

        {/* Grail (heart) button — top right */}
        <div className="absolute top-2 right-2 z-10">
          <GrailButton product={product} />
        </div>

        {/* Slots remaining indicator */}
        {product.slotsRemaining !== null && product.slotsRemaining > 0 && product.slotsRemaining <= 5 && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#C0231E]/90 py-1.5 text-center z-10">
            <p className="font-body text-[9px] text-white font-bold tracking-[0.15em] uppercase">
              Only {product.slotsRemaining} slots left
            </p>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">

        {/* Brand */}
        <p className="font-body text-[9px] text-[#525252] tracking-[0.18em] uppercase mb-1.5">
          {product.brand}
        </p>

        {/* Product name — links to product page */}
        <Link href={`/product/${product.slug || product._id}`}>
          <h3 className="font-product font-bold text-[#F4F4F4] hover:text-[#C0231E] text-sm leading-snug mb-1 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>

        {/* Colorway */}
        <p className="font-body text-[11px] text-[#525252] leading-snug mb-4">
          {product.colorway}
        </p>

        {/* Price block */}
        <div className="flex items-end justify-between mb-4 mt-auto">
          <div>
            <p className="font-body text-[9px] text-[#525252] tracking-[0.15em] uppercase mb-0.5">
              Pre-Order Price
            </p>
            <p className="font-product font-bold text-[#F4F4F4] text-lg">
              NPR {product.price.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="font-body text-[9px] text-[#C0231E] tracking-[0.15em] uppercase mb-0.5">
              Pay Now
            </p>
            <p className="font-product font-semibold text-[#C0231E] text-base">
              NPR {Math.ceil(product.price / 2).toLocaleString()}
            </p>
          </div>
        </div>

        {/* THE CTA */}
        {product.available ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#C0231E] hover:bg-[#D4251F] active:scale-[0.98] text-white font-body font-bold text-[10px] tracking-[0.18em] uppercase py-3.5 transition-all duration-200"
          >
            <MessageCircle size={13} className="flex-shrink-0" />
            Check Availability in Chat
          </a>
        ) : (
          <button
            onClick={() => setWaitlistOpen(true)}
            className="flex items-center justify-center gap-2 w-full border border-[#242424] hover:border-[#C0231E]/50 text-[#525252] hover:text-[#F4F4F4] font-body font-bold text-[10px] tracking-[0.18em] uppercase py-3.5 transition-all duration-200"
          >
            <Bell size={13} className="flex-shrink-0" />
            Notify Me When Back
          </button>
        )}

      </div>

      {waitlistOpen && (
        <WaitlistModal product={product} onClose={() => setWaitlistOpen(false)} />
      )}
    </div>
  )
}
