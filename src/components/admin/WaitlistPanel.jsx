'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Copy, Check, Bell, BellOff, Trash2, Loader2 } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL

export default function WaitlistPanel({ product, onClose, onCountChange }) {
  const [entries, setEntries]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [copied,  setCopied]    = useState(false)

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch(`${API}/api/waitlist/${product._id}`, { cache: 'no-store' })
      const data = await res.json()
      setEntries(Array.isArray(data) ? data : [])
    } catch { setEntries([]) }
    setLoading(false)
  }, [product._id])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  // Keep parent badge count in sync
  useEffect(() => {
    if (!loading) onCountChange?.(product._id, entries.length)
  }, [entries.length, loading, product._id, onCountChange])

  const handleCopyAll = () => {
    const numbers = entries.map(e => `+977${e.phone}`).join('\n')
    navigator.clipboard.writeText(numbers).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleNotified = async (entry) => {
    const next = !entry.notified
    // Optimistic update
    setEntries(prev => prev.map(e => e._id === entry._id ? { ...e, notified: next } : e))
    try {
      await fetch(`${API}/api/waitlist/${entry._id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ notified: next }),
      })
    } catch {
      // Revert on failure
      setEntries(prev => prev.map(e => e._id === entry._id ? { ...e, notified: !next } : e))
    }
  }

  const handleRemove = async (entry) => {
    setEntries(prev => prev.filter(e => e._id !== entry._id))
    onCountChange?.(product._id, entries.length - 1)
    try {
      await fetch(`${API}/api/waitlist/${entry._id}`, { method: 'DELETE' })
    } catch {
      fetchEntries() // re-sync if delete failed
    }
  }

  const unnotified = entries.filter(e => !e.notified)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] bg-[#111111] border-l border-[#242424] flex flex-col">

        {/* Header */}
        <div className="px-5 py-4 border-b border-[#242424] flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <p className="font-body text-[9px] text-[#525252] tracking-[0.2em] uppercase mb-0.5">
              Waitlist
            </p>
            <p className="font-heading font-black text-[#F4F4F4] text-lg uppercase leading-tight truncate">
              {product.name}
            </p>
            <p className="font-body text-[11px] text-[#525252] mt-0.5">
              {loading ? '—' : `${entries.length} ${entries.length === 1 ? 'person' : 'people'}`}
              {!loading && unnotified.length > 0 && (
                <span className="ml-2 text-[#FBBF24]">· {unnotified.length} unnotified</span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#525252] hover:text-[#F4F4F4] transition-colors p-1 shrink-0 mt-0.5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Actions */}
        {!loading && entries.length > 0 && (
          <div className="px-5 py-3 border-b border-[#242424] shrink-0">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-2 w-full font-body font-bold text-[10px] tracking-[0.15em] uppercase py-2.5 border transition-all duration-200 justify-center border-[#242424] hover:border-[#C0231E]/50 text-[#525252] hover:text-[#F4F4F4]"
            >
              {copied
                ? <><Check size={13} className="text-[#34D399]" /> Copied!</>
                : <><Copy size={13} /> Copy All Numbers ({entries.length})</>
              }
            </button>
          </div>
        )}

        {/* Entries list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-[#525252]">
              <Loader2 size={16} className="animate-spin" />
              <span className="font-body text-xs">Loading…</span>
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-8">
              <div className="w-12 h-12 rounded-full bg-[#1C1C1C] flex items-center justify-center">
                <Bell size={20} className="text-[#383838]" />
              </div>
              <p className="font-body text-[#525252] text-sm">No one on the waitlist yet.</p>
              <p className="font-body text-[#383838] text-xs leading-relaxed">
                Customers who click "Notify Me" on this product will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#1C1C1C]">
              {entries.map((entry, i) => (
                <div
                  key={entry._id}
                  className={`px-5 py-4 flex items-start gap-3 transition-colors ${
                    entry.notified ? 'opacity-40' : ''
                  }`}
                >
                  {/* Index */}
                  <div className="w-6 h-6 rounded-full bg-[#1C1C1C] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-body text-[9px] text-[#525252]">{i + 1}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-product font-bold text-[#F4F4F4] text-sm">
                      {entry.name}
                      {entry.notified && (
                        <span className="ml-2 font-body text-[9px] text-[#34D399] tracking-widest uppercase">Notified</span>
                      )}
                    </p>
                    <p className="font-body text-[#525252] text-xs mt-0.5">
                      +977 {entry.phone}
                    </p>
                    <p className="font-body text-[#383838] text-[10px] mt-1">
                      {new Date(entry.createdAt).toLocaleDateString('en-US', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                      {' · '}
                      {new Date(entry.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Mark notified toggle */}
                    <button
                      onClick={() => handleNotified(entry)}
                      title={entry.notified ? 'Mark as unnotified' : 'Mark as notified'}
                      className={`p-1.5 border transition-all duration-150 ${
                        entry.notified
                          ? 'border-[#34D399]/30 text-[#34D399] hover:border-[#525252] hover:text-[#525252]'
                          : 'border-[#242424] text-[#525252] hover:border-[#34D399]/50 hover:text-[#34D399]'
                      }`}
                    >
                      {entry.notified ? <BellOff size={13} /> : <Check size={13} />}
                    </button>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(entry)}
                      title="Remove from waitlist"
                      className="p-1.5 border border-[#242424] text-[#525252] hover:border-[#C0231E] hover:text-[#C0231E] transition-all duration-150"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        {!loading && entries.length > 0 && (
          <div className="px-5 py-3 border-t border-[#242424] shrink-0">
            <p className="font-body text-[#383838] text-[10px] leading-relaxed text-center">
              Message customers directly on WhatsApp at +977 followed by their number.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
