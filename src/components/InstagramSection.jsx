'use client'

import Script from 'next/script'
import { Instagram, ArrowRight } from 'lucide-react'

const INSTAGRAM_URL = 'https://www.instagram.com/wearvana.kicks'
const BEHOLD_FEED_ID = '5ccpzdQD4A20h1qCJ0QY'

export default function InstagramSection() {
  return (
    <section className="bg-[#0A0A0A] py-16 md:py-24 border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-body text-[#C0231E] text-[10px] tracking-[0.22em] uppercase mb-2">
              Instagram
            </p>
            <h2
              className="font-heading font-black text-[#F4F4F4] uppercase leading-none"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
            >
              Follow the Drop
            </h2>
            <p className="font-body text-[#525252] text-sm mt-2">
              @wearvana.kicks — New drops, restocks & behind-the-scenes
            </p>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 border border-[#242424] hover:border-[#C0231E]/50 text-[#525252] hover:text-[#F4F4F4] font-body font-bold text-[10px] tracking-[0.18em] uppercase px-5 py-3 transition-all duration-200 self-start sm:self-auto"
          >
            <Instagram size={13} />
            Follow Us
            <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Behold Instagram feed widget */}
        <behold-widget feed-id={BEHOLD_FEED_ID} />

        {/* Bottom CTA */}
        <div className="flex items-center justify-center mt-6">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-body text-[#525252] hover:text-[#C0231E] text-xs tracking-[0.15em] uppercase transition-colors duration-200"
          >
            <Instagram size={13} />
            View all posts on @wearvana.kicks
          </a>
        </div>
      </div>

      {/* Behold script — loaded once, after page is interactive */}
      <Script
        id="behold-widget"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (() => {
              const d=document,s=d.createElement("script");
              s.type="module";
              s.src="https://w.behold.so/widget.js";
              d.head.append(s);
            })();
          `,
        }}
      />
    </section>
  )
}
