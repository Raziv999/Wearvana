'use client'

import { useState } from 'react'
import { Search, ArrowRight, Sparkles } from 'lucide-react'

const WA_NUMBER = '9779705477470'

export default function CustomSource() {
  const [sneaker, setSneaker] = useState('')
  const [size, setSize]       = useState('')

  const canSubmit = sneaker.trim().length > 0 && size.trim().length > 0

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return

    const message = encodeURIComponent(
      `Hi Wearvana! I want you to source something for me:\n\n` +
      `👟 Sneaker: ${sneaker.trim()}\n` +
      `📏 Size: ${size.trim()}\n\n` +
      `Can you check availability and pricing?`
    )
    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="bg-[#0A0A0A] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden border border-[#C0231E]/25 p-8 md:p-12"
          style={{
            background: 'linear-gradient(135deg, #111111 0%, #1a0505 50%, #111111 100%)',
          }}
        >
          {/* Corner accent */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C0231E]/60" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C0231E]/60" />

          <div className="max-w-2xl mx-auto">

            {/* Header */}
            <div className="flex items-start gap-3 mb-2">
              <Sparkles size={18} className="text-[#C0231E] mt-1 flex-shrink-0" />
              <p className="font-body text-[#C0231E] text-[10px] tracking-[0.22em] uppercase">
                Concierge Service
              </p>
            </div>

            <h2
              className="font-heading font-black text-[#F4F4F4] uppercase leading-none mb-3"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)' }}
            >
              Can't Find Your Grail?
            </h2>

            <p className="font-product text-[#909090] text-sm md:text-base mb-8 leading-relaxed">
              We source globally. If it exists, we can get it.
              Tell us what you're looking for and we'll hunt it down.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              {/* Sneaker name */}
              <div className="flex-1 relative">
                <Search
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#525252] pointer-events-none"
                />
                <input
                  type="text"
                  placeholder='e.g. "Nike Dunk Low Panda"'
                  value={sneaker}
                  onChange={(e) => setSneaker(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#242424] focus:border-[#C0231E] text-[#F4F4F4] font-body text-sm pl-10 pr-4 py-3.5 outline-none transition-colors placeholder:text-[#525252]"
                />
              </div>

              {/* Size */}
              <input
                type="text"
                placeholder="Your Size (e.g. US 10)"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="sm:w-44 bg-[#0A0A0A] border border-[#242424] focus:border-[#C0231E] text-[#F4F4F4] font-body text-sm px-4 py-3.5 outline-none transition-colors placeholder:text-[#525252]"
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit}
                className={`group flex items-center justify-center gap-2 font-body font-bold text-xs tracking-widest uppercase px-7 py-3.5 transition-all duration-200 flex-shrink-0 ${
                  canSubmit
                    ? 'bg-[#C0231E] hover:bg-[#D4251F] text-white'
                    : 'bg-[#1C1C1C] text-[#525252] cursor-not-allowed'
                }`}
              >
                Source It
                <ArrowRight
                  size={14}
                  className={canSubmit ? 'group-hover:translate-x-1 transition-transform' : ''}
                />
              </button>
            </form>

            {/* Trust note */}
            <p className="font-body text-[#525252] text-xs mt-4 leading-relaxed">
              We'll respond within 24 hours via WhatsApp with availability and pricing.
              No commitment until you confirm.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
