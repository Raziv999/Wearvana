import Image from 'next/image'
import { MessageCircle, Instagram, ArrowRight } from 'lucide-react'

const WA_NUMBER = '9779705477470'
const INSTAGRAM_URL = 'https://www.instagram.com/wearvana.kicks?igsh=aW56dmx5aWJiaDFt'

const STEPS = [
  {
    step: '01',
    title: 'Browse & Pick',
    desc: 'Find your heat. Scroll the drop and lock in on the sneakers or cap you want.',
  },
  {
    step: '02',
    title: 'Place Your Order',
    desc: 'Fill in your details on the product page or tap "Order via WhatsApp". Takes 2 minutes.',
  },
  {
    step: '03',
    title: 'Pay 50% Advance',
    desc: 'Lock your slot with 50% via eSewa or Khalti. We source, authenticate, and deliver.',
  },
]

const FOOTER_LINKS = {
  Shop: [
    { label: 'All Drops',     href: '/#drops' },
    { label: 'Sneakers',      href: '/#drops' },
    { label: 'Running',       href: '/#drops' },
    { label: 'Caps',          href: '/#drops' },
    { label: 'Air Jordans',   href: '/#drops' },
  ],
  Info: [
    { label: 'How It Works',  href: '/#how-it-works' },
    { label: 'Track Order',   href: '/track' },
    { label: 'About Us',      href: '/about' },
    { label: 'FAQ',           href: '/faq' },
  ],
  Connect: [
    { label: 'WhatsApp',      href: `https://wa.me/${WA_NUMBER}`, external: true },
    { label: 'Instagram',     href: INSTAGRAM_URL, external: true },
  ],
}

export default function Footer() {
  const waOrderLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    'Hi Wearvana! I want to pre-order from your latest drop.'
  )}`

  return (
    <>
      {/* ── How It Works ── */}
      <section id="how-it-works" className="bg-[#111111] border-t border-b border-[#242424] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-body text-[#C0231E] text-[10px] tracking-[0.22em] uppercase mb-2">
              Simple Process
            </p>
            <h2
              className="font-heading font-black text-[#F4F4F4] uppercase leading-none"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}
            >
              How to Pre-Order
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {STEPS.map((item) => (
              <div key={item.step} className="relative p-6 border border-[#242424] bg-[#0A0A0A] overflow-hidden">
                <p className="absolute top-3 right-4 font-heading font-black text-[#C0231E]/10 text-8xl leading-none select-none pointer-events-none">
                  {item.step}
                </p>
                <p className="font-body text-[#C0231E] text-[9px] tracking-[0.2em] uppercase mb-3">
                  Step {item.step}
                </p>
                <h3 className="font-product font-bold text-[#F4F4F4] text-base mb-2">{item.title}</h3>
                <p className="font-body text-[#525252] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA band ── */}
      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{ background: 'linear-gradient(160deg, #0A0A0A 0%, #1a0303 40%, #0A0A0A 100%)' }}
      >
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2
            className="font-heading font-black text-[#F4F4F4] uppercase leading-[0.9] mb-5"
            style={{ fontSize: 'clamp(2.8rem, 9vw, 7rem)' }}
          >
            Ready to Pre-Order?
          </h2>
          <p className="font-product text-[#909090] text-base mb-9 leading-relaxed">
            Hit us up on WhatsApp. We'll sort your size,
            <br className="hidden sm:block" />
            confirm the drop, and handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={waOrderLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#C0231E] hover:bg-[#D4251F] text-white font-body font-bold text-xs tracking-[0.2em] uppercase px-10 py-5 transition-colors duration-200"
            >
              <MessageCircle size={16} />
              Start Chat on WhatsApp
            </a>
            <a
              href="/faq"
              className="inline-flex items-center gap-2 border border-[#242424] hover:border-[#C0231E]/40 text-[#525252] hover:text-[#F4F4F4] font-body font-bold text-xs tracking-[0.2em] uppercase px-8 py-5 transition-colors duration-200"
            >
              Read FAQ
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Full footer ── */}
      <footer className="bg-[#0A0A0A] border-t border-[#1C1C1C]">

        {/* Main footer columns */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Image src="/logo.png" alt="Wearvana" width={140} height={42} className="h-8 w-auto mb-4" />
            <p className="font-body text-[#525252] text-xs leading-relaxed mb-5 max-w-[200px]">
              Nepal's premier pre-order platform for authentic sneakers and New Era caps.
              Zero fakes. Zero hidden fees.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#525252] hover:text-[#C0231E] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={17} />
              </a>
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#525252] hover:text-[#C0231E] transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={17} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="font-heading font-black text-[#F4F4F4] text-xs uppercase tracking-widest mb-4">
                {heading}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="font-body text-[#525252] hover:text-[#F4F4F4] text-xs tracking-wide transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1C1C1C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-body text-[#383838] text-xs tracking-wide text-center sm:text-left">
              © {new Date().getFullYear()} Wearvana · Nepal's Premier Streetwear Pre-Order Platform
            </p>
            <p className="font-body text-[#383838] text-xs tracking-wide">
              All products 100% authentic · eSewa & Khalti accepted
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
