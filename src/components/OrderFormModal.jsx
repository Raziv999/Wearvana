'use client'

import { useState } from 'react'
import { X, MessageCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { trackEvent } from './GoogleAnalytics'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'
const WA_NUMBER = '9779705477470'

const PAYMENT_METHODS = ['eSewa', 'Khalti']

export default function OrderFormModal({ product, selectedSize, onClose }) {
  const [step, setStep]         = useState(1) // 1 = form, 2 = success
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [orderId, setOrderId]   = useState('')

  const [form, setForm] = useState({
    customerName:     '',
    customerPhone:    '',
    paymentMethod:    'eSewa',
    paymentReference: '',
  })

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const advanceAmount = Math.ceil(product.price / 2)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.customerName.trim())  return setError('Please enter your name.')
    if (!form.customerPhone.trim()) return setError('Please enter your phone number.')
    if (form.customerPhone.trim().length < 10) return setError('Enter a valid phone number.')

    setLoading(true)
    try {
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId:        product._id,
          customerName:     form.customerName.trim(),
          customerPhone:    form.customerPhone.trim(),
          size:             selectedSize,
          paymentMethod:    form.paymentMethod,
          paymentReference: form.paymentReference.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message ?? 'Something went wrong. Try again.')
      } else {
        setOrderId(data.orderId)
        setStep(2)
        trackEvent('purchase', {
          transaction_id: data.orderId,
          item_id:        product.slug,
          item_name:      product.name,
          item_brand:     product.brand,
          size:           selectedSize,
          value:          advanceAmount,
          currency:       'NPR',
        })
      }
    } catch {
      setError('Could not connect to server. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const waFollowUp = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hi Wearvana! I just placed order ${orderId} for the ${product.name} (${product.colorway}) in size ${selectedSize}. Wanted to confirm everything is set!`
  )}`

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-[#111111] border border-[#242424] overflow-y-auto max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#242424]">
          <div>
            <p className="font-body text-[9px] text-[#525252] tracking-[0.2em] uppercase">Pre-Order</p>
            <p className="font-heading font-black text-[#F4F4F4] text-lg uppercase leading-tight">{product.name}</p>
            <p className="font-body text-[#909090] text-xs">{product.colorway} · Size {selectedSize}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#525252] hover:text-[#F4F4F4] transition-colors ml-4 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Price summary */}
            <div className="bg-[#1C1C1C] border border-[#242424] p-4 flex items-center justify-between">
              <div>
                <p className="font-body text-[9px] text-[#525252] tracking-[0.15em] uppercase">Total Price</p>
                <p className="font-product font-bold text-[#F4F4F4] text-lg">NPR {product.price.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-body text-[9px] text-[#C0231E] tracking-[0.15em] uppercase">Pay Now (50%)</p>
                <p className="font-product font-bold text-[#C0231E] text-lg">NPR {advanceAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="font-body text-[10px] text-[#525252] tracking-[0.15em] uppercase block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={form.customerName}
                onChange={set('customerName')}
                placeholder="Aarav Sharma"
                className="w-full bg-[#1C1C1C] border border-[#242424] text-[#F4F4F4] font-body text-sm px-4 py-3 placeholder-[#525252] focus:outline-none focus:border-[#C0231E] transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="font-body text-[10px] text-[#525252] tracking-[0.15em] uppercase block mb-1.5">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={form.customerPhone}
                onChange={set('customerPhone')}
                placeholder="98XXXXXXXX"
                className="w-full bg-[#1C1C1C] border border-[#242424] text-[#F4F4F4] font-body text-sm px-4 py-3 placeholder-[#525252] focus:outline-none focus:border-[#C0231E] transition-colors"
              />
            </div>

            {/* Payment method */}
            <div>
              <label className="font-body text-[10px] text-[#525252] tracking-[0.15em] uppercase block mb-1.5">
                Payment Method (50% Advance)
              </label>
              <div className="flex gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, paymentMethod: method }))}
                    className={`flex-1 py-2.5 font-body font-semibold text-xs tracking-wide border transition-all ${
                      form.paymentMethod === method
                        ? 'bg-[#C0231E] border-[#C0231E] text-white'
                        : 'bg-transparent border-[#242424] text-[#909090] hover:border-[#C0231E]/50'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment reference */}
            <div>
              <label className="font-body text-[10px] text-[#525252] tracking-[0.15em] uppercase block mb-1.5">
                Payment Reference / Transaction ID
                <span className="normal-case ml-1 opacity-60">(optional — add after paying)</span>
              </label>
              <input
                type="text"
                value={form.paymentReference}
                onChange={set('paymentReference')}
                placeholder="e.g. TXN123456"
                className="w-full bg-[#1C1C1C] border border-[#242424] text-[#F4F4F4] font-body text-sm px-4 py-3 placeholder-[#525252] focus:outline-none focus:border-[#C0231E] transition-colors"
              />
            </div>

            {error && (
              <p className="font-body text-[#C0231E] text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#C0231E] hover:bg-[#D4251F] disabled:bg-[#1C1C1C] disabled:text-[#525252] text-white font-body font-bold text-xs tracking-[0.18em] uppercase py-4 transition-all duration-200 mt-2"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : 'Confirm Pre-Order'}
            </button>

            <p className="font-body text-[#525252] text-[10px] text-center leading-relaxed">
              We'll confirm your order via WhatsApp within a few hours.
              <br />Your slot is reserved once advance is received.
            </p>
          </form>
        ) : (
          /* Success state */
          <div className="p-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-[#34D399]/10 border border-[#34D399]/30 mx-auto mb-5">
              <CheckCircle2 size={28} className="text-[#34D399]" />
            </div>
            <h2 className="font-heading font-black text-[#F4F4F4] text-2xl uppercase mb-2">
              Order Placed!
            </h2>
            <p className="font-body text-[#909090] text-sm mb-1">Your order ID is</p>
            <p className="font-product font-bold text-[#C0231E] text-3xl mb-6">{orderId}</p>

            <div className="bg-[#1C1C1C] border border-[#242424] p-4 text-left mb-6 space-y-2">
              <p className="font-body text-[10px] text-[#525252] tracking-[0.15em] uppercase mb-3">Next Steps</p>
              {[
                `Send NPR ${advanceAmount.toLocaleString()} via ${form.paymentMethod}`,
                'WhatsApp us the payment screenshot',
                'We confirm & start sourcing your item',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="font-body text-[#C0231E] font-bold text-xs shrink-0 mt-0.5">{i + 1}.</span>
                  <p className="font-body text-[#909090] text-xs">{step}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <a
                href={waFollowUp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#C0231E] hover:bg-[#D4251F] text-white font-body font-bold text-xs tracking-[0.18em] uppercase py-4 transition-all"
              >
                <MessageCircle size={15} />
                Message Us on WhatsApp
              </a>
              <a
                href={`/track?id=${orderId}`}
                className="flex items-center justify-center w-full border border-[#242424] hover:border-[#C0231E]/40 text-[#525252] hover:text-[#F4F4F4] font-body text-xs tracking-[0.15em] uppercase py-3.5 transition-all"
              >
                Track Your Order
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
