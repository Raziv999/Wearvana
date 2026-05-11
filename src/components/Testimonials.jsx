import { Star } from 'lucide-react'

const REVIEWS = [
  {
    name: 'Aayush S.',
    location: 'Kathmandu',
    product: 'Adidas Samba OG',
    rating: 5,
    text: "Got my Sambas in under 3 weeks. Came with the original box and receipt. 100% legit — I was skeptical about pre-ordering but Wearvana made it easy.",
  },
  {
    name: 'Priya M.',
    location: 'Lalitpur',
    product: 'New Era Yankees 59FIFTY',
    rating: 5,
    text: "Ordered the Yankees cap and it arrived perfectly. The eSewa payment process was smooth and they kept me updated on WhatsApp the whole time.",
  },
  {
    name: 'Roshan T.',
    location: 'Pokhara',
    product: 'Air Jordan 1 Chicago',
    rating: 5,
    text: "These are the real deal. I've seen fakes and these are not it. Wearvana sourced them fast and delivery to Pokhara was no issue.",
  },
  {
    name: 'Nischal K.',
    location: 'Bhaktapur',
    product: 'Nike Air Force 1 LX',
    rating: 5,
    text: "First time buying from Wearvana. The chat support was super responsive and the shoes came exactly as described. Already placed my second order.",
  },
]

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

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="bg-[#111111] border border-[#242424] p-5 flex flex-col gap-4 hover:border-[#C0231E]/30 transition-colors duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} size={12} className="fill-[#C0231E] text-[#C0231E]" />
                ))}
              </div>

              {/* Review text */}
              <p className="font-body text-[#909090] text-sm leading-relaxed flex-1">
                "{r.text}"
              </p>

              {/* Product tag */}
              <span className="font-body text-[9px] tracking-[0.15em] uppercase text-[#525252] border border-[#1C1C1C] px-2 py-1 self-start">
                {r.product}
              </span>

              {/* Author */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#1C1C1C]">
                <div className="w-7 h-7 rounded-full bg-[#C0231E]/20 border border-[#C0231E]/30 flex items-center justify-center">
                  <span className="font-heading font-black text-[#C0231E] text-xs">
                    {r.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-body font-bold text-[#F4F4F4] text-xs">{r.name}</p>
                  <p className="font-body text-[#525252] text-[10px]">{r.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust numbers */}
        <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-[#1C1C1C]">
          {[
            { value: '100+', label: 'Orders Fulfilled' },
            { value: '4.9★', label: 'Average Rating' },
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
