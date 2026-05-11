'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const BANNER_KEY = 'wearvana_banner_v1'

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem(BANNER_KEY)
    if (!dismissed) setVisible(true)
  }, [])

  const dismiss = () => {
    sessionStorage.setItem(BANNER_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="relative bg-[#C0231E] text-white py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center">

        {/* Pulsing dot */}
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-[pulse-dot_1.8s_ease-in-out_infinite] mr-3 flex-shrink-0" />

        {/* Message */}
        <p className="font-body text-[11px] font-semibold tracking-[0.18em] uppercase text-white text-center">
          Drop 001 — Now Live&nbsp;&nbsp;·&nbsp;&nbsp;
          <a href="/#drops" onClick={dismiss} className="underline underline-offset-2 hover:opacity-80 transition-opacity">Shop Now</a>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          <a href="/track" className="underline underline-offset-2 hover:opacity-80 transition-opacity">Track Order</a>
        </p>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          className="absolute right-4 text-white/70 hover:text-white transition-colors"
          aria-label="Dismiss banner"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
