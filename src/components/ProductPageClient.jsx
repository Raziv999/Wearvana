'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, ArrowLeft, Share2, Check, Ruler, Download } from 'lucide-react'
import SizeGuideModal from './SizeGuideModal'
import OrderFormModal from './OrderFormModal'
import ProductGallery from './ProductGallery'
import ViewingCounter from './ViewingCounter'
import { trackEvent } from './GoogleAnalytics'

const WA_NUMBER = '9779705477470'

const SNEAKER_SIZES = ['US 6', 'US 6.5', 'US 7', 'US 7.5', 'US 8', 'US 8.5',
  'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 11.5', 'US 12', 'US 13']

const CAP_SIZES = ['S/M', 'L/XL', 'One Size']

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

const BADGE_STYLES = {
  HOT:            'bg-[#C0231E] text-white',
  NEW:            'bg-[#F4F4F4] text-[#0A0A0A]',
  'SELLING FAST': 'border border-[#C0231E]/60 text-[#C0231E]',
  ICONIC:         'bg-[#1C1C1C] text-[#909090]',
}

export default function ProductPageClient({ product }) {
  const sizes = product.category === 'caps' ? CAP_SIZES : SNEAKER_SIZES
  const [selectedSize, setSelectedSize]   = useState('')
  const [copied, setCopied]               = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [orderFormOpen, setOrderFormOpen] = useState(false)

  // Track product view
  useEffect(() => {
    trackEvent('view_item', {
      item_id: product.slug,
      item_name: product.name,
      item_brand: product.brand,
      item_category: product.category,
      price: product.price,
      currency: 'NPR',
    })
  }, [product])

  const gradient = BRAND_GRADIENTS[product.brand] ?? 'from-[#1a1a1a] to-[#0d0d0d]'
  const accent   = BRAND_ACCENT[product.brand]   ?? '#C0231E'

  const waMessage = selectedSize
    ? `Hi Wearvana! I want to pre-order the ${product.name} (${product.colorway}) in size ${selectedSize}. Is it available?`
    : `Hi Wearvana! I'm interested in pre-ordering the ${product.name} (${product.colorway}). Can you check availability?`

  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F4F4F4]">

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 flex-wrap">
          {[
            { label: 'Home',                        href: '/' },
            { label: product.category === 'caps' ? 'Caps' : product.category === 'running' ? 'Running' : 'Sneakers', href: '/#drops' },
            product.subcategory && { label: product.subcategory, href: '/#drops' },
            { label: product.brand,                 href: null },
          ].filter(Boolean).map((crumb, i, arr) => (
            <span key={i} className="flex items-center gap-2">
              {crumb.href ? (
                <a href={crumb.href} className="font-body text-[10px] text-[#525252] hover:text-[#F4F4F4] tracking-widest uppercase transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className="font-body text-[10px] text-[#C0231E] tracking-widest uppercase">{crumb.label}</span>
              )}
              {i < arr.length - 1 && <span className="text-[#383838] text-[10px]">/</span>}
            </span>
          ))}
        </nav>
      </div>

      {/* Main product layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* LEFT — Gallery (sticky on desktop so it stays visible while scrolling details) */}
          <div className="md:sticky md:top-6">
            <ProductGallery product={product} gradient={gradient} accent={accent} />
          </div>

          {/* RIGHT — Details */}
          <div className="flex flex-col">

            {/* Brand + share */}
            <div className="flex items-center justify-between mb-3">
              <p className="font-body text-[10px] text-[#525252] tracking-[0.2em] uppercase">
                {product.brand}
              </p>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 font-body text-[10px] text-[#525252] hover:text-[#F4F4F4] tracking-widest uppercase transition-colors"
              >
                {copied ? <Check size={13} className="text-[#34D399]" /> : <Share2 size={13} />}
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>

            {/* Name */}
            <h1
              className="font-heading font-black text-[#F4F4F4] uppercase leading-none mb-2"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              {product.name}
            </h1>

            {/* Live viewer counter */}
            <div className="mb-3">
              <ViewingCounter productId={product._id} />
            </div>

            {/* Colorway + subcategory */}
            <p className="font-body text-[#909090] text-sm mb-6">
              {product.colorway}
              {product.subcategory && (
                <span className="ml-3 font-body text-[9px] tracking-[0.15em] uppercase border border-[#242424] text-[#525252] px-2 py-1">
                  {product.subcategory}
                </span>
              )}
            </p>

            {/* Price */}
            <div className="flex items-end gap-6 mb-8 pb-8 border-b border-[#242424]">
              <div>
                <p className="font-body text-[9px] text-[#525252] tracking-[0.15em] uppercase mb-1">
                  Pre-Order Price
                </p>
                <p className="font-product font-bold text-[#F4F4F4] text-3xl">
                  NPR {product.price.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="font-body text-[9px] text-[#C0231E] tracking-[0.15em] uppercase mb-1">
                  Pay Now (50%)
                </p>
                <p className="font-product font-bold text-[#C0231E] text-2xl">
                  NPR {Math.ceil(product.price / 2).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Size picker */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="font-body text-[10px] text-[#525252] tracking-[0.18em] uppercase">
                  Select Size
                </p>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="flex items-center gap-1.5 font-body text-[10px] text-[#525252] hover:text-[#C0231E] tracking-widest uppercase transition-colors"
                >
                  <Ruler size={12} />
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`font-body text-xs font-semibold tracking-wide px-4 py-2.5 border transition-all duration-150 ${
                      selectedSize === size
                        ? 'bg-[#C0231E] border-[#C0231E] text-white'
                        : 'bg-transparent border-[#242424] text-[#909090] hover:border-[#C0231E]/50 hover:text-[#F4F4F4]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary CTA — order form or sold out */}
            {product.available ? (
              <>
                <button
                  disabled={!selectedSize}
                  onClick={() => {
                    if (!selectedSize) return
                    trackEvent('begin_checkout', {
                      item_id: product.slug,
                      item_name: product.name,
                      item_brand: product.brand,
                      size: selectedSize,
                      price: product.price,
                      currency: 'NPR',
                    })
                    setOrderFormOpen(true)
                  }}
                  className={`flex items-center justify-center gap-3 w-full font-body font-bold text-xs tracking-[0.18em] uppercase py-5 transition-all duration-200 ${
                    selectedSize
                      ? 'bg-[#C0231E] hover:bg-[#D4251F] text-white'
                      : 'bg-[#1C1C1C] text-[#525252] cursor-default'
                  }`}
                >
                  {selectedSize ? `Pre-Order in Size ${selectedSize}` : 'Select a Size to Pre-Order'}
                </button>

                {/* Secondary — WhatsApp fallback */}
                {selectedSize && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full border border-[#242424] hover:border-[#C0231E]/40 text-[#525252] hover:text-[#F4F4F4] font-body text-[10px] tracking-[0.15em] uppercase py-3 mt-2 transition-all duration-200"
                  >
                    <MessageCircle size={12} />
                    Or order via WhatsApp
                  </a>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-full bg-[#1C1C1C] border border-[#242424] text-[#525252] font-body font-bold text-xs tracking-[0.18em] uppercase py-5">
                  Sold Out
                </div>
                <a
                  href={`https://wa.me/9779705477470?text=${encodeURIComponent(`Hi Wearvana! I'd like to be notified when the ${product.name} (${product.colorway}) is back. Please add me to the waitlist!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full border border-[#242424] hover:border-[#C0231E]/40 text-[#525252] hover:text-[#F4F4F4] font-body text-[10px] tracking-[0.15em] uppercase py-3.5 mt-2 transition-all duration-200"
                >
                  <MessageCircle size={12} />
                  Join Waitlist via WhatsApp
                </a>
              </>
            )}

            {/* Story download */}
            <a
              href={`/api/story/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full border border-[#242424] hover:border-[#C0231E]/40 text-[#525252] hover:text-[#F4F4F4] font-body text-[10px] tracking-[0.18em] uppercase py-3 mt-3 transition-all duration-200"
            >
              <Download size={12} />
              Download Instagram Story
            </a>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { value: '100%', label: 'Authentic' },
                { value: 'eSewa', label: '/ Khalti' },
                { value: 'NPR', label: 'No Hidden Fees' },
              ].map((item) => (
                <div key={item.label} className="border border-[#242424] p-3 text-center">
                  <p className="font-product font-bold text-[#C0231E] text-sm">{item.value}</p>
                  <p className="font-body text-[#525252] text-[9px] tracking-wide uppercase mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {sizeGuideOpen && (
        <SizeGuideModal
          category={product.category}
          onClose={() => setSizeGuideOpen(false)}
        />
      )}

      {orderFormOpen && (
        <OrderFormModal
          product={product}
          selectedSize={selectedSize}
          onClose={() => setOrderFormOpen(false)}
        />
      )}
    </div>
  )
}
