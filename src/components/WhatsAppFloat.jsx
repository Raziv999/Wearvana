'use client'

import { useState } from 'react'
import { X, MessageCircle } from 'lucide-react'

const WA_NUMBER = '9779705477470'
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  "Hi Wearvana! I'd like to pre-order something from your latest drop."
)}`

export default function WhatsAppFloat() {
  const [tooltipDismissed, setTooltipDismissed] = useState(false)

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">

      {/* Tooltip bubble */}
      {!tooltipDismissed && (
        <div className="relative bg-[#111111] border border-[#242424] px-4 py-3 max-w-[200px] shadow-xl">
          {/* Small triangle pointer */}
          <div className="absolute -bottom-[6px] right-5 w-3 h-3 bg-[#111111] border-r border-b border-[#242424] rotate-45" />

          <button
            onClick={() => setTooltipDismissed(true)}
            className="absolute -top-2 -right-2 w-5 h-5 bg-[#242424] hover:bg-[#C0231E] text-[#909090] hover:text-white flex items-center justify-center transition-colors"
            aria-label="Dismiss"
          >
            <X size={10} />
          </button>

          <p className="font-product font-semibold text-[#F4F4F4] text-xs leading-snug">
            Got a question?
          </p>
          <p className="font-body text-[#909090] text-[11px] mt-0.5 leading-snug">
            Chat with us to pre-order
          </p>
        </div>
      )}

      {/* Main bubble */}
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-[#C0231E] hover:bg-[#D4251F] active:scale-95 shadow-lg shadow-[#C0231E]/30 transition-all duration-200"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 bg-[#C0231E] opacity-40 animate-ping rounded-none" />

        <MessageCircle size={26} className="text-white relative z-10" fill="white" strokeWidth={1} />
      </a>

    </div>
  )
}
