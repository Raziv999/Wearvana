'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL

export default function NewOrderForm({ onClose, onCreated }) {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({
    productId: '',
    customerName: '',
    customerPhone: '',
    size: '',
    paymentMethod: '',
    paymentReference: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API}/api/products?available=true`)
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {})
  }, [])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const selectedProduct = products.find((p) => p._id === form.productId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message ?? 'Failed to create order')
      }
      onCreated()
    } catch (err) {
      setError(err.message)
    }
    setSubmitting(false)
  }

  const inputClass =
    'w-full bg-[#0A0A0A] border border-[#242424] text-[#F4F4F4] font-body text-sm px-4 py-3 outline-none focus:border-[#C0231E] transition-colors placeholder:text-[#525252]'
  const labelClass =
    'font-body text-[9px] text-[#525252] tracking-[0.18em] uppercase mb-1.5 block'

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-[#242424] w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#242424]">
          <p className="font-product font-bold text-[#F4F4F4] text-base">New Pre-Order</p>
          <button onClick={onClose} className="text-[#525252] hover:text-[#F4F4F4] transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">

          {/* Product */}
          <div>
            <label className={labelClass}>Product *</label>
            <select
              required
              value={form.productId}
              onChange={set('productId')}
              className={inputClass}
            >
              <option value="" className="bg-[#111111]">Select a product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id} className="bg-[#111111]">
                  {p.brand} — {p.name} ({p.colorway}) · NPR {p.price.toLocaleString()}
                </option>
              ))}
            </select>
            {selectedProduct && (
              <p className="font-body text-[#C0231E] text-[10px] mt-1.5">
                Advance: NPR {Math.ceil(selectedProduct.price / 2).toLocaleString()}
              </p>
            )}
          </div>

          {/* Size */}
          <div>
            <label className={labelClass}>Size *</label>
            <input
              required
              type="text"
              placeholder='e.g. US 10, US 10.5, One Size'
              value={form.size}
              onChange={set('size')}
              className={inputClass}
            />
          </div>

          {/* Customer name */}
          <div>
            <label className={labelClass}>Customer Name *</label>
            <input
              required
              type="text"
              placeholder="Full name"
              value={form.customerName}
              onChange={set('customerName')}
              className={inputClass}
            />
          </div>

          {/* Customer phone */}
          <div>
            <label className={labelClass}>WhatsApp Number *</label>
            <input
              required
              type="text"
              placeholder="e.g. 9841000000"
              value={form.customerPhone}
              onChange={set('customerPhone')}
              className={inputClass}
            />
          </div>

          {/* Payment method */}
          <div>
            <label className={labelClass}>Payment Method</label>
            <select value={form.paymentMethod} onChange={set('paymentMethod')} className={inputClass}>
              <option value="" className="bg-[#111111]">Not paid yet</option>
              <option value="esewa" className="bg-[#111111]">eSewa</option>
              <option value="khalti" className="bg-[#111111]">Khalti</option>
              <option value="bank" className="bg-[#111111]">Bank Transfer</option>
              <option value="cash" className="bg-[#111111]">Cash</option>
            </select>
          </div>

          {/* Payment reference */}
          {form.paymentMethod && form.paymentMethod !== 'cash' && (
            <div>
              <label className={labelClass}>Payment Reference / Transaction ID</label>
              <input
                type="text"
                placeholder="Transaction ID or screenshot ref"
                value={form.paymentReference}
                onChange={set('paymentReference')}
                className={inputClass}
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              rows={3}
              placeholder="Delivery address, special requests, etc."
              value={form.notes}
              onChange={set('notes')}
              className={`${inputClass} resize-none`}
            />
          </div>

          {error && (
            <p className="font-body text-[#C0231E] text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-[#C0231E] hover:bg-[#D4251F] disabled:opacity-50 text-white font-body font-bold text-xs tracking-widest uppercase py-3.5 transition-colors"
          >
            {submitting ? 'Creating...' : 'Create Pre-Order'}
          </button>
        </form>
      </div>
    </div>
  )
}
