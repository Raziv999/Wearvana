'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggle, mounted } = useTheme()

  // Render a neutral placeholder until JS hydrates to avoid layout shift
  if (!mounted) {
    return (
      <div className={`w-8 h-8 flex items-center justify-center ${className}`} aria-hidden />
    )
  }

  const isLight = theme === 'light'

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      className={`relative w-8 h-8 flex items-center justify-center text-[#525252] hover:text-[#C0231E] transition-colors duration-200 ${className}`}
    >
      {isLight
        ? <Moon size={17} strokeWidth={1.75} />
        : <Sun  size={17} strokeWidth={1.75} />
      }
    </button>
  )
}
