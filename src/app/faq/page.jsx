'use client'

import { useState } from 'react'
import { ArrowLeft, Plus, Minus, MessageCircle } from 'lucide-react'

const WA_NUMBER = '9779705477470'

const FAQS = [
  {
    category: 'Ordering',
    questions: [
      {
        q: 'How does pre-ordering work?',
        a: 'You pick your product and size, fill in your details, and pay 50% advance via eSewa or Khalti. We then source your item from our verified suppliers. Once it arrives in Nepal, you pay the remaining 50% and we deliver to your door.',
      },
      {
        q: 'Why do I need to pay 50% in advance?',
        a: 'The advance payment reserves your slot and funds the sourcing. Because we operate on a pre-order model with zero inventory, the advance is what allows us to order your specific pair. Without it, we can\'t guarantee your slot.',
      },
      {
        q: 'Can I order without paying in advance?',
        a: 'No — the 50% advance is required to confirm any pre-order. This protects both sides: you get a reserved slot, and we have the budget to source your item.',
      },
      {
        q: 'How do I place an order?',
        a: 'Go to any product page, select your size, and click "Pre-Order". Fill in your name, WhatsApp number, choose eSewa or Khalti, and submit. We\'ll confirm via WhatsApp within a few hours. You can also order directly through WhatsApp chat.',
      },
    ],
  },
  {
    category: 'Authenticity',
    questions: [
      {
        q: 'Are your products 100% authentic?',
        a: 'Absolutely. Every product we sell is 100% authentic with original packaging, tags, and receipts. We source directly from verified suppliers and have a zero-tolerance policy for fakes. We\'ve never sold a counterfeit product.',
      },
      {
        q: 'How do you verify authenticity?',
        a: 'Every pair goes through an authenticity check before it leaves the supplier. We keep original purchase receipts on file. If you ever have doubts about a product you received, contact us immediately — we\'ll resolve it.',
      },
      {
        q: 'Can I see the original receipt?',
        a: 'Yes. We keep receipts on file for all sourced products. If you want to verify your specific order, message us on WhatsApp with your order ID.',
      },
    ],
  },
  {
    category: 'Payment & Pricing',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept eSewa and Khalti for the 50% advance payment. The remaining 50% can be paid via the same methods upon delivery.',
      },
      {
        q: 'Are there any hidden fees?',
        a: 'None. The price listed on the product page is the final price. No customs charges, no surprise fees, no markups added later. What you see is what you pay.',
      },
      {
        q: 'Can I get a refund if I change my mind?',
        a: 'Because we source items specifically for each order, cancellations after sourcing has begun are not possible. If there\'s an issue with your order on our end — wrong item, authenticity concern — we will refund you in full. Contact us on WhatsApp to discuss your specific situation.',
      },
    ],
  },
  {
    category: 'Delivery',
    questions: [
      {
        q: 'How long does delivery take?',
        a: 'Typically 2–4 weeks from order confirmation depending on the product and supplier availability. We\'ll update you via WhatsApp throughout the process — when we source it, when it arrives in Nepal, and when it ships to you.',
      },
      {
        q: 'Do you deliver outside Kathmandu?',
        a: 'Yes — we deliver anywhere in Nepal. Pokhara, Bharatpur, Biratnagar, Dharan, everywhere. Delivery charges may vary by location.',
      },
      {
        q: 'How do I track my order?',
        a: 'Go to wearvana.com/track and enter your order ID (e.g. WV-001). You\'ll see live status updates — Received, Confirmed, Sourcing, Arrived in Nepal, Delivered. Your order ID is sent to you via WhatsApp when your order is confirmed.',
      },
    ],
  },
  {
    category: 'Products',
    questions: [
      {
        q: 'What brands do you carry?',
        a: 'Currently: Nike, Air Jordan, Adidas, New Balance, and New Era. We\'re continuously adding more brands based on demand. Message us on WhatsApp if you\'re looking for a specific brand.',
      },
      {
        q: 'What if my size is not listed?',
        a: 'Message us on WhatsApp with the product name and your size. We\'ll check availability with our suppliers — sizes not listed on the site can often still be sourced.',
      },
      {
        q: 'Can you source a product not listed on your site?',
        a: 'Yes — use the "Custom Source" form on our homepage. Tell us the exact product and size and we\'ll check if we can source it for you.',
      },
      {
        q: 'What does "Limited" mean on a product?',
        a: '"Limited" means the product has a restricted number of pre-order slots available. Once those slots fill up, the product is marked as sold out. If you see it, don\'t sleep on it.',
      },
    ],
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#1C1C1C] last:border-b-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="font-body font-semibold text-[#F4F4F4] text-sm leading-snug">{q}</span>
        <span className="shrink-0 mt-0.5 text-[#525252]">
          {open ? <Minus size={15} /> : <Plus size={15} />}
        </span>
      </button>
      {open && (
        <p className="font-body text-[#909090] text-sm leading-relaxed pb-5 pr-8">{a}</p>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('Ordering')

  const current = FAQS.find(f => f.category === activeCategory)

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

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="mb-12">
          <p className="font-body text-[#C0231E] text-[10px] tracking-[0.25em] uppercase mb-3">
            Got Questions?
          </p>
          <h1
            className="font-heading font-black text-[#F4F4F4] uppercase leading-none"
            style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
          >
            Frequently Asked
            <br />
            <span className="text-[#C0231E]">Questions</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Category sidebar */}
          <div className="md:col-span-1">
            <p className="font-body text-[9px] text-[#525252] tracking-[0.2em] uppercase mb-3">Category</p>
            <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
              {FAQS.map(({ category }) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 text-left font-body font-semibold text-xs tracking-[0.12em] uppercase px-4 py-2.5 border transition-all ${
                    activeCategory === category
                      ? 'bg-[#C0231E] border-[#C0231E] text-white'
                      : 'bg-transparent border-[#242424] text-[#525252] hover:border-[#C0231E]/40 hover:text-[#F4F4F4]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div className="md:col-span-3 bg-[#111111] border border-[#242424] p-6 md:p-8">
            <p className="font-heading font-black text-[#F4F4F4] text-xl uppercase mb-6">
              {activeCategory}
            </p>
            {current?.questions.map(({ q, a }) => (
              <FAQItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>

        {/* Still have questions */}
        <div className="mt-12 border border-[#242424] bg-[#111111] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <p className="font-heading font-black text-[#F4F4F4] text-xl uppercase mb-1">
              Still have questions?
            </p>
            <p className="font-body text-[#525252] text-sm">
              Message us directly on WhatsApp — we usually respond within a few hours.
            </p>
          </div>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Wearvana! I have a question about ordering.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 bg-[#C0231E] hover:bg-[#D4251F] text-white font-body font-bold text-xs tracking-[0.18em] uppercase px-6 py-3.5 transition-colors"
          >
            <MessageCircle size={14} />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
