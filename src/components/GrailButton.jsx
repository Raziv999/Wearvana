'use client'

import { Heart } from 'lucide-react'
import { useGrailList } from '@/hooks/useGrailList'

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
        toggleGrail(product)
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
