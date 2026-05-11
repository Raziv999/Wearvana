'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu, X, MessageCircle, Instagram, Heart } from 'lucide-react'
import { useGrailList } from '@/hooks/useGrailList'
import GrailDrawer from './GrailDrawer'

const WA_NUMBER = '9779705477470'
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  "Hi Wearvana! I want to know more about your latest drops."
)}`
const INSTAGRAM_URL = 'https://www.instagram.com/wearvana.kicks?igsh=aW56dmx5aWJiaDFt'

const NAV_LINKS = [
  { label: 'Drops',        href: '/#drops' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Track Order',  href: '/track' },
  { label: 'About',        href: '/about' },
  { label: 'FAQ',          href: '/faq' },
]

export default function Header() {
  const [menuOpen, setMenuOpen]   = useState(false)
  const [grailOpen, setGrailOpen] = useState(false)
  const { count, mounted }        = useGrailList()

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#242424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <a href="/" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Wearvana"
                width={160}
                height={48}
                className="h-8 md:h-10 w-auto"
                priority
              />
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-body text-xs font-medium text-[#909090] hover:text-[#F4F4F4] tracking-[0.12em] uppercase transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop right side */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#525252] hover:text-[#C0231E] transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram size={17} />
              </a>

              {/* Grail List button */}
              <button
                onClick={() => setGrailOpen(true)}
                className="relative text-[#525252] hover:text-[#C0231E] transition-colors duration-200"
                aria-label="Grail List"
              >
                <Heart size={17} />
                {mounted && count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#C0231E] text-white font-body font-bold text-[9px] flex items-center justify-center rounded-full">
                    {count}
                  </span>
                )}
              </button>

              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#C0231E] hover:bg-[#D4251F] text-white font-body font-semibold text-xs px-5 py-2.5 tracking-widest uppercase transition-colors duration-200"
              >
                <MessageCircle size={14} />
                Chat to Order
              </a>
            </div>

            {/* Mobile right side */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={() => setGrailOpen(true)}
                className="relative text-[#525252] p-1"
                aria-label="Grail List"
              >
                <Heart size={20} />
                {mounted && count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C0231E] text-white font-body font-bold text-[9px] flex items-center justify-center rounded-full">
                    {count}
                  </span>
                )}
              </button>
              <button
                className="text-[#F4F4F4] p-1"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="md:hidden bg-[#111111] border-t border-[#242424]">
            <div className="px-5 py-5 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-body text-sm font-medium text-[#909090] hover:text-[#F4F4F4] tracking-widest uppercase py-3 border-b border-[#1C1C1C] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#C0231E] text-white font-body font-bold text-xs tracking-widest uppercase py-4 mt-3"
              >
                <MessageCircle size={15} />
                Chat to Order
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-[#242424] text-[#909090] font-body font-bold text-xs tracking-widest uppercase py-3"
              >
                <Instagram size={15} />
                Follow on Instagram
              </a>
            </div>
          </div>
        )}
      </header>

      <GrailDrawer open={grailOpen} onClose={() => setGrailOpen(false)} />
    </>
  )
}
