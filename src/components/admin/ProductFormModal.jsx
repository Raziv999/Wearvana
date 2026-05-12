'use client'

import { useState, useEffect, useRef, useId } from 'react'
import { X, Loader2, RefreshCw, ChevronDown, Images } from 'lucide-react'
import ImageUploader from './ImageUploader'

const API = process.env.NEXT_PUBLIC_API_URL

const BRANDS    = ['NIKE', 'JORDAN', 'ADIDAS', 'NEW BALANCE', 'NEW ERA', 'ON RUNNING']
const CATEGORIES = ['sneakers', 'running', 'caps']
const BADGES    = ['', 'HOT', 'NEW', 'SELLING FAST', 'ICONIC']

const JORDAN_SUBCATEGORIES = [
  '', 'Jordan 1 Low', 'Jordan 1 Mid', 'Jordan 1 High',
  'Air Jordan 4', 'Air Jordan 3', 'Air Jordan 5',
  'Air Jordan 6', 'Air Jordan 11', 'Air Jordan 12',
]
const RUNNING_SUBCATEGORIES = ['', 'Road Running', 'Trail Running', 'Track & Field']

function toSlug(brand, name) {
  return `${brand} ${name}`
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const EMPTY = {
  brand: 'NIKE', name: '', colorway: '', price: '',
  category: 'sneakers', subcategory: '',
  image: '', images: ['', '', '', ''],
  badge: '', limited: false, available: true,
  slotsRemaining: '', slug: '',
}

export default function ProductFormModal({ product, onClose, onSaved }) {
  const isEdit = Boolean(product)
  const [form, setForm]             = useState(EMPTY)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [retryMsg, setRetryMsg]     = useState('')
  const retryTimer                  = useRef(null)

  useEffect(() => {
    if (product) {
      setForm({
        brand:          product.brand          ?? 'NIKE',
        name:           product.name           ?? '',
        colorway:       product.colorway       ?? '',
        price:          product.price          ?? '',
        category:       product.category       ?? 'sneakers',
        subcategory:    product.subcategory    ?? '',
        image:          product.image          ?? '',
        images:         product.images?.length
          ? [...product.images, '', '', '', ''].slice(0, 4)
          : ['', '', '', ''],
        badge:          product.badge          ?? '',
        limited:        product.limited        ?? false,
        available:      product.available      ?? true,
        slotsRemaining: product.slotsRemaining ?? '',
        slug:           product.slug           ?? '',
      })
      setSlugEdited(true)
    }
  }, [product])

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => {
      const next = { ...f, [key]: value }
      if (!slugEdited && (key === 'brand' || key === 'name')) {
        next.slug = toSlug(next.brand, next.name)
      }
      return next
    })
  }

  const setImage    = (url) => setForm(f => ({ ...f, image: url }))
  const setGallery  = (i, url) => setForm(f => {
    const imgs = [...f.images]; imgs[i] = url; return { ...f, images: imgs }
  })

  // Bulk gallery upload — upload multiple files at once to Cloudinary
  const bulkInputId = useId()
  const [bulkUploading, setBulkUploading] = useState(false)
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const PRESET     = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET

  const handleBulkUpload = async (e) => {
    const files = Array.from(e.target.files ?? []).slice(0, 4)
    if (!files.length) return
    setBulkUploading(true)
    const urls = await Promise.all(files.map(async (file) => {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', PRESET)
      try {
        const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: fd })
        const data = await res.json()
        return res.ok ? data.secure_url : ''
      } catch { return '' }
    }))
    setForm(f => {
      const imgs = [...f.images]
      urls.forEach((url, i) => { if (url) imgs[i] = url })
      return { ...f, images: imgs }
    })
    setBulkUploading(false)
    e.target.value = ''
  }

  const handleSlugChange = (e) => {
    setSlugEdited(true)
    setForm(f => ({ ...f, slug: e.target.value }))
  }

  const regenerateSlug = () => {
    setForm(f => ({ ...f, slug: toSlug(f.brand, f.name) }))
    setSlugEdited(false)
  }

  const doSave = async (payload) => {
    const url    = isEdit ? `${API}/api/products/${product._id}` : `${API}/api/products`
    const method = isEdit ? 'PATCH' : 'POST'
    const res    = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? data.error ?? 'Something went wrong.')
    return data
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setRetryMsg('')
    if (!form.name.trim())     return setError('Product name is required.')
    if (!form.colorway.trim()) return setError('Colorway is required.')
    if (!form.price)           return setError('Price is required.')
    if (!form.slug.trim())     return setError('Slug is required.')

    const payload = {
      ...form,
      price:          Number(form.price),
      slotsRemaining: form.slotsRemaining === '' ? null : Number(form.slotsRemaining),
      badge:          form.badge       === '' ? null : form.badge,
      subcategory:    form.subcategory === '' ? null : form.subcategory,
      image:          form.image.trim() || '',
      images:         form.images.map(s => s.trim()).filter(Boolean),
    }

    setLoading(true)

    // Attempt 1
    try {
      const data = await doSave(payload)
      onSaved(data)
      return
    } catch (err) {
      const isNetwork = err instanceof TypeError  // fetch() threw — network error
      if (!isNetwork) {
        setError(err.message)
        setLoading(false)
        return
      }
    }

    // Network error — server likely asleep. Auto-retry with countdown.
    let secs = 30
    setRetryMsg(`Server is waking up… retrying in ${secs}s`)
    retryTimer.current = setInterval(() => {
      secs -= 1
      if (secs > 0) {
        setRetryMsg(`Server is waking up… retrying in ${secs}s`)
      } else {
        clearInterval(retryTimer.current)
        setRetryMsg('Retrying now…')
      }
    }, 1000)

    await new Promise(r => setTimeout(r, 30_000))
    clearInterval(retryTimer.current)
    setRetryMsg('')

    // Attempt 2
    try {
      const data = await doSave(payload)
      onSaved(data)
    } catch {
      setError('Still could not reach server. Visit getwearvana.com/api/products in your browser to wake it, then try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-2xl bg-[#111111] border border-[#242424] overflow-y-auto max-h-[96vh] sm:max-h-[90vh]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#242424] sticky top-0 bg-[#111111] z-10">
          <div>
            <p className="font-body text-[9px] text-[#525252] tracking-[0.2em] uppercase">
              {isEdit ? 'Edit Product' : 'New Product'}
            </p>
            <p className="font-heading font-black text-[#F4F4F4] text-xl uppercase leading-tight">
              {isEdit ? form.name || 'Product' : 'Add to Drop'}
            </p>
          </div>
          <button onClick={onClose} className="text-[#525252] hover:text-[#F4F4F4] transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ══ PHOTO SECTION ══════════════════════════════════════ */}
          <div className="p-5 border-b border-[#242424]">
            <p className="font-body text-[9px] text-[#525252] tracking-[0.2em] uppercase mb-3">
              Photos
              <span className="ml-1 normal-case opacity-60">— tap to shoot or pick from gallery</span>
            </p>

            {/* Main image — full width, tall */}
            <div className="mb-3">
              <ImageUploader
                value={form.image}
                onChange={setImage}
                size="lg"
                label="Main Photo"
              />
            </div>

            {/* Gallery row — 4 equal thumbnails + bulk upload */}
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-body text-[8px] text-[#383838] tracking-widest uppercase">
                Gallery Photos (up to 4)
              </p>
              <label
                htmlFor={bulkInputId}
                className={`flex items-center gap-1.5 font-body text-[8px] tracking-widest uppercase cursor-pointer transition-colors ${
                  bulkUploading ? 'text-[#525252]' : 'text-[#525252] hover:text-[#C0231E]'
                }`}
              >
                {bulkUploading
                  ? <Loader2 size={10} className="animate-spin" />
                  : <Images size={10} />
                }
                {bulkUploading ? 'Uploading…' : 'Upload All at Once'}
              </label>
              <input
                id={bulkInputId}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={handleBulkUpload}
                disabled={bulkUploading}
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {form.images.map((src, i) => (
                <ImageUploader
                  key={i}
                  value={src}
                  onChange={(url) => setGallery(i, url)}
                  size="sm"
                  label={String(i + 2)}
                />
              ))}
            </div>

            <p className="font-body text-[#383838] text-[9px] mt-2 leading-relaxed">
              Main photo appears on the product card. Extra photos appear in the gallery on the product page.
            </p>
          </div>

          {/* ══ DETAILS SECTION ════════════════════════════════════ */}
          <div className="p-5 space-y-4">

            {/* Brand + Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Brand</label>
                <div className="relative">
                  <select value={form.brand} onChange={set('brand')} className="field-input pr-8">
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#525252] pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="field-label">Category</label>
                <div className="relative">
                  <select value={form.category} onChange={set('category')} className="field-input pr-8">
                    <option value="sneakers">Sneakers</option>
                    <option value="running">Running</option>
                    <option value="caps">Caps</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#525252] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Subcategory */}
            {(form.brand === 'JORDAN' || form.category === 'running') && (
              <div>
                <label className="field-label">
                  Silhouette / Type
                  <span className="ml-1 opacity-50 normal-case">(used for filtering)</span>
                </label>
                <div className="relative">
                  <select value={form.subcategory} onChange={set('subcategory')} className="field-input pr-8">
                    {(form.brand === 'JORDAN' ? JORDAN_SUBCATEGORIES : RUNNING_SUBCATEGORIES).map(s => (
                      <option key={s} value={s}>{s === '' ? 'None / General' : s}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#525252] pointer-events-none" />
                </div>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="field-label">Product Name</label>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="Air Jordan 1 Retro High OG"
                className="field-input"
                autoComplete="off"
              />
            </div>

            {/* Colorway */}
            <div>
              <label className="field-label">Colorway</label>
              <input
                type="text"
                value={form.colorway}
                onChange={set('colorway')}
                placeholder="Chicago — White / Black / Varsity Red"
                className="field-input"
                autoComplete="off"
              />
            </div>

            {/* Price + Slots */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Price (NPR)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={set('price')}
                  placeholder="24500"
                  min="0"
                  inputMode="numeric"
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">
                  Slots Left
                  <span className="ml-1 opacity-50 normal-case">(blank = ∞)</span>
                </label>
                <input
                  type="number"
                  value={form.slotsRemaining}
                  onChange={set('slotsRemaining')}
                  placeholder="∞"
                  min="0"
                  inputMode="numeric"
                  className="field-input"
                />
              </div>
            </div>

            {/* Slug */}
            <div>
              <label className="field-label">
                URL Slug
                <span className="ml-1 opacity-50 normal-case">(auto)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="air-jordan-1-chicago"
                  className="field-input flex-1"
                  autoComplete="off"
                  autoCapitalize="none"
                />
                <button
                  type="button"
                  onClick={regenerateSlug}
                  title="Regenerate"
                  className="border border-[#242424] hover:border-[#C0231E]/50 text-[#525252] hover:text-[#F4F4F4] px-3 transition-colors"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
              {form.slug && (
                <p className="font-body text-[#383838] text-[9px] mt-1 truncate">
                  getwearvana.com/product/<span className="text-[#525252]">{form.slug}</span>
                </p>
              )}
            </div>

            {/* Badge + toggles */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Badge</label>
                <div className="relative">
                  <select value={form.badge} onChange={set('badge')} className="field-input pr-8">
                    {BADGES.map(b => (
                      <option key={b} value={b}>{b === '' ? 'None' : b}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#525252] pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-5">
                {/* Limited toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setForm(f => ({ ...f, limited: !f.limited }))}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${form.limited ? 'bg-[#C0231E]' : 'bg-[#242424]'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.limited ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                  <span className="font-body text-xs text-[#909090] tracking-wide uppercase">Limited</span>
                </label>
                {/* Available toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setForm(f => ({ ...f, available: !f.available }))}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${form.available ? 'bg-[#34D399]' : 'bg-[#242424]'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.available ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                  <span className="font-body text-xs text-[#909090] tracking-wide uppercase">Live</span>
                </label>
              </div>
            </div>

            {/* Advance preview */}
            {form.price && (
              <div className="bg-[#1C1C1C] border border-[#242424] p-3 flex items-center justify-between">
                <p className="font-body text-[#525252] text-xs">Customer pays advance (50%)</p>
                <p className="font-product font-bold text-[#C0231E] text-sm">
                  NPR {Math.ceil(Number(form.price) / 2).toLocaleString()}
                </p>
              </div>
            )}

            {retryMsg && (
              <div className="flex items-center gap-2 font-body text-[#FBBF24] text-xs leading-relaxed">
                <Loader2 size={13} className="animate-spin shrink-0" />
                {retryMsg}
              </div>
            )}
            {error && (
              <p className="font-body text-[#C0231E] text-xs leading-relaxed">{error}</p>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-1 pb-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-[#242424] hover:border-[#C0231E]/30 text-[#525252] hover:text-[#F4F4F4] font-body font-bold text-xs tracking-[0.15em] uppercase py-4 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-[#C0231E] hover:bg-[#D4251F] disabled:bg-[#1C1C1C] disabled:text-[#525252] text-white font-body font-bold text-xs tracking-[0.18em] uppercase py-4 transition-all"
              >
                {loading
                  ? <Loader2 size={16} className="animate-spin" />
                  : isEdit ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </form>

        <style>{`
          .field-label {
            display: block;
            font-family: inherit;
            font-size: 10px;
            color: #525252;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-bottom: 6px;
          }
          .field-input {
            width: 100%;
            background: #1C1C1C;
            border: 1px solid #242424;
            color: #F4F4F4;
            font-size: 15px;
            padding: 13px 16px;
            outline: none;
            transition: border-color 0.15s;
            appearance: none;
            -webkit-appearance: none;
          }
          .field-input:focus { border-color: #C0231E; }
          .field-input::placeholder { color: #525252; }
          select.field-input { cursor: pointer; }
        `}</style>
      </div>
    </div>
  )
}
