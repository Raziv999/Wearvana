'use client'

import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

// Safe GA event tracker — call this anywhere to track custom events
export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || !window.gtag || !GA_ID) return
  window.gtag('event', eventName, params)
}

export default function GoogleAnalytics() {
  if (!GA_ID || GA_ID === 'G-XXXXXXXXXX') return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            send_page_view: true,
          });
        `}
      </Script>
    </>
  )
}
