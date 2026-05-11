'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Package, CheckCircle2, Truck, MapPin, XCircle, Clock, MessageCircle } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'
const WA_NUMBER = '9779705477470'

const STATUS_STEPS = [
  { key: 'pending',   label: 'Order Received',  icon: Clock,         desc: 'Your pre-order has been received and is awaiting confirmation.' },
  { key: 'confirmed', label: 'Confirmed',        icon: CheckCircle2,  desc: 'We\'ve confirmed your order and collected your advance payment.' },
  { key: 'sourcing',  label: 'Being Sourced',    icon: Search,        desc: 'We\'re actively sourcing your item from our supplier network.' },
  { key: 'arrived',   label: 'Arrived in Nepal', icon: MapPin,        desc: 'Your item has arrived in Nepal and is being prepared for delivery.' },
  { key: 'delivered', label: 'Delivered',        icon: Package,       desc: 'Your order has been delivered. Enjoy your kicks!' },
]

function StatusTimeline({ status }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 border border-[#C0231E]/30 bg-[#C0231E]/10 p-4 mt-6">
        <XCircle size={20} className="text-[#C0231E] shrink-0" />
        <div>
          <p className="font-body font-bold text-[#C0231E] text-sm tracking-wide uppercase">Order Cancelled</p>
          <p className="font-body text-[#909090] text-xs mt-0.5">This order has been cancelled. Message us if you think this is a mistake.</p>
        </div>
      </div>
    )
  }

  const currentIdx = STATUS_STEPS.findIndex(s => s.key === status)

  return (
    <div className="mt-8">
      <div className="relative">
        {STATUS_STEPS.map((step, i) => {
          const Icon = step.icon
          const done    = i < currentIdx
          const current = i === currentIdx
          const future  = i > currentIdx

          return (
            <div key={step.key} className="flex gap-4 pb-8 last:pb-0 relative">
              {/* Vertical connector line */}
              {i < STATUS_STEPS.length - 1 && (
                <div
                  className={`absolute left-[15px] top-8 w-px h-full ${done ? 'bg-[#C0231E]' : 'bg-[#242424]'}`}
                />
              )}

              {/* Icon circle */}
              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                done    ? 'bg-[#C0231E] border-[#C0231E]' :
                current ? 'bg-[#C0231E]/20 border-[#C0231E]' :
                          'bg-[#1C1C1C] border-[#242424]'
              }`}>
                <Icon size={14} className={done || current ? 'text-white' : 'text-[#525252]'} />
              </div>

              {/* Text */}
              <div className={`pt-0.5 ${future ? 'opacity-40' : ''}`}>
                <p className={`font-body font-bold text-xs tracking-[0.12em] uppercase ${
                  current ? 'text-[#C0231E]' : done ? 'text-[#F4F4F4]' : 'text-[#525252]'
                }`}>
                  {step.label}
                  {current && <span className="ml-2 text-[9px] border border-[#C0231E]/50 px-1.5 py-0.5 text-[#C0231E]">NOW</span>}
                </p>
                {(done || current) && (
                  <p className="font-body text-[#525252] text-[11px] mt-1 leading-relaxed">{step.desc}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function OrderTracker() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId]   = useState(searchParams.get('id') ?? '')
  const [order, setOrder]       = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  // Auto-search if ID was passed in URL
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) handleSearchById(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearchById = async (id) => {
    const clean = id.trim().toUpperCase()
    if (!clean) return
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const res = await fetch(`${API}/api/orders/status/${clean}`)
      const data = await res.json()
      if (!res.ok) setError(data.message ?? 'Order not found.')
      else setOrder(data)
    } catch {
      setError("Could not connect to server. Make sure you're online and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    handleSearchById(orderId)
  }

  const waLink = order
    ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi Wearvana! I have a question about order ${order.orderId} — ${order.productName} in size ${order.size}.`)}`
    : `https://wa.me/${WA_NUMBER}`

  return (
    <div className="max-w-lg mx-auto">

      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          placeholder="Enter order ID — e.g. WV-001"
          className="flex-1 bg-[#1C1C1C] border border-[#242424] text-[#F4F4F4] font-body text-sm px-4 py-3 placeholder-[#525252] focus:outline-none focus:border-[#C0231E] transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !orderId.trim()}
          className="bg-[#C0231E] hover:bg-[#D4251F] disabled:bg-[#1C1C1C] disabled:text-[#525252] text-white px-5 py-3 transition-colors"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Search size={16} />
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="border border-[#C0231E]/30 bg-[#C0231E]/10 p-4 mb-6">
          <p className="font-body text-[#C0231E] text-sm">{error}</p>
          <p className="font-body text-[#525252] text-xs mt-1">
            Order IDs are in the format WV-001. Check your WhatsApp confirmation message.
          </p>
        </div>
      )}

      {/* Order card */}
      {order && (
        <div className="border border-[#242424] bg-[#111111] p-6">

          {/* Header */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="font-body text-[10px] text-[#525252] tracking-[0.2em] uppercase mb-1">{order.productBrand}</p>
              <h2 className="font-heading font-black text-[#F4F4F4] text-2xl uppercase leading-none">{order.productName}</h2>
              <p className="font-body text-[#909090] text-sm mt-1">{order.colorway} · Size {order.size}</p>
            </div>
            <span className="font-body text-[10px] text-[#525252] tracking-widest bg-[#1C1C1C] px-3 py-1.5 shrink-0 ml-4">
              {order.orderId}
            </span>
          </div>

          {/* Advance badge */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#242424]">
            <div className={`w-2 h-2 rounded-full ${order.advancePaid ? 'bg-[#34D399]' : 'bg-[#525252]'}`} />
            <p className="font-body text-xs text-[#909090] tracking-wide uppercase">
              Advance payment: {order.advancePaid ? <span className="text-[#34D399]">Received</span> : <span className="text-[#909090]">Pending</span>}
            </p>
          </div>

          {/* Timeline */}
          <StatusTimeline status={order.status} />

          {/* WhatsApp CTA */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex items-center justify-center gap-2 w-full border border-[#242424] hover:border-[#C0231E]/50 text-[#909090] hover:text-[#F4F4F4] font-body font-semibold text-xs tracking-[0.15em] uppercase py-3.5 transition-all duration-200"
          >
            <MessageCircle size={14} />
            Questions? Message Us
          </a>
        </div>
      )}

      {/* Help text */}
      {!order && !error && (
        <p className="font-body text-[#525252] text-xs text-center leading-relaxed">
          Your order ID was sent via WhatsApp when you placed your pre-order.
          <br />It looks like <span className="text-[#909090]">WV-001</span>.
        </p>
      )}
    </div>
  )
}
