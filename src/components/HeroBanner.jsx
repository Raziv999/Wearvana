import { ArrowRight, Zap } from 'lucide-react'

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] min-h-[90vh] flex items-center">

      {/* Deep red radial glow — anchored at bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 105%, rgba(192, 35, 30, 0.22) 0%, transparent 65%)',
        }}
      />

      {/* Subtle grid overlay — keeps it architectural */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #F4F4F4 1px, transparent 1px), linear-gradient(to bottom, #F4F4F4 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center w-full">

        {/* Live drop badge */}
        <div className="inline-flex items-center gap-2.5 border border-[#C0231E]/35 bg-[#C0231E]/10 text-[#C0231E] text-[10px] font-body font-bold px-4 py-2 tracking-[0.2em] uppercase mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C0231E] animate-[pulse-dot_1.8s_ease-in-out_infinite]" />
          Drop 001 — Live Now
        </div>

        {/* Hero headline */}
        <h1
          className="font-heading font-black text-[#F4F4F4] uppercase leading-[0.88] tracking-tight mb-6"
          style={{ fontSize: 'clamp(3.5rem, 12vw, 9.5rem)' }}
        >
          Wear What
          <br />
          <span className="text-[#C0231E]">Can't Be Bought.</span>
        </h1>

        {/* Sub-headline — Nepal SEO keywords embedded naturally */}
        <p className="font-product text-[#909090] text-base md:text-lg max-w-md mx-auto mb-10 leading-relaxed">
          Authentic Premium Sneakers & New Era Caps — Pre-Order in Nepal.
          <br className="hidden sm:block" />
          50% advance via eSewa or Khalti. Zero fakes.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#drops"
            className="group flex items-center gap-3 bg-[#C0231E] hover:bg-[#D4251F] text-white font-body font-bold text-xs tracking-[0.18em] uppercase px-8 py-4 transition-all duration-200 w-full sm:w-auto justify-center"
          >
            Explore the Drop
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
          </a>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 border border-[#242424] hover:border-[#C0231E]/50 text-[#909090] hover:text-[#F4F4F4] font-body font-medium text-xs tracking-[0.18em] uppercase px-8 py-4 transition-all duration-200 w-full sm:w-auto justify-center"
          >
            <Zap size={13} />
            How It Works
          </a>
        </div>

        {/* Stats strip */}
        <div className="flex items-center justify-center gap-10 md:gap-20 mt-20 pt-8 border-t border-[#1C1C1C]">
          {[
            { value: '100%', label: 'Authentic' },
            { value: '50%', label: 'Advance Only' },
            { value: '0', label: 'Hidden Fees' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="font-heading font-black text-[#C0231E] leading-none uppercase"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}
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
