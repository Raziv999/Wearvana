'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'wearvana_theme'

export function useTheme() {
  const [theme, setThemeState] = useState('dark')
  const [mounted, setMounted]  = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) ?? 'dark'
    setThemeState(saved)
    document.documentElement.setAttribute('data-theme', saved)
    setMounted(true)
  }, [])

  const setTheme = useCallback((next) => {
    setThemeState(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const toggle = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return { theme, toggle, mounted }
}
