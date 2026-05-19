'use client'

import { Heart } from 'lucide-react'
import { useGrailList } from '@/hooks/useGrailList'
import { trackEvent } from './GoogleAnalytics'

export default function GrailButton({ product }) {
  const { isInGrail, toggleGrail, mounted } = useGrailList()

  // Render a neutral placeholder until client-side localStorage loads
  // This prevents hydration mismatch
  if (!mounted) {
    return (
      <button className="w-8 h-8 flex items-center justify-center text-[#242424]" aria-label="Save to Grail List">
        <Heart size={16} />
      </button>
    )
  }

  const saved = isInGrail(product._id)

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const willSave = !saved
        toggleGrail(product)
        if (willSave) {
          trackEvent('add_to_wishlist', {
            currency: 'NPR',
            value: product.price,
            items: [{ item_id: product._id, item_name: product.name, item_brand: product.brand }],
          })
        }
      }}
      aria-label={saved ? 'Remove from Grail List' : 'Save to Grail List'}
      className={`w-8 h-8 flex items-center justify-center transition-all duration-200 active:scale-90 ${
        saved
          ? 'text-[#C0231E]'
          : 'text-[#525252] hover:text-[#C0231E]'
      }`}
    >
      <Heart
        size={16}
        fill={saved ? '#C0231E' : 'none'}
        strokeWidth={saved ? 0 : 1.5}
      />
    </button>
  )
}
