'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Star, Plus, Trash2, Loader2, Check } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL

const LOCATIONS = [
  'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan',
  'Biratnagar', 'Birgunj', 'Butwal', 'Dharan', 'Hetauda', 'Nepal',
]

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={20}
            className={(hover || value) >= n
              ? 'text-[#FBBF24] fill-[#FBBF24]'
              : 'text-[#383838]'}
          />
        </button>
      ))}
    </div>
  )
}

const EMPTY = { name: '', location: 'Kathmandu', product: '', rating: 5, text: '' }

export default function ReviewManager({ onClose }) {
  const [reviews, setReviews]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [saving,  setSaving]    = useState(false)
  const [form,    setForm]      = useState(EMPTY)
  const [error,   setError]     = useState('')
  const [success, setSuccess]   = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch(`${API}/api/reviews/all`, { cache: 'no-store' })
      const data = await res.json()
      setReviews(Array.isArray(data) ? data : [])
    } catch { setReviews([]) }
    setLoading(false)
  }, [])

  useEffect(() => { fetchReviews() }, [fetchReviews])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.text.trim()) {
      setError('Name and review text are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/reviews`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.message || 'Failed to save.')
      } else {
        setForm(EMPTY)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2000)
        fetchReviews()
      }
    } catch { setError('Network error.') }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await fetch(`${API}/api/reviews/${id}`, { method: 'DELETE' })
      setReviews(prev => prev.filter(r => r._id !== id))
    } finally { setDeletingId(null) }
  }

  const handleToggleApproved = async (review) => {
    const next = !review.approved
    setReviews(prev => prev.map(r => r._id === review._id ? { ...r, approved: next } : r))
    await fetch(`${API}/api/reviews/${review._id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ approved: next }),
    })
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[520px] bg-[#111111] border-l border-[#242424] flex flex-col">

        {/* Header */}
        <div className="px-5 py-4 border-b border-[#242424] flex items-center justify-between shrink-0">
          <div>
            <p className="font-body text-[9px] text-[#525252] tracking-[0.2em] uppercase mb-0.5">Admin</p>
            <p className="font-heading font-black text-[#F4F4F4] text-lg uppercase">Customer Reviews</p>
          </div>
          <button onClick={onClose} className="text-[#525252] hover:text-[#F4F4F4] transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* Add review form */}
          <div className="px-5 py-5 border-b border-[#242424]">
            <p className="font-body text-[10px] text-[#525252] tracking-[0.15em] uppercase mb-4">Add Review</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-[9px] text-[#525252] tracking-[0.15em] uppercase block mb-1">Customer Name *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Aarav Sharma"
                    className="w-full bg-[#0A0A0A] border border-[#242424] text-[#F4F4F4] font-body text-sm px-3 py-2 focus:outline-none focus:border-[#C0231E]/60 placeholder:text-[#383838]"
                  />
                </div>
                <div>
                  <label className="font-body text-[9px] text-[#525252] tracking-[0.15em] uppercase block mb-1">Location</label>
                  <select
                    value={form.location}
                    onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                    className="w-full bg-[#0A0A0A] border border-[#242424] text-[#F4F4F4] font-body text-sm px-3 py-2 focus:outline-none focus:border-[#C0231E]/60"
                  >
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-body text-[9px] text-[#525252] tracking-[0.15em] uppercase block mb-1">Product (optional)</label>
                <input
                  value={form.product}
                  onChange={e => setForm(p => ({ ...p, product: e.target.value }))}
                  placeholder="Nike Air Force 1"
                  className="w-full bg-[#0A0A0A] border border-[#242424] text-[#F4F4F4] font-body text-sm px-3 py-2 focus:outline-none focus:border-[#C0231E]/60 placeholder:text-[#383838]"
                />
              </div>

              <div>
                <label className="font-body text-[9px] text-[#525252] tracking-[0.15em] uppercase block mb-2">Rating</label>
                <StarPicker value={form.rating} onChange={r => setForm(p => ({ ...p, rating: r }))} />
              </div>

              <div>
                <label className="font-body text-[9px] text-[#525252] tracking-[0.15em] uppercase block mb-1">Review Text *</label>
                <textarea
                  value={form.text}
                  onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
                  rows={3}
                  placeholder="Genuine pair, fast delivery. Exactly as described..."
                  className="w-full bg-[#0A0A0A] border border-[#242424] text-[#F4F4F4] font-body text-sm px-3 py-2 focus:outline-none focus:border-[#C0231E]/60 placeholder:text-[#383838] resize-none"
                />
              </div>

              {error && <p className="font-body text-[#C0231E] text-xs">{error}</p>}

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 bg-[#C0231E] hover:bg-[#A01E1A] text-white font-body font-bold text-[10px] tracking-[0.15em] uppercase py-2.5 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : success ? <><Check size={13} /> Saved!</> : <><Plus size={13} /> Add Review</>}
              </button>
            </form>
          </div>

          {/* Existing reviews */}
          <div className="px-5 py-4">
            <p className="font-body text-[9px] text-[#525252] tracking-[0.15em] uppercase mb-3">
              {loading ? 'Loading…' : `${reviews.length} Review${reviews.length !== 1 ? 's' : ''}`}
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-8 gap-2 text-[#525252]">
                <Loader2 size={14} className="animate-spin" />
                <span className="font-body text-xs">Loading…</span>
              </div>
            ) : reviews.length === 0 ? (
              <p className="font-body text-[#525252] text-sm text-center py-8">No reviews yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {reviews.map(review => (
                  <div key={review._id} className={`border border-[#1C1C1C] p-4 transition-opacity ${review.approved ? '' : 'opacity-50'}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-body font-bold text-[#F4F4F4] text-sm">{review.name}</p>
                        <p className="font-body text-[#525252] text-[10px]">
                          {review.location}{review.product && ` · ${review.product}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Toggle visibility */}
                        <button
                          onClick={() => handleToggleApproved(review)}
                          title={review.approved ? 'Hide from site' : 'Show on site'}
                          className={`p-1.5 border text-[10px] font-body font-bold tracking-wide uppercase transition-all ${
                            review.approved
                              ? 'border-[#34D399]/30 text-[#34D399] hover:border-[#525252] hover:text-[#525252]'
                              : 'border-[#525252]/30 text-[#525252] hover:border-[#34D399]/30 hover:text-[#34D399]'
                          }`}
                        >
                          {review.approved ? '● Live' : '○ Off'}
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(review._id)}
                          disabled={deletingId === review._id}
                          className="p-1.5 border border-[#242424] text-[#525252] hover:border-[#C0231E] hover:text-[#C0231E] transition-all"
                        >
                          {deletingId === review._id
                            ? <Loader2 size={12} className="animate-spin" />
                            : <Trash2 size={12} />}
                        </button>
                      </div>
                    </div>
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} className={i < review.rating ? 'text-[#FBBF24] fill-[#FBBF24]' : 'text-[#242424]'} />
                      ))}
                    </div>
                    <p className="font-body text-[#909090] text-xs leading-relaxed line-clamp-2">"{review.text}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
