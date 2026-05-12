'use client'

import { useState, useEffect } from 'react'

// Deterministic "random" from product ID — same product always starts with same base
function seededBase(productId) {
  const hash = productId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return (hash % 9) + 3 // always 3–11
}

export default function ViewingCounter({ productId }) {
  const [count, setCount]     = useState(null) // null = not shown yet
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const base = seededBase(productId)
    // Small delay before appearing — feels more real
    const showTimer = setTimeout(() => {
      setCount(base)
      setMounted(true)
    }, 1800)

    // Fluctuate ±1 every 20–45 seconds
    let fluctTimer
    const scheduleFluctuation = () => {
      const delay = 20000 + Math.random() * 25000
      fluctTimer = setTimeout(() => {
        setCount(c => {
          if (c === null) return c
          const delta = Math.random() < 0.55 ? 1 : -1
          return Math.max(2, Math.min(14, c + delta))
        })
        scheduleFluctuation()
      }, delay)
    }

    const startFluctTimer = setTimeout(scheduleFluctuation, 3000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(startFluctTimer)
      clearTimeout(fluctTimer)
    }
  }, [productId])

  if (!mounted || count === null) return null

  return (
    <div className="inline-flex items-center gap-2 font-body text-xs text-[#909090]">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]" />
      </span>
      <span>
        <span className="text-[#F4F4F4] font-semibold">{count}</span>
        {' '}{count === 1 ? 'person' : 'people'} viewing this
      </span>
    </div>
  )
}
