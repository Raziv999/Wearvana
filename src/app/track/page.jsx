import { Suspense } from 'react'
import OrderTracker from '@/components/OrderTracker'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Track Your Order',
  description: 'Check the status of your Wearvana pre-order. Enter your order ID to see live updates.',
}

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F4F4F4]">

      {/* Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <a
          href="/"
          className="inline-flex items-center gap-2 font-body text-[#525252] hover:text-[#F4F4F4] text-xs tracking-widest uppercase transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Home
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-body text-[10px] text-[#525252] tracking-[0.25em] uppercase mb-4">Wearvana</p>
          <h1
            className="font-heading font-black text-[#F4F4F4] uppercase leading-none mb-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            Track Your
            <br />
            <span className="text-[#C0231E]">Pre-Order</span>
          </h1>
          <p className="font-body text-[#525252] text-sm max-w-sm mx-auto">
            Enter the order ID from your WhatsApp confirmation to see live status updates.
          </p>
        </div>

        <Suspense fallback={<div className="h-32 bg-[#1C1C1C] animate-pulse rounded" />}>
          <OrderTracker />
        </Suspense>
      </div>
    </div>
  )
}
