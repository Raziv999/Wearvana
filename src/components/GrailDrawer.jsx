'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Heart, MessageCircle, Trash2 } from 'lucide-react'
import { useGrailList } from '@/hooks/useGrailList'

const WA_NUMBER = '9779705477470'

export default function GrailDrawer({ open, onClose }) {
  const { grails, removeFromGrail, clearGrail, count } = useGrailList()

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const buildWaLink = (product) => {
    const msg = `Hi Wearvana! I have these on my Grail List and want to pre-order:\n\n${grails
      .map((p) => `• ${p.brand} ${p.name} (${p.colorway})`)
      .join('\n')}\n\nCan you check availability?`
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-[#0A0A0A] border-l border-[#242424] flex flex-col transform transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#242424] flex-shrink-0">
          <div className="flex items-center gap-3">
            <Heart size={16} className="text-[#C0231E]" fill="#C0231E" strokeWidth={0} />
            <div>
              <p className="font-product font-bold text-[#F4F4F4] text-sm leading-none">
                Grail List
              </p>
              <p className="font-body text-[#525252] text-[10px] mt-0.5">
                {count} {count === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#525252] hover:text-[#F4F4F4] transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {count === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <Heart size={40} className="text-[#242424]" />
              <p className="font-product font-semibold text-[#525252] text-sm">
                Your Grail List is empty
              </p>
              <p className="font-body text-[#525252] text-xs leading-relaxed">
                Tap the heart icon on any product to save it here.
              </p>
              <button
                onClick={onClose}
                className="font-body text-[10px] font-bold tracking-widest uppercase text-[#C0231E] hover:text-[#D4251F] transition-colors mt-2"
              >
                Browse Drops →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#1C1C1C]">
              {grails.map((product) => (
                <div key={product._id} className="flex items-center gap-3 px-5 py-4">
                  {/* Product image or brand fallback */}
                  <div className="w-14 h-14 bg-[#111111] border border-[#242424] flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                    {product.image && product.image.startsWith('http') ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                        sizes="56px"
                      />
                    ) : (
                      <span className="font-heading font-black text-[#525252] text-lg">
                        {product.brand.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-[9px] text-[#525252] tracking-widest uppercase mb-0.5">
                      {product.brand}
                    </p>
                    <Link
                      href={`/product/${product.slug || product._id}`}
                      onClick={onClose}
                      className="font-product font-semibold text-[#F4F4F4] hover:text-[#C0231E] text-sm leading-snug transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="font-product font-bold text-[#C0231E] text-sm mt-0.5">
                      NPR {product.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromGrail(product._id)}
                    className="text-[#525252] hover:text-[#C0231E] transition-colors flex-shrink-0 p-1"
                    aria-label="Remove from Grail List"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {count > 0 && (
          <div className="flex-shrink-0 border-t border-[#242424] p-5 flex flex-col gap-3">
            {/* Chat about entire grail list */}
            <a
              href={buildWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#C0231E] hover:bg-[#D4251F] text-white font-body font-bold text-xs tracking-widest uppercase py-4 transition-colors"
            >
              <MessageCircle size={14} />
              Chat About My Grail List
            </a>

            {/* Clear all */}
            <button
              onClick={() => {
                if (window.confirm(`Remove all ${count} items from your Grail List?`)) clearGrail()
              }}
              className="flex items-center justify-center gap-1.5 w-full font-body text-[10px] text-[#525252] hover:text-[#C0231E] tracking-widest uppercase transition-colors py-1"
            >
              <Trash2 size={11} />
              Clear All
            </button>
          </div>
        )}
      </div>
    </>
  )
}
