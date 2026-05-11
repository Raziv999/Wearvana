'use client'

import { useState, useEffect, useRef } from 'react'

function getTimeLeft(targetDate) {
  const diff = targetDate.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function Digit({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {/* Background block */}
        <div className="bg-[#111111] border border-[#242424] w-20 md:w-28 h-20 md:h-28 flex items-center justify-center">
          <span
            className="font-heading font-black text-[#F4F4F4] leading-none tabular-nums"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            {String(value).padStart(2, '0')}
          </span>
        </div>
        {/* Red left border accent */}
        <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-[#C0231E]" />
      </div>
      <p className="font-body text-[9px] text-[#525252] tracking-[0.22em] uppercase">{label}</p>
    </div>
  )
}

export default function CountdownTimer({ targetDate, isLive, onUnlock }) {
  // null = not yet calculated (avoids hydration mismatch)
  const [timeLeft, setTimeLeft] = useState(null)
  const [unlocked, setUnlocked] = useState(isLive)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isLive) { setUnlocked(true); return }

    const tick = () => {
      const t = getTimeLeft(targetDate)
      if (!t) {
        clearInterval(intervalRef.current)
        setTimeLeft(null)
        setUnlocked(true)
        onUnlock?.()
      } else {
        setTimeLeft(t)
      }
    }

    tick()
    intervalRef.current = setInterval(tick, 1000)
    return () => clearInterval(intervalRef.current)
  }, [targetDate, isLive, onUnlock])

  // Drop is live — render nothing (products show normally)
  if (unlocked || isLive) return null

  // Calculating on server — render nothing to avoid hydration mismatch
  if (timeLeft === null) return null

  return (
    <>
      {/* Countdown section — replaces the product grid visually */}
      <section id="countdown" className="bg-[#0A0A0A] py-16 md:py-24 border-t border-[#242424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Label */}
          <div className="inline-flex items-center gap-2.5 border border-[#C0231E]/35 bg-[#C0231E]/10 text-[#C0231E] text-[10px] font-body font-bold px-4 py-2 tracking-[0.2em] uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C0231E] animate-[pulse-dot_1.8s_ease-in-out_infinite]" />
            Drop 001 Unlocks In
          </div>

          {/* Timer */}
          <div className="flex items-end justify-center gap-4 md:gap-6 mb-6">
            <Digit value={timeLeft.days}    label="Days"    />
            <span className="font-heading font-black text-[#C0231E] text-5xl md:text-7xl mb-6 leading-none">:</span>
            <Digit value={timeLeft.hours}   label="Hours"   />
            <span className="font-heading font-black text-[#C0231E] text-5xl md:text-7xl mb-6 leading-none">:</span>
            <Digit value={timeLeft.minutes} label="Minutes" />
            <span className="font-heading font-black text-[#C0231E] text-5xl md:text-7xl mb-6 leading-none">:</span>
            <Digit value={timeLeft.seconds} label="Seconds" />
          </div>

          <p className="font-product text-[#525252] text-sm">
            Products unlock automatically when the timer hits zero. No refresh needed.
          </p>
        </div>
      </section>

      {/* Locked overlay over the drops section */}
      <div
        id="drops-lock-overlay"
        className="pointer-events-none select-none"
        aria-hidden="true"
      >
        {/* ProductGrid renders behind this — blur + darken until unlock */}
        <style>{`
          #drops { filter: blur(6px); opacity: 0.3; pointer-events: none; user-select: none; transition: all 0.6s ease; }
        `}</style>
      </div>
    </>
  )
}
