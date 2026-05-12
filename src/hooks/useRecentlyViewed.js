'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'wearvana_recently_viewed'
const MAX_ITEMS   = 4

export function useRecentlyViewed() {
  const [items, setItems]   = useState([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {}
    setMounted(true)
  }, [])

  const trackView = useCallback((product) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const current = stored ? JSON.parse(stored) : []
      // Remove if already exists, add to front, cap at MAX_ITEMS
      const next = [
        product,
        ...current.filter(p => p._id !== product._id),
      ].slice(0, MAX_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setItems(next)
    } catch {}
  }, [])

  return { items, mounted, trackView }
}
