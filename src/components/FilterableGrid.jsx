'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import ProductCard from './ProductCard'
import { Search, X, ChevronDown, SlidersHorizontal } from 'lucide-react'

// ── Brand silhouette map (real sneaker store structure) ───────

const BRAND_DATA = {
  ALL: {
    label: 'All Brands',
    columns: [
      [
        { label: 'All Products',  type: 'shopby', index: 0 },
        { label: "What's New",   type: 'shopby', index: 1 },
        { label: 'Under 10K',    type: 'shopby', index: 2 },
        { label: 'Limited',      type: 'shopby', index: 6 },
      ],
      [
        { label: 'Sneakers',     type: 'shopby', index: 3 },
        { label: 'Running',      type: 'shopby', index: 4 },
        { label: 'Caps',         type: 'shopby', index: 5 },
      ],
    ],
  },
  NIKE: {
    label: 'Nike',
    columns: [
      [
        { label: 'All Nike',     type: 'brand', value: 'NIKE', sub: null },
        { label: 'Air Force 1',  type: 'sub',   value: 'NIKE', sub: 'Air Force 1' },
        { label: 'Air Max',      type: 'sub',   value: 'NIKE', sub: 'Air Max' },
        { label: 'Dunk Low',     type: 'sub',   value: 'NIKE', sub: 'Dunk Low' },
      ],
      [
        { label: 'Dunk High',    type: 'sub',   value: 'NIKE', sub: 'Dunk High' },
        { label: 'Blazer',       type: 'sub',   value: 'NIKE', sub: 'Blazer' },
        { label: 'React',        type: 'sub',   value: 'NIKE', sub: 'React' },
        { label: 'Pegasus',      type: 'sub',   value: 'NIKE', sub: 'Pegasus' },
      ],
      [
        { label: 'Vomero',       type: 'sub',   value: 'NIKE', sub: 'Vomero' },
        { label: 'Invincible',   type: 'sub',   value: 'NIKE', sub: 'Invincible' },
        { label: 'Zoom Fly',     type: 'sub',   value: 'NIKE', sub: 'Zoom Fly' },
        { label: 'Free Run',     type: 'sub',   value: 'NIKE', sub: 'Free Run' },
      ],
    ],
  },
  JORDAN: {
    label: 'Air Jordan',
    columns: [
      [
        { label: 'All Air Jordans', type: 'brand', value: 'JORDAN', sub: null },
        { label: 'Jordan 1 Low',    type: 'sub',   value: 'JORDAN', sub: 'Jordan 1 Low' },
        { label: 'Jordan 1 Mid',    type: 'sub',   value: 'JORDAN', sub: 'Jordan 1 Mid' },
        { label: 'Jordan 1 High',   type: 'sub',   value: 'JORDAN', sub: 'Jordan 1 High' },
      ],
      [
        { label: 'Air Jordan 3',    type: 'sub',   value: 'JORDAN', sub: 'Air Jordan 3' },
        { label: 'Air Jordan 4',    type: 'sub',   value: 'JORDAN', sub: 'Air Jordan 4' },
        { label: 'Air Jordan 5',    type: 'sub',   value: 'JORDAN', sub: 'Air Jordan 5' },
        { label: 'Air Jordan 6',    type: 'sub',   value: 'JORDAN', sub: 'Air Jordan 6' },
      ],
      [
        { label: 'Air Jordan 11',   type: 'sub',   value: 'JORDAN', sub: 'Air Jordan 11' },
        { label: 'Air Jordan 12',   type: 'sub',   value: 'JORDAN', sub: 'Air Jordan 12' },
        { label: 'Air Jordan 13',   type: 'sub',   value: 'JORDAN', sub: 'Air Jordan 13' },
        { label: 'Air Jordan 14',   type: 'sub',   value: 'JORDAN', sub: 'Air Jordan 14' },
      ],
    ],
  },
  ADIDAS: {
    label: 'Adidas',
    columns: [
      [
        { label: 'All Adidas',   type: 'brand', value: 'ADIDAS', sub: null },
        { label: 'Samba',        type: 'sub',   value: 'ADIDAS', sub: 'Samba' },
        { label: 'Gazelle',      type: 'sub',   value: 'ADIDAS', sub: 'Gazelle' },
        { label: 'Stan Smith',   type: 'sub',   value: 'ADIDAS', sub: 'Stan Smith' },
      ],
      [
        { label: 'Ultraboost',   type: 'sub',   value: 'ADIDAS', sub: 'Ultraboost' },
        { label: 'NMD',          type: 'sub',   value: 'ADIDAS', sub: 'NMD' },
        { label: 'Forum',        type: 'sub',   value: 'ADIDAS', sub: 'Forum' },
        { label: 'Adizero',      type: 'sub',   value: 'ADIDAS', sub: 'Adizero' },
      ],
      [
        { label: 'Yeezy 350',    type: 'sub',   value: 'ADIDAS', sub: 'Yeezy 350' },
        { label: 'Yeezy 700',    type: 'sub',   value: 'ADIDAS', sub: 'Yeezy 700' },
        { label: 'Handball Spezial', type: 'sub', value: 'ADIDAS', sub: 'Handball Spezial' },
        { label: 'Campus',       type: 'sub',   value: 'ADIDAS', sub: 'Campus' },
      ],
    ],
  },
  'NEW BALANCE': {
    label: 'New Balance',
    columns: [
      [
        { label: 'All New Balance', type: 'brand', value: 'NEW BALANCE', sub: null },
        { label: '550',           type: 'sub',   value: 'NEW BALANCE', sub: '550' },
        { label: '574',           type: 'sub',   value: 'NEW BALANCE', sub: '574' },
        { label: '990',           type: 'sub',   value: 'NEW BALANCE', sub: '990' },
      ],
      [
        { label: '9060',          type: 'sub',   value: 'NEW BALANCE', sub: '9060' },
        { label: '2002R',         type: 'sub',   value: 'NEW BALANCE', sub: '2002R' },
        { label: '327',           type: 'sub',   value: 'NEW BALANCE', sub: '327' },
        { label: '1906R',         type: 'sub',   value: 'NEW BALANCE', sub: '1906R' },
      ],
      [
        { label: '530',           type: 'sub',   value: 'NEW BALANCE', sub: '530' },
        { label: '860',           type: 'sub',   value: 'NEW BALANCE', sub: '860' },
        { label: 'Fresh Foam X', type: 'sub',    value: 'NEW BALANCE', sub: 'Fresh Foam X' },
      ],
    ],
  },
  'NEW ERA': {
    label: 'New Era',
    columns: [
      [
        { label: 'All New Era',  type: 'brand', value: 'NEW ERA', sub: null },
        { label: '59FIFTY',      type: 'sub',   value: 'NEW ERA', sub: '59FIFTY' },
        { label: '9FORTY',       type: 'sub',   value: 'NEW ERA', sub: '9FORTY' },
        { label: '9FIFTY',       type: 'sub',   value: 'NEW ERA', sub: '9FIFTY' },
      ],
      [
        { label: 'MLB Caps',     type: 'sub',   value: 'NEW ERA', sub: 'MLB' },
        { label: 'NBA Caps',     type: 'sub',   value: 'NEW ERA', sub: 'NBA' },
        { label: 'NFL Caps',     type: 'sub',   value: 'NEW ERA', sub: 'NFL' },
        { label: 'Bucket Hat',   type: 'sub',   value: 'NEW ERA', sub: 'Bucket Hat' },
      ],
    ],
  },
  'ON RUNNING': {
    label: 'On Running',
    columns: [
      [
        { label: 'All On Running', type: 'brand', value: 'ON RUNNING', sub: null },
        { label: 'Cloud 6',        type: 'sub',   value: 'ON RUNNING', sub: 'Cloud 6' },
        { label: 'Cloudmonster',   type: 'sub',   value: 'ON RUNNING', sub: 'Cloudmonster' },
        { label: 'Cloudtilt',      type: 'sub',   value: 'ON RUNNING', sub: 'Cloudtilt' },
      ],
      [
        { label: 'Cloudsurfer',    type: 'sub',   value: 'ON RUNNING', sub: 'Cloudsurfer' },
        { label: 'Cloudflow',      type: 'sub',   value: 'ON RUNNING', sub: 'Cloudflow' },
        { label: 'Roger Pro',      type: 'sub',   value: 'ON RUNNING', sub: 'Roger Pro' },
        { label: 'Loewe x On',     type: 'sub',   value: 'ON RUNNING', sub: 'Loewe x On' },
      ],
    ],
  },
}

const BRAND_ORDER = ['ALL', 'NIKE', 'JORDAN', 'ADIDAS', 'NEW BALANCE', 'NEW ERA', 'ON RUNNING']

// ─────────────────────────────────────────────────────────────

const PRICE_RANGES = [
  { label: 'All Prices', min: 0,     max: Infinity },
  { label: 'Under 10K',  min: 0,     max: 9999 },
  { label: '10K – 20K',  min: 10000, max: 20000 },
  { label: '20K+',       min: 20001, max: Infinity },
]

export default function FilterableGrid({ products }) {
  const [open, setOpen]         = useState(false)
  const [search, setSearch]     = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [hoveredBrand, setHoveredBrand] = useState('ALL')
  const [active, setActive]     = useState({ type: 'shopby', index: 0 })
  const [priceIdx, setPriceIdx] = useState(0)   // index into PRICE_RANGES
  const panelRef  = useRef(null)
  const btnRef    = useRef(null)
  const searchRef = useRef(null)

  // Available brands from actual products
  const availableBrands = useMemo(() => new Set(products.map(p => p.brand)), [products])

  // Autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!search.trim() || search.length < 2) return []
    const q = search.toLowerCase()
    const seen = new Set()
    const results = []
    for (const p of products) {
      const label = `${p.brand} ${p.name}`
      if (label.toLowerCase().includes(q) && !seen.has(label)) {
        seen.add(label)
        results.push({ label, slug: p.slug || p._id, image: p.image })
        if (results.length >= 5) break
      }
    }
    return results
  }, [products, search])

  // Hide suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        btnRef.current   && !btnRef.current.contains(e.target)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Filter products
  const filtered = useMemo(() => {
    let pool = products

    if (active.type === 'brand') {
      pool = products.filter(p => p.brand === active.value)
    } else if (active.type === 'sub') {
      pool = products.filter(p =>
        p.brand === active.value && p.subcategory === active.sub
      )
    } else if (active.type === 'shopby') {
      const shopByFilters = [
        () => true,
        (p) => p.badge === 'NEW',
        (p) => p.price < 10000,
        (p) => p.category === 'sneakers',
        (p) => p.category === 'running',
        (p) => p.category === 'caps',
        (p) => p.limited === true,
      ]
      pool = products.filter(shopByFilters[active.index] ?? (() => true))
    }

    // Apply price range
    const { min, max } = PRICE_RANGES[priceIdx]
    if (priceIdx > 0) pool = pool.filter(p => p.price >= min && p.price <= max)

    if (!search.trim()) return pool
    const q = search.toLowerCase()
    return pool.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.colorway?.toLowerCase().includes(q)
    )
  }, [products, active, search, priceIdx])

  // Active label for chip
  const activeLabel = useMemo(() => {
    const shopByLabels = ['All Products', "What's New", 'Under 10K', 'Sneakers', 'Running', 'Caps', 'Limited']
    if (active.type === 'shopby') return shopByLabels[active.index] ?? 'All Products'
    if (active.type === 'brand') return active.value
    if (active.type === 'sub')   return active.sub
    return 'All Products'
  }, [active])

  const isShowingAll = activeLabel === 'All Products' && !search.trim()

  const pick = (item) => {
    if (item.type === 'shopby') {
      setActive({ type: 'shopby', index: item.index })
    } else if (item.type === 'brand') {
      setActive({ type: 'brand', value: item.value })
    } else if (item.type === 'sub') {
      setActive({ type: 'sub', value: item.value, sub: item.sub })
    }
    setOpen(false)
  }

  const isItemActive = (item) => {
    if (item.type === 'shopby') return active.type === 'shopby' && active.index === item.index
    if (item.type === 'brand')  return active.type === 'brand'  && active.value === item.value && !active.sub
    if (item.type === 'sub')    return active.type === 'sub'    && active.value === item.value && active.sub === item.sub
    return false
  }

  const currentData = BRAND_DATA[hoveredBrand] ?? BRAND_DATA['ALL']
  const brandHasProducts = (key) => key === 'ALL' || availableBrands.has(key)

  return (
    <div className="relative">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 mb-6">
        {/* Search with autocomplete */}
        <div ref={searchRef} className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#383838] pointer-events-none z-10" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setShowSuggestions(true) }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={e => { if (e.key === 'Escape') setShowSuggestions(false) }}
            placeholder="Search drops…"
            className="w-full bg-[#111111] border border-[#242424] text-[#F4F4F4] font-body text-xs pl-9 pr-8 py-2.5 placeholder-[#383838] focus:outline-none focus:border-[#C0231E]/60 transition-colors"
            autoComplete="off"
          />
          {search && (
            <button
              onClick={() => { setSearch(''); setShowSuggestions(false) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525252] hover:text-[#F4F4F4] z-10"
            >
              <X size={11} />
            </button>
          )}

          {/* Autocomplete dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#111111] border border-[#242424] shadow-2xl shadow-black/60 z-40 overflow-hidden">
              {suggestions.map((s) => (
                <button
                  key={s.slug}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setSearch(s.label)
                    setShowSuggestions(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#1C1C1C] transition-colors group"
                >
                  {s.image && s.image.startsWith('http') ? (
                    <img src={s.image} alt="" className="w-8 h-8 object-contain opacity-70 group-hover:opacity-100 shrink-0" />
                  ) : (
                    <div className="w-8 h-8 bg-[#1C1C1C] shrink-0" />
                  )}
                  <span className="font-body text-xs text-[#909090] group-hover:text-[#F4F4F4] transition-colors truncate">
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Browse button */}
        <button
          ref={btnRef}
          onClick={() => setOpen(o => !o)}
          className={`flex items-center gap-2 font-body font-bold text-[10px] tracking-[0.15em] uppercase px-4 py-2.5 border transition-all duration-200 ${
            open
              ? 'bg-[#C0231E] border-[#C0231E] text-white'
              : 'border-[#242424] text-[#525252] hover:border-[#C0231E]/50 hover:text-[#F4F4F4]'
          }`}
        >
          <SlidersHorizontal size={12} />
          Browse
          <ChevronDown size={11} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        {/* Active filter chip */}
        {!isShowingAll && (
          <div className="hidden sm:flex items-center gap-1.5 border border-[#C0231E]/30 px-3 py-1.5">
            <span className="font-body text-[9px] font-bold text-[#C0231E] tracking-widest uppercase">{activeLabel}</span>
            <button
              onClick={() => { setActive({ type: 'shopby', index: 0 }); setSearch('') }}
              className="text-[#C0231E]/50 hover:text-[#C0231E] ml-1"
            >
              <X size={10} />
            </button>
          </div>
        )}

        {/* Count */}
        <p className="font-body text-[#383838] text-xs tracking-wide ml-auto">
          {filtered.length} {filtered.length === 1 ? 'style' : 'styles'}
        </p>
      </div>

      {/* ── Price range chips ── */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <p className="font-body text-[9px] text-[#383838] tracking-[0.18em] uppercase shrink-0">Price</p>
        {PRICE_RANGES.map((range, i) => (
          <button
            key={range.label}
            onClick={() => setPriceIdx(i)}
            className={`font-body text-[10px] font-semibold tracking-[0.12em] uppercase px-3 py-1.5 border transition-all duration-150 ${
              priceIdx === i
                ? 'bg-[#C0231E] border-[#C0231E] text-white'
                : 'border-[#242424] text-[#525252] hover:border-[#C0231E]/40 hover:text-[#F4F4F4]'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* ── Mega dropdown ── */}
      {open && (
        <div
          ref={panelRef}
          className="absolute top-0 left-0 right-0 z-30 bg-[#0A0A0A] border border-[#242424] shadow-2xl shadow-black/80"
          style={{ marginTop: '52px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-[#1C1C1C]">
            <p className="font-body text-[9px] text-[#383838] tracking-[0.25em] uppercase">
              Shop by brand or silhouette
            </p>
            <button onClick={() => setOpen(false)} className="text-[#525252] hover:text-[#F4F4F4] transition-colors">
              <X size={14} />
            </button>
          </div>

          <div className="flex">

            {/* LEFT — Brand sidebar */}
            <div className="w-36 shrink-0 border-r border-[#1C1C1C] py-4">
              {BRAND_ORDER.map((key) => {
                const data     = BRAND_DATA[key]
                const hasItems = brandHasProducts(key)
                const isHover  = hoveredBrand === key
                return (
                  <button
                    key={key}
                    onMouseEnter={() => setHoveredBrand(key)}
                    onClick={() => setHoveredBrand(key)}
                    className={`w-full text-left px-5 py-2.5 font-body text-[10px] tracking-[0.12em] uppercase transition-colors duration-100 flex items-center justify-between ${
                      isHover
                        ? 'text-[#F4F4F4] bg-[#111111] border-r-2 border-[#C0231E]'
                        : hasItems
                          ? 'text-[#525252] hover:text-[#F4F4F4] hover:bg-[#111111]'
                          : 'text-[#2a2a2a] cursor-default'
                    }`}
                  >
                    {data.label}
                    {!hasItems && key !== 'ALL' && (
                      <span className="text-[#2a2a2a] text-[8px] tracking-widest">SOON</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* RIGHT — Silhouettes for hovered brand */}
            <div className="flex-1 p-6">
              <div className={`grid gap-x-8 gap-y-0`} style={{ gridTemplateColumns: `repeat(${currentData.columns.length}, 1fr)` }}>
                {currentData.columns.map((col, ci) => (
                  <ul key={ci} className="space-y-1">
                    {col.map((item) => (
                      <li key={item.label}>
                        <button
                          onClick={() => pick(item)}
                          className={`block w-full text-left font-body text-[11px] tracking-[0.1em] uppercase py-1.5 transition-colors duration-100 ${
                            isItemActive(item)
                              ? 'text-[#C0231E] font-bold'
                              : (item.type !== 'brand' && item.type !== 'shopby') && !brandHasProducts(item.value ?? 'ALL')
                                ? 'text-[#2a2a2a] cursor-default'
                                : 'text-[#525252] hover:text-[#F4F4F4]'
                          }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>

              {/* No products hint */}
              {!brandHasProducts(hoveredBrand) && hoveredBrand !== 'ALL' && (
                <p className="font-body text-[#2a2a2a] text-[9px] tracking-widest uppercase mt-6">
                  No {BRAND_DATA[hoveredBrand].label} products yet — coming soon
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Product grid ── */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-body text-[#525252] text-sm mb-3">No products match this filter.</p>
          <button
            onClick={() => { setActive({ type: 'shopby', index: 0 }); setSearch('') }}
            className="font-body text-[10px] text-[#C0231E] tracking-widest uppercase hover:opacity-70 transition-opacity"
          >
            Clear filters →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filtered.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
