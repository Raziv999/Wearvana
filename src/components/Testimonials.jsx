import { Star, MessageCircle } from 'lucide-react'

const WA_NUMBER = '9779705477470'

export default function Testimonials() {
  return (
    <section className="bg-[#0A0A0A] py-16 md:py-24 border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-body text-[#C0231E] text-[10px] tracking-[0.22em] uppercase mb-2">
            Real Customers
          </p>
          <h2
            className="font-heading font-black text-[#F4F4F4] uppercase leading-none"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            They Copped.
            <br />
            <span className="text-[#C0231E]">You're Next.</span>
          </h2>
        </div>

        {/* Empty state — replace with real reviews when you have them */}
        <div className="border border-dashed border-[#242424] p-12 flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="text-[#242424]" />
            ))}
          </div>
          <p className="font-body text-[#525252] text-sm max-w-sm leading-relaxed">
            Be the first to review Wearvana. Order your kicks, then share your experience on WhatsApp or Instagram.
          </p>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Wearvana! I want to share a review about my recent order.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-[#242424] hover:border-[#C0231E]/50 text-[#525252] hover:text-[#F4F4F4] font-body font-bold text-[10px] tracking-[0.18em] uppercase px-5 py-3 transition-all mt-2"
          >
            <MessageCircle size={13} />
            Share Your Experience
          </a>
        </div>

        {/* Trust numbers */}
        <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-[#1C1C1C]">
          {[
            { value: '100%', label: 'Authentic Products' },
            { value: '50%',  label: 'Advance Only' },
            { value: '0',    label: 'Fake Products Sold' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="font-heading font-black text-[#C0231E] leading-none uppercase"
                style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)' }}
              >
                {stat.value}
              </p>
              <p className="font-body text-[#525252] text-[10px] tracking-[0.18em] uppercase mt-1.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
