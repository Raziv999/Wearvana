'use client'

import { useState, useRef } from 'react'
import { Search, ArrowRight, Sparkles, Camera, X, Loader2, ImagePlus } from 'lucide-react'

const WA_NUMBER    = '9779705477470'
const CLOUD_NAME   = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET

export default function CustomSource() {
  const [sneaker,    setSneaker]    = useState('')
  const [size,       setSize]       = useState('')
  const [photo,      setPhoto]      = useState(null)   // { file, preview, url }
  const [uploading,  setUploading]  = useState(false)
  const [uploadErr,  setUploadErr]  = useState('')
  const fileRef = useRef(null)

  const canSubmit = sneaker.trim().length > 0 && size.trim().length > 0 && !uploading

  // ── Upload photo to Cloudinary ─────────────────────────────────
  const handleFile = async (file) => {
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { setUploadErr('Photo too large (max 10 MB)'); return }

    const preview = URL.createObjectURL(file)
    setPhoto({ file, preview, url: null })
    setUploadErr('')
    setUploading(true)

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', UPLOAD_PRESET)
      fd.append('folder', 'wearvana-source-requests')

      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()

      if (data.secure_url) {
        setPhoto(prev => ({ ...prev, url: data.secure_url }))
      } else {
        setUploadErr('Upload failed. You can still submit without a photo.')
        setPhoto(null)
      }
    } catch {
      setUploadErr('Upload failed. You can still submit without a photo.')
      setPhoto(null)
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = () => {
    if (photo?.preview) URL.revokeObjectURL(photo.preview)
    setPhoto(null)
    setUploadErr('')
    if (fileRef.current) fileRef.current.value = ''
  }

  // ── Build WhatsApp message + open ─────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return

    let message =
      `Hi Wearvana! I want you to source something for me:\n\n` +
      `👟 Sneaker: ${sneaker.trim()}\n` +
      `📏 Size: ${size.trim()}\n`

    if (photo?.url) {
      message += `\n📸 Reference photo:\n${photo.url}\n`
    }

    message += `\nCan you check availability and pricing?`

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="bg-[#0A0A0A] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden border border-[#C0231E]/25 p-8 md:p-12"
          style={{ background: 'linear-gradient(135deg, #111111 0%, #1a0505 50%, #111111 100%)' }}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C0231E]/60" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C0231E]/60" />

          <div className="max-w-2xl mx-auto">

            {/* Header */}
            <div className="flex items-start gap-3 mb-2">
              <Sparkles size={18} className="text-[#C0231E] mt-1 flex-shrink-0" />
              <p className="font-body text-[#C0231E] text-[10px] tracking-[0.22em] uppercase">
                Concierge Service
              </p>
            </div>

            <h2
              className="font-heading font-black text-[#F4F4F4] uppercase leading-none mb-3"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)' }}
            >
              Can't Find Your Grail?
            </h2>

            <p className="font-product text-[#909090] text-sm md:text-base mb-8 leading-relaxed">
              We source globally. If it exists, we can get it.
              Tell us what you're looking for and we'll hunt it down.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">

              {/* Row 1: sneaker name + size */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Sneaker name */}
                <div className="flex-1 relative">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#525252] pointer-events-none" />
                  <input
                    type="text"
                    placeholder='e.g. "Nike Dunk Low Panda"'
                    value={sneaker}
                    onChange={(e) => setSneaker(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#242424] focus:border-[#C0231E] text-[#F4F4F4] font-body text-sm pl-10 pr-4 py-3.5 outline-none transition-colors placeholder:text-[#525252]"
                  />
                </div>

                {/* Size */}
                <input
                  type="text"
                  placeholder="Your Size (e.g. US 10)"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="sm:w-44 bg-[#0A0A0A] border border-[#242424] focus:border-[#C0231E] text-[#F4F4F4] font-body text-sm px-4 py-3.5 outline-none transition-colors placeholder:text-[#525252]"
                />
              </div>

              {/* Row 2: photo upload + submit */}
              <div className="flex flex-col sm:flex-row gap-3 items-start">

                {/* Photo upload area */}
                <div className="flex-1">
                  {photo?.preview ? (
                    /* Preview */
                    <div className="flex items-center gap-3 bg-[#0A0A0A] border border-[#242424] px-3 py-2.5">
                      <div className="relative w-10 h-10 shrink-0 overflow-hidden border border-[#242424]">
                        <img src={photo.preview} alt="Reference" className="w-full h-full object-cover" />
                        {uploading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 size={12} className="text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {uploading
                          ? <p className="font-body text-[#525252] text-xs">Uploading photo...</p>
                          : photo.url
                            ? <p className="font-body text-[#34D399] text-xs">Photo ready to send</p>
                            : <p className="font-body text-[#C0231E] text-xs">Upload failed</p>
                        }
                      </div>
                      <button type="button" onClick={removePhoto} className="text-[#525252] hover:text-[#C0231E] transition-colors shrink-0">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    /* Upload trigger */
                    <label className="flex items-center gap-3 bg-[#0A0A0A] border border-[#242424] border-dashed hover:border-[#C0231E]/50 px-4 py-3.5 cursor-pointer transition-colors group">
                      <ImagePlus size={15} className="text-[#525252] group-hover:text-[#C0231E] transition-colors shrink-0" />
                      <span className="font-body text-[#525252] group-hover:text-[#909090] text-xs transition-colors">
                        Attach a reference photo
                        <span className="text-[#383838] ml-1">(optional)</span>
                      </span>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files?.[0])}
                      />
                    </label>
                  )}
                  {uploadErr && <p className="font-body text-[#525252] text-[10px] mt-1.5">{uploadErr}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`group flex items-center justify-center gap-2 font-body font-bold text-xs tracking-widest uppercase px-7 py-3.5 transition-all duration-200 shrink-0 ${
                    canSubmit
                      ? 'bg-[#C0231E] hover:bg-[#D4251F] text-white'
                      : 'bg-[#1C1C1C] text-[#525252] cursor-not-allowed'
                  }`}
                >
                  {uploading ? <Loader2 size={13} className="animate-spin" /> : (
                    <>
                      Source It
                      <ArrowRight size={14} className={canSubmit ? 'group-hover:translate-x-1 transition-transform' : ''} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Trust note */}
            <p className="font-body text-[#525252] text-xs mt-4 leading-relaxed">
              We'll respond within 24 hours via WhatsApp with availability and pricing.
              No commitment until you confirm.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
