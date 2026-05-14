'use client'

import { useState } from 'react'
import { X, Bell, Loader2, Check } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL

export default function WaitlistModal({ product, onClose }) {
  const [name,    setName]    = useState('')
  const [phone,   setPhone]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim())  return setError('Please enter your name.')
    if (!phone.trim()) return setError('Please enter your phone number.')
    if (!/^(98|97)\d{8}$/.test(phone.trim()))
      return setError('Enter a valid Nepali number (98/97XXXXXXXX).')

    setLoading(true)
    try {
      const res  = await fetch(`${API}/api/waitlist`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ productId: product._id, name: name.trim(), phone: phone.trim() }),
      })
      const data = await res.json()
      if (!res.ok) return setError(data.message ?? 'Something went wrong.')
      setSuccess(true)
    } catch {
      setError('Could not reach server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-[#111111] border border-[#242424]">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-[#242424]">
          <div>
            <p className="font-body text-[9px] text-[#525252] tracking-[0.2em] uppercase mb-0.5">
              Out of Stock
            </p>
            <p className="font-heading font-black text-[#F4F4F4] text-xl uppercase leading-tight">
              Join the Waitlist
            </p>
          </div>
          <button onClick={onClose} className="text-[#525252] hover:text-[#F4F4F4] transition-colors p-1 mt-0.5">
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center">
              <Check size={28} className="text-[#34D399]" />
            </div>
            <div>
              <p className="font-heading font-black text-[#F4F4F4] text-xl uppercase mb-1.5">
                You're on the list!
              </p>
              <p className="font-body text-[#525252] text-sm leading-relaxed">
                We'll message you on WhatsApp the moment{' '}
                <span className="text-[#909090]">{product.name}</span> becomes available again.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-[#1C1C1C] hover:bg-[#242424] text-[#F4F4F4] font-body font-bold text-xs tracking-[0.15em] uppercase py-4 transition-colors mt-2"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Product info pill */}
            <div className="flex items-center gap-3 bg-[#1C1C1C] border border-[#242424] p-3">
              <Bell size={14} className="text-[#C0231E] shrink-0" />
              <div className="min-w-0">
                <p className="font-body text-[9px] text-[#525252] tracking-widest uppercase">Notify me when available</p>
                <p className="font-product font-bold text-[#F4F4F4] text-sm truncate">{product.name}</p>
              </div>
            </div>

            <div>
              <label className="block font-body text-[10px] text-[#525252] tracking-[0.15em] uppercase mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Aashish Shrestha"
                className="w-full bg-[#1C1C1C] border border-[#242424] focus:border-[#C0231E] text-[#F4F4F4] font-body text-sm px-4 py-3 outline-none transition-colors placeholder-[#383838]"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block font-body text-[10px] text-[#525252] tracking-[0.15em] uppercase mb-1.5">
                WhatsApp Number
              </label>
              <div className="flex">
                <span className="flex items-center px-3 bg-[#1C1C1C] border border-r-0 border-[#242424] text-[#525252] font-body text-sm select-none">
                  +977
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="9812345678"
                  inputMode="tel"
                  maxLength={10}
                  className="flex-1 bg-[#1C1C1C] border border-[#242424] focus:border-[#C0231E] text-[#F4F4F4] font-body text-sm px-4 py-3 outline-none transition-colors placeholder-[#383838]"
                />
              </div>
              <p className="font-body text-[#383838] text-[10px] mt-1">
                We'll send one WhatsApp message when this drops. No spam.
              </p>
            </div>

            {error && (
              <p className="font-body text-[#C0231E] text-xs leading-relaxed">{error}</p>
            )}

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
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Bell size={14} />}
                {loading ? 'Joining…' : 'Notify Me'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
