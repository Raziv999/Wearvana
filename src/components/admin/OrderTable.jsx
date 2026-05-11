'use client'

import { useState } from 'react'
import { MessageCircle, Copy, Check } from 'lucide-react'

const WA_BUSINESS = '9779705477470'
const ESEWA_ID    = '9779705477470'
const KHALTI_ID   = '9779705477470'

const STATUS_STYLES = {
  pending:   'bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/30',
  confirmed: 'bg-[#34D399]/15 text-[#34D399] border-[#34D399]/30',
  sourcing:  'bg-[#60A5FA]/15 text-[#60A5FA] border-[#60A5FA]/30',
  arrived:   'bg-[#A78BFA]/15 text-[#A78BFA] border-[#A78BFA]/30',
  delivered: 'bg-[#34D399]/20 text-[#34D399] border-[#34D399]/40',
  cancelled: 'bg-[#C0231E]/15 text-[#C0231E] border-[#C0231E]/30',
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'sourcing', 'arrived', 'delivered', 'cancelled']

function buildConfirmationMessage(order) {
  const remaining = order.totalPrice - order.advanceAmount
  return `Hi ${order.customerName}! 🔥

Your Wearvana pre-order is confirmed.

━━━━━━━━━━━━━━
ORDER: ${order.orderId}
━━━━━━━━━━━━━━
👟 ${order.productBrand} ${order.productName}
🎨 ${order.colorway || ''}
📏 Size: ${order.size}

💰 Total: NPR ${order.totalPrice.toLocaleString()}
✅ Advance (50%): NPR ${order.advanceAmount.toLocaleString()}
🔜 On Delivery: NPR ${remaining.toLocaleString()}
━━━━━━━━━━━━━━
${order.advancePaid
  ? '✅ Advance payment received. Thank you!'
  : `Please send NPR ${order.advanceAmount.toLocaleString()} to confirm your order:

📱 eSewa:  ${ESEWA_ID}
📱 Khalti: ${KHALTI_ID}

Send us your payment screenshot to lock in your order.`}
━━━━━━━━━━━━━━
Expected delivery: 2–3 weeks after payment.

Thank you for ordering with Wearvana 🙏
Instagram: @wearvana.kicks`
}

function ConfirmationButton({ order }) {
  const [copied, setCopied] = useState(false)

  const message   = buildConfirmationMessage(order)
  const waLink    = `https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="flex items-center gap-1.5">
      {/* Open WhatsApp with customer */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        title="Send confirmation on WhatsApp"
        className="flex items-center gap-1 font-body text-[9px] font-bold tracking-widest uppercase px-2.5 py-1.5 bg-[#C0231E]/15 border border-[#C0231E]/30 text-[#C0231E] hover:bg-[#C0231E] hover:text-white transition-all"
      >
        <MessageCircle size={11} />
        Send
      </a>

      {/* Copy message text */}
      <button
        onClick={copyMessage}
        title="Copy message to clipboard"
        className="flex items-center gap-1 font-body text-[9px] font-bold tracking-widest uppercase px-2.5 py-1.5 border border-[#242424] text-[#525252] hover:border-[#525252] hover:text-[#F4F4F4] transition-all"
      >
        {copied ? <Check size={11} className="text-[#34D399]" /> : <Copy size={11} />}
      </button>
    </div>
  )
}

export default function OrderTable({ orders, loading, onStatusChange, onPaymentToggle }) {
  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="font-body text-[#525252] text-sm tracking-wide">Loading orders...</p>
      </div>
    )
  }

  if (!orders.length) {
    return (
      <div className="border border-[#242424] bg-[#111111] p-12 text-center">
        <p className="font-product text-[#525252] text-sm">No orders yet.</p>
        <p className="font-body text-[#525252] text-xs mt-1">Orders you add will appear here.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#242424]">
            {['Order ID', 'Customer', 'Product', 'Size', 'Total / Advance', 'Advance Paid', 'Status', 'Confirm', 'Date'].map((h) => (
              <th
                key={h}
                className="text-left font-body text-[9px] text-[#525252] tracking-[0.18em] uppercase py-3 pr-4 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b border-[#1C1C1C] hover:bg-[#111111] transition-colors">

              <td className="py-4 pr-4">
                <span className="font-product font-bold text-[#C0231E] text-sm">{order.orderId}</span>
              </td>

              <td className="py-4 pr-4">
                <p className="font-product font-semibold text-[#F4F4F4] text-sm whitespace-nowrap">{order.customerName}</p>
                <p className="font-body text-[#525252] text-xs mt-0.5">{order.customerPhone}</p>
              </td>

              <td className="py-4 pr-4 max-w-[180px]">
                <p className="font-body text-[9px] text-[#525252] tracking-widest uppercase mb-0.5">{order.productBrand}</p>
                <p className="font-product font-semibold text-[#F4F4F4] text-sm leading-snug">{order.productName}</p>
                {order.colorway && <p className="font-body text-[#525252] text-[10px] mt-0.5">{order.colorway}</p>}
              </td>

              <td className="py-4 pr-4">
                <span className="font-product font-bold text-[#F4F4F4] text-sm">{order.size}</span>
              </td>

              <td className="py-4 pr-4 whitespace-nowrap">
                <p className="font-product text-[#F4F4F4] text-sm">NPR {order.totalPrice.toLocaleString()}</p>
                <p className="font-body text-[#C0231E] text-xs mt-0.5">NPR {order.advanceAmount.toLocaleString()}</p>
              </td>

              <td className="py-4 pr-4">
                <button
                  onClick={() => onPaymentToggle(order._id, order.advancePaid)}
                  className={`font-body text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 border transition-all ${
                    order.advancePaid
                      ? 'bg-[#34D399]/15 text-[#34D399] border-[#34D399]/30'
                      : 'bg-transparent text-[#525252] border-[#242424] hover:border-[#525252]'
                  }`}
                >
                  {order.advancePaid ? 'PAID' : 'UNPAID'}
                </button>
              </td>

              <td className="py-4 pr-4">
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order._id, e.target.value)}
                  className={`font-body text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 border bg-transparent cursor-pointer outline-none transition-all ${STATUS_STYLES[order.status]}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-[#111111] text-[#F4F4F4] normal-case tracking-normal text-sm">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </td>

              <td className="py-4 pr-4">
                <ConfirmationButton order={order} />
              </td>

              <td className="py-4 whitespace-nowrap">
                <p className="font-body text-[#525252] text-xs">
                  {new Date(order.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
