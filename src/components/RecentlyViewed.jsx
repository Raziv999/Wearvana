'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { clImage } from '@/lib/cloudinary'

export default function RecentlyViewed({ currentProductId, product }) {
  const { items, mounted, trackView } = useRecentlyViewed()

  // Track this product on mount
  useEffect(() => {
    if (product) trackView(product)
  }, [product, trackView])

  // Filter out current product
  const others = items.filter(p => p._id !== currentProductId)

  if (!mounted || others.length === 0) return null

  return (
    <section className="border-t border-[#1C1C1C] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-body text-[#C0231E] text-[10px] tracking-[0.22em] uppercase mb-1">
              Your History
            </p>
            <h2 className="font-heading font-black text-[#F4F4F4] text-2xl uppercase">
              Recently Viewed
            </h2>
          </div>
          <Link
            href="/#drops"
            className="font-body text-[10px] text-[#525252] hover:text-[#F4F4F4] tracking-widest uppercase transition-colors"
          >
            Browse All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {others.map(p => (
            <Link
              key={p._id}
              href={`/product/${p.slug || p._id}`}
              className="group flex flex-col bg-[#111111] border border-[#242424] hover:border-[#C0231E]/40 transition-all duration-200 overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-square bg-[#1C1C1C] overflow-hidden">
                {p.image && p.image.startsWith('http') ? (
                  <Image
                    src={clImage(p.image, 400)}
                    alt={p.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300 p-2"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-heading font-black text-[#383838] text-3xl">
                      {p.brand?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="font-body text-[9px] text-[#525252] tracking-widest uppercase mb-0.5">
                  {p.brand}
                </p>
                <p className="font-product font-bold text-[#F4F4F4] text-xs leading-snug line-clamp-2 group-hover:text-[#C0231E] transition-colors">
                  {p.name}
                </p>
                <p className="font-product font-bold text-[#C0231E] text-sm mt-1.5">
                  NPR {p.price?.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
