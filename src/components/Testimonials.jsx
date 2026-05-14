'use client'

import { useEffect, useRef, useState } from 'react'
import { Star, MessageCircle } from 'lucide-react'

const WA_NUMBER = '9779705477470'

// ── Animated count-up hook ────────────────────────────────────
function useCountUp(target, duration = 1800, startOnVisible = true) {
  const [value, setValue]     = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!startOnVisible) { setStarted(true); return }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect() } },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [startOnVisible])

  useEffect(() => {
    if (!started || target === 0) return
    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])

  return { value, ref }
}

// ── Individual stat ───────────────────────────────────────────
function AnimatedStat({ value: rawValue, suffix = '', label }) {
  // Parse numeric target from rawValue string e.g. "100%", "50%", "0"
  const numeric = parseInt(rawValue.replace(/\D/g, ''), 10) || 0
  const prefix  = rawValue.match(/^[^0-9]*/)?.[0] ?? ''
  // suffix from the rawValue string (after digits), plus any extra suffix prop
  const valueSuffix = rawValue.match(/[^0-9]+$/)?.[0] ?? ''

  const { value, ref } = useCountUp(numeric, 1600)

  return (
    <div ref={ref} className="text-center">
      <p
        className="font-heading font-black text-[#C0231E] leading-none uppercase"
        style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)' }}
      >
        {prefix}{value}{valueSuffix}
      </p>
      <p className="font-body text-[#525252] text-[10px] tracking-[0.18em] uppercase mt-1.5">
        {label}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────

const STATS = [
  { value: '100%', label: 'Authentic Products' },
  { value: '50%',  label: 'Advance Only' },
  { value: '0',    label: 'Fake Products Sold' },
]

export default function Testimonials() {
  return (
    <section className="bg-[#0A0A0A] py-16 md:py-24 border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-body text-[#C0231E] text-[10px] tracking-[0.22em] uppercase mb-2">
            Real Customers
          </p>
          <h2
            className="font-heading font-black text-[#F4F4F4] uppercase leading-none"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            They Copped.
            <br />
            <span className="text-[#C0231E]">You're Next.</span>
          </h2>
        </div>

        {/* Empty state — replace with real reviews when you have them */}
        <div className="border border-dashed border-[#242424] p-12 flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="text-[#242424]" />
            ))}
          </div>
          <p className="font-body text-[#525252] text-sm max-w-sm leading-relaxed">
            Be the first to review Wearvana. Order your kicks, then share your experience on WhatsApp or Instagram.
          </p>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Wearvana! I want to share a review about my recent order.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-[#242424] hover:border-[#C0231E]/50 text-[#525252] hover:text-[#F4F4F4] font-body font-bold text-[10px] tracking-[0.18em] uppercase px-5 py-3 transition-all mt-2"
          >
            <MessageCircle size={13} />
            Share Your Experience
          </a>
        </div>

        {/* Trust numbers — animated on scroll into view */}
        <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-[#1C1C1C]">
          {STATS.map((stat) => (
            <AnimatedStat key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>

      </div>
    </section>
  )
}
