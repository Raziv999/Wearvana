'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'wearvana_grail_list'

export function useGrailList() {
  // Start empty — populated after mount to avoid hydration mismatch
  const [grails, setGrails] = useState([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setGrails(JSON.parse(stored))
    } catch {}
    setMounted(true)
  }, [])

  const save = useCallback((next) => {
    setGrails(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
  }, [])

  const addToGrail = useCallback((product) => {
    setGrails((prev) => {
      if (prev.some((p) => p._id === product._id)) return prev
      const next = [...prev, product]
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const removeFromGrail = useCallback((productId) => {
    setGrails((prev) => {
      const next = prev.filter((p) => p._id !== productId)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const toggleGrail = useCallback((product) => {
    setGrails((prev) => {
      const exists = prev.some((p) => p._id === product._id)
      const next = exists
        ? prev.filter((p) => p._id !== product._id)
        : [...prev, product]
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const isInGrail = useCallback(
    (productId) => grails.some((p) => p._id === productId),
    [grails]
  )

  const clearGrail = useCallback(() => {
    save([])
  }, [save])

  return {
    grails,
    mounted,       // use this to avoid rendering heart state before hydration
    addToGrail,
    removeFromGrail,
    toggleGrail,
    isInGrail,
    clearGrail,
    count: grails.length,
  }
}
