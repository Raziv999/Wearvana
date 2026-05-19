'use client'

import { useEffect, useRef, useState } from 'react'
import { Star, MessageCircle, Quote } from 'lucide-react'

const API       = process.env.NEXT_PUBLIC_API_URL
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
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])

  return { value, ref }
}

function AnimatedStat({ value: rawValue, label }) {
  const numeric = parseInt(rawValue.replace(/\D/g, ''), 10) || 0
  const prefix  = rawValue.match(/^[^0-9]*/)?.[0] ?? ''
  const valueSuffix = rawValue.match(/[^0-9]+$/)?.[0] ?? ''
  const { value, ref } = useCountUp(numeric, 1600)
  return (
    <div ref={ref} className="text-center">
      <p className="font-heading font-black text-[#C0231E] leading-none uppercase"
        style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)' }}>
        {prefix}{value}{valueSuffix}
      </p>
      <p className="font-body text-[#525252] text-[10px] tracking-[0.18em] uppercase mt-1.5">
        {label}
      </p>
    </div>
  )
}

// ── Star rating display ───────────────────────────────────────
function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < rating ? 'text-[#FBBF24] fill-[#FBBF24]' : 'text-[#242424]'}
        />
      ))}
    </div>
  )
}

// ── Initials avatar ───────────────────────────────────────────
function Avatar({ name }) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  // Deterministic color from name
  const colors = ['#C0231E', '#1C6EAD', '#2D7A4F', '#8B4A9E', '#C0771E']
  const color  = colors[name.charCodeAt(0) % colors.length]
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-body font-bold text-xs text-white"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  )
}

// ── Review card ───────────────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <div className="bg-[#111111] border border-[#1C1C1C] p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <StarRating rating={review.rating} />
        <Quote size={14} className="text-[#242424] shrink-0 mt-0.5" />
      </div>

      <p className="font-body text-[#909090] text-sm leading-relaxed flex-1">
        "{review.text}"
      </p>

      <div className="flex items-center gap-2.5 pt-2 border-t border-[#1C1C1C]">
        <Avatar name={review.name} />
        <div className="min-w-0">
          <p className="font-body font-bold text-[#F4F4F4] text-sm truncate">{review.name}</p>
          <p className="font-body text-[#525252] text-[10px] tracking-wide">
            {review.location}
            {review.product && <span className="text-[#383838]"> · {review.product}</span>}
          </p>
        </div>
      </div>
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
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/reviews`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }, [])

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

        {/* Reviews grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#111111] border border-[#1C1C1C] p-5 animate-pulse">
                <div className="h-3 bg-[#1C1C1C] rounded w-24 mb-4" />
                <div className="h-3 bg-[#1C1C1C] rounded w-full mb-2" />
                <div className="h-3 bg-[#1C1C1C] rounded w-4/5 mb-2" />
                <div className="h-3 bg-[#1C1C1C] rounded w-3/5 mb-4" />
                <div className="flex items-center gap-2 pt-2 border-t border-[#1C1C1C]">
                  <div className="w-9 h-9 rounded-full bg-[#1C1C1C]" />
                  <div className="flex-1">
                    <div className="h-3 bg-[#1C1C1C] rounded w-24 mb-1.5" />
                    <div className="h-2 bg-[#1C1C1C] rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map(review => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        ) : (
          /* Empty state */
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
        )}

        {/* Trust numbers */}
        <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-[#1C1C1C]">
          {STATS.map((stat) => (
            <AnimatedStat key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>

      </div>
    </section>
  )
}
