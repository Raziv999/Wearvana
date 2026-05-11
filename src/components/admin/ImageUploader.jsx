'use client'

import { useState, useId } from 'react'
import Image from 'next/image'
import { Camera, Loader2, X, Link2 } from 'lucide-react'

// Direct browser → Cloudinary unsigned upload (no API secret needed)
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const PRESET     = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET

/**
 * ImageUploader
 * Tap the tile → native OS file/camera sheet (works on all mobile browsers)
 * OR switch to URL mode to paste a Cloudinary/external link.
 *
 * Props
 *  value    – current image URL string
 *  onChange – (url: string) => void
 *  size     – 'lg' | 'sm'
 *  label    – optional slot label (e.g. "Main", "2")
 */
export default function ImageUploader({ value, onChange, size = 'sm', label }) {
  const id = useId()   // stable unique id for <label htmlFor>
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState('')
  const [urlMode,   setUrlMode]   = useState(false)
  const [urlDraft,  setUrlDraft]  = useState('')

  const isLg = size === 'lg'

  // ── Upload directly from browser → Cloudinary (unsigned) ─────
  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Client-side size guard (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large — max 10 MB')
      e.target.value = ''
      return
    }

    if (!CLOUD_NAME || !PRESET) {
      setError('Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_PRESET to .env.local')
      e.target.value = ''
      return
    }

    setUploading(true)
    setError('')

    const fd = new FormData()
    fd.append('file', file)
    fd.append('upload_preset', PRESET)

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: fd }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error?.message ?? `Upload failed (${res.status})`)
      }

      onChange(data.secure_url)
    } catch (err) {
      setError(err.message ?? 'Upload failed — check your Cloudinary preset')
    } finally {
      setUploading(false)
      e.target.value = ''   // reset so the same file can be re-chosen
    }
  }

  const applyUrl = () => {
    const trimmed = urlDraft.trim()
    if (trimmed) { onChange(trimmed); setUrlMode(false); setUrlDraft('') }
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-1.5">

      {/* ── Tile (the actual clickable area) ── */}
      {/*
        Using <label htmlFor={id}> so the BROWSER opens the file picker.
        This is the only cross-platform way to open camera/gallery on mobile
        — programmatic .click() is blocked by iOS Safari and some Androids.
      */}
      <label
        htmlFor={id}
        className={`relative block overflow-hidden bg-[#1C1C1C] cursor-pointer border-2 transition-all select-none
          ${isLg ? 'aspect-[4/3]' : 'aspect-square'}
          ${value
            ? 'border-[#383838] hover:border-[#C0231E]/60 active:border-[#C0231E]'
            : 'border-dashed border-[#383838] hover:border-[#C0231E]/50 active:border-[#C0231E]/80'
          }`
        }
      >
        {/* Preview */}
        {value && !uploading && (
          <Image
            src={value}
            alt=""
            fill
            className="object-contain pointer-events-none"
            sizes={isLg ? '600px' : '120px'}
          />
        )}

        {/* Uploading */}
        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#1C1C1C]">
            <Loader2 size={isLg ? 28 : 18} className="animate-spin text-[#C0231E]" />
            {isLg && (
              <p className="font-body text-[9px] text-[#525252] tracking-widest uppercase">Uploading…</p>
            )}
          </div>
        )}

        {/* Empty state */}
        {!value && !uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
            <Camera size={isLg ? 26 : 16} className="text-[#525252]" />
            {isLg && (
              <p className="font-body text-[9px] text-[#383838] tracking-widest uppercase text-center px-3 leading-relaxed">
                Tap to shoot or<br />pick from gallery
              </p>
            )}
          </div>
        )}

        {/* Hover overlay on existing image */}
        {value && !uploading && (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/45 active:bg-black/45 transition-all flex items-center justify-center">
            <Camera size={isLg ? 20 : 14} className="text-white opacity-0 group-hover:opacity-100" />
          </div>
        )}
      </label>

      {/* Label below tile */}
      {label && (
        <p className="font-body text-[8px] text-[#383838] tracking-widest uppercase text-center">{label}</p>
      )}

      {/* Remove button */}
      {value && !uploading && (
        <button
          type="button"
          onClick={() => { onChange(''); setError('') }}
          className="flex items-center justify-center gap-1 font-body text-[8px] text-[#383838] hover:text-[#C0231E] tracking-wide uppercase transition-colors"
        >
          <X size={9} /> Remove
        </button>
      )}

      {/* Error */}
      {error && (
        <p className="font-body text-[9px] text-[#C0231E] leading-snug break-words">{error}</p>
      )}

      {/* URL fallback */}
      {!urlMode ? (
        <button
          type="button"
          onClick={() => setUrlMode(true)}
          className="flex items-center gap-1 font-body text-[8px] text-[#383838] hover:text-[#525252] tracking-wide uppercase transition-colors self-start"
        >
          <Link2 size={9} /> Paste URL
        </button>
      ) : (
        <div className="flex gap-1">
          <input
            type="url"
            value={urlDraft}
            onChange={e => setUrlDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyUrl() } }}
            placeholder="https://..."
            autoFocus
            className="flex-1 min-w-0 bg-[#1C1C1C] border border-[#242424] focus:border-[#C0231E] text-[#F4F4F4] text-[11px] px-2 py-1.5 outline-none transition-colors placeholder:text-[#383838]"
          />
          <button type="button" onClick={applyUrl}
            className="font-body text-[9px] uppercase px-2 py-1.5 bg-[#C0231E] text-white shrink-0">
            OK
          </button>
          <button type="button" onClick={() => { setUrlMode(false); setUrlDraft('') }}
            className="font-body text-[9px] uppercase px-2 py-1.5 border border-[#242424] text-[#525252] hover:text-[#F4F4F4] shrink-0 transition-colors">
            ✕
          </button>
        </div>
      )}

      {/* The actual file input — hidden, triggered by <label htmlFor> */}
      <input
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFile}
        disabled={uploading}
      />
    </div>
  )
}
