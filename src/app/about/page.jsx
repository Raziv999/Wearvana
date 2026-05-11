import { ArrowLeft, MessageCircle, Instagram } from 'lucide-react'

export const metadata = {
  title: 'About Us',
  description: 'Wearvana is Nepal\'s premier pre-order platform for authentic Nike, Jordan, Adidas sneakers and New Era caps. Our story, our mission, zero fakes.',
}

const WA_NUMBER = '9779705477470'
const INSTAGRAM_URL = 'https://www.instagram.com/wearvana.kicks?igsh=aW56dmx5aWJiaDFt'

const VALUES = [
  {
    label: '100% Authentic',
    desc: 'Every product comes with original receipts and packaging. We\'ve never sold a fake and never will.',
  },
  {
    label: 'Pre-Order Only',
    desc: 'Zero inventory means zero sitting stock. We source exactly what you order — nothing more.',
  },
  {
    label: 'Full Transparency',
    desc: 'You see the price before you commit. No hidden fees, no last-minute charges. Ever.',
  },
  {
    label: 'Nepal-First',
    desc: 'We deliver anywhere in Nepal. Kathmandu, Pokhara, Bharatpur — if you\'re in Nepal, we can reach you.',
  },
]

export default function AboutPage() {
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

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(192,35,30,0.15) 0%, transparent 65%)' }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="font-body text-[#C0231E] text-[10px] tracking-[0.25em] uppercase mb-4">Our Story</p>
          <h1
            className="font-heading font-black text-[#F4F4F4] uppercase leading-[0.9] mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          >
            Built for
            <br />
            <span className="text-[#C0231E]">Sneakerheads</span>
            <br />
            in Nepal
          </h1>
          <p className="font-body text-[#909090] text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Wearvana started because we were tired of paying inflated prices for fakes,
            waiting months for unofficial imports, and having no way to verify authenticity.
            We knew Nepal deserved better.
          </p>
        </div>
      </section>

      {/* Story section */}
      <section className="border-t border-[#1C1C1C] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="font-body text-[#C0231E] text-[10px] tracking-[0.22em] uppercase mb-4">
                How We Started
              </p>
              <h2 className="font-heading font-black text-[#F4F4F4] text-3xl uppercase leading-tight mb-6">
                The Problem We Solved
              </h2>
              <div className="space-y-4 font-body text-[#909090] text-sm leading-relaxed">
                <p>
                  Getting authentic Nike, Jordan, or Adidas drops in Nepal used to mean one thing —
                  overpaying a grey-market reseller and hoping for the best. Fakes were rampant.
                  Prices were unpredictable. Returns were impossible.
                </p>
                <p>
                  We built Wearvana on a simple model: pre-order only, zero inventory, direct sourcing.
                  You tell us what you want. We find it, authenticate it, and deliver it. Simple.
                </p>
                <p>
                  The 50% advance model means we only source what's already sold. That keeps prices
                  fair and ensures every pair is ordered with intention — no sitting stock, no markups
                  to cover losses.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="font-body text-[#C0231E] text-[10px] tracking-[0.22em] uppercase mb-4">
                Our Process
              </p>
              {[
                { n: '01', t: 'You place an order',      d: 'Pick your product, your size, and lock it in with 50% advance via eSewa or Khalti.' },
                { n: '02', t: 'We source it',            d: 'We work with verified suppliers to source your exact pair — authentic, original packaging.' },
                { n: '03', t: 'Authentication check',    d: 'Every product is verified before it leaves the supplier. Receipts kept on file.' },
                { n: '04', t: 'Delivery to your door',   d: 'Delivered anywhere in Nepal. You pay the remaining 50% on arrival.' },
              ].map(({ n, t, d }) => (
                <div key={n} className="flex gap-4 p-4 border border-[#1C1C1C] bg-[#111111]">
                  <span className="font-heading font-black text-[#C0231E] text-xl shrink-0 w-8">{n}</span>
                  <div>
                    <p className="font-body font-bold text-[#F4F4F4] text-sm mb-1">{t}</p>
                    <p className="font-body text-[#525252] text-xs leading-relaxed">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-[#1C1C1C] py-16 md:py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-body text-[#C0231E] text-[10px] tracking-[0.22em] uppercase mb-2 text-center">
            What We Stand For
          </p>
          <h2
            className="font-heading font-black text-[#F4F4F4] uppercase leading-none text-center mb-12"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((v) => (
              <div key={v.label} className="border border-[#242424] bg-[#0A0A0A] p-6">
                <div className="w-8 h-1 bg-[#C0231E] mb-4" />
                <h3 className="font-heading font-black text-[#F4F4F4] text-lg uppercase mb-3">{v.label}</h3>
                <p className="font-body text-[#525252] text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#1C1C1C] py-16 md:py-20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2
            className="font-heading font-black text-[#F4F4F4] uppercase leading-none mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            Ready to Cop?
          </h2>
          <p className="font-body text-[#525252] text-sm mb-8">
            Browse the latest drop or hit us directly on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/#drops"
              className="flex items-center justify-center gap-2 bg-[#C0231E] hover:bg-[#D4251F] text-white font-body font-bold text-xs tracking-[0.18em] uppercase px-8 py-4 transition-colors"
            >
              Browse the Drop
            </a>
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#242424] hover:border-[#C0231E]/40 text-[#909090] hover:text-[#F4F4F4] font-body font-bold text-xs tracking-[0.18em] uppercase px-8 py-4 transition-all"
            >
              <MessageCircle size={14} />
              WhatsApp Us
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#242424] hover:border-[#C0231E]/40 text-[#909090] hover:text-[#F4F4F4] font-body font-bold text-xs tracking-[0.18em] uppercase px-8 py-4 transition-all"
            >
              <Instagram size={14} />
              Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
