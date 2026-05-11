'use client'

import { X } from 'lucide-react'

const SNEAKER_SIZES = [
  { us: '6',    eu: '38.5', uk: '5.5',  cm: '24.0' },
  { us: '6.5',  eu: '39',   uk: '6',    cm: '24.5' },
  { us: '7',    eu: '40',   uk: '6.5',  cm: '25.0' },
  { us: '7.5',  eu: '40.5', uk: '7',    cm: '25.5' },
  { us: '8',    eu: '41',   uk: '7.5',  cm: '26.0' },
  { us: '8.5',  eu: '42',   uk: '8',    cm: '26.5' },
  { us: '9',    eu: '42.5', uk: '8.5',  cm: '27.0' },
  { us: '9.5',  eu: '43',   uk: '9',    cm: '27.5' },
  { us: '10',   eu: '44',   uk: '9.5',  cm: '28.0' },
  { us: '10.5', eu: '44.5', uk: '10',   cm: '28.5' },
  { us: '11',   eu: '45',   uk: '10.5', cm: '29.0' },
  { us: '11.5', eu: '45.5', uk: '11',   cm: '29.5' },
  { us: '12',   eu: '46',   uk: '11.5', cm: '30.0' },
  { us: '13',   eu: '47.5', uk: '12.5', cm: '31.0' },
]

const CAP_SIZES = [
  { size: 'S/M',      circumference: '54 – 56 cm', fits: 'Most women, smaller heads' },
  { size: 'L/XL',     circumference: '57 – 59 cm', fits: 'Most men, average heads' },
  { size: 'One Size', circumference: 'Adjustable',  fits: 'Snapback — fits all' },
]

export default function SizeGuideModal({ category, onClose }) {
  const isCaps = category === 'caps'

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#111111] border border-[#242424] w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#242424] sticky top-0 bg-[#111111]">
          <div>
            <p className="font-body text-[#C0231E] text-[9px] tracking-[0.2em] uppercase mb-0.5">
              Wearvana
            </p>
            <p className="font-product font-bold text-[#F4F4F4] text-base">
              {isCaps ? 'Cap Size Guide' : 'Sneaker Size Guide'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#525252] hover:text-[#F4F4F4] transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          {isCaps ? (
            <>
              {/* How to measure */}
              <div className="bg-[#0A0A0A] border border-[#242424] p-4 mb-5">
                <p className="font-product font-semibold text-[#F4F4F4] text-sm mb-1">
                  How to measure
                </p>
                <p className="font-body text-[#909090] text-xs leading-relaxed">
                  Wrap a flexible tape measure around your head, about 1cm above your ears and eyebrows. That's your circumference.
                </p>
              </div>

              {/* Cap table */}
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#242424]">
                    {['Size', 'Circumference', 'Best For'].map((h) => (
                      <th key={h} className="text-left font-body text-[9px] text-[#525252] tracking-[0.15em] uppercase py-2 pr-4">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CAP_SIZES.map((row) => (
                    <tr key={row.size} className="border-b border-[#1C1C1C]">
                      <td className="py-3 pr-4 font-product font-bold text-[#C0231E] text-sm">{row.size}</td>
                      <td className="py-3 pr-4 font-body text-[#F4F4F4] text-sm">{row.circumference}</td>
                      <td className="py-3 font-body text-[#909090] text-xs">{row.fits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <>
              {/* How to measure */}
              <div className="bg-[#0A0A0A] border border-[#242424] p-4 mb-5">
                <p className="font-product font-semibold text-[#F4F4F4] text-sm mb-1">
                  How to measure your foot
                </p>
                <p className="font-body text-[#909090] text-xs leading-relaxed">
                  Stand on a flat surface, trace your foot on paper, and measure from heel to longest toe in cm. Match to the chart below.
                </p>
              </div>

              {/* Sneaker table */}
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#242424]">
                    {['US', 'EU', 'UK', 'CM'].map((h) => (
                      <th key={h} className="text-left font-body text-[9px] text-[#525252] tracking-[0.15em] uppercase py-2 pr-4">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SNEAKER_SIZES.map((row) => (
                    <tr key={row.us} className="border-b border-[#1C1C1C] hover:bg-[#0A0A0A] transition-colors">
                      <td className="py-2.5 pr-4 font-product font-bold text-[#C0231E] text-sm">US {row.us}</td>
                      <td className="py-2.5 pr-4 font-body text-[#F4F4F4] text-sm">{row.eu}</td>
                      <td className="py-2.5 pr-4 font-body text-[#F4F4F4] text-sm">{row.uk}</td>
                      <td className="py-2.5 font-body text-[#909090] text-sm">{row.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Tip */}
          <div className="mt-5 pt-5 border-t border-[#242424]">
            <p className="font-body text-[#525252] text-xs leading-relaxed">
              <span className="text-[#C0231E] font-semibold">Not sure?</span> Message us on WhatsApp — we'll help you pick the right size before you commit to the pre-order.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
