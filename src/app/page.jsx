import { Suspense } from 'react'
import Header from '@/components/Header'
import HeroBanner from '@/components/HeroBanner'
import CountdownTimer from '@/components/CountdownTimer'
import ProductGrid from '@/components/ProductGrid'
import Testimonials from '@/components/Testimonials'
import InstagramSection from '@/components/InstagramSection'
import CustomSource from '@/components/CustomSource'
import Footer from '@/components/Footer'
import { DROP_CONFIG } from '@/config/drop'
import { ProductGridSkeleton } from '@/components/ProductCardSkeleton'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header />
      <main>
        <HeroBanner />
        <CountdownTimer
          targetDate={DROP_CONFIG.targetDate}
          isLive={DROP_CONFIG.isLive}
        />
        <Suspense fallback={
          <section className="bg-[#0A0A0A] py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-20 md:mb-28">
                <div className="mb-6 pb-5 border-b border-[#242424]">
                  <div className="h-2 w-20 bg-[#242424] rounded-sm mb-3 animate-pulse" />
                  <div className="h-10 w-40 bg-[#1C1C1C] rounded-sm animate-pulse" />
                </div>
                <ProductGridSkeleton count={4} />
              </div>
              <div>
                <div className="mb-6 pb-5 border-b border-[#242424]">
                  <div className="h-2 w-32 bg-[#242424] rounded-sm mb-3 animate-pulse" />
                  <div className="h-10 w-24 bg-[#1C1C1C] rounded-sm animate-pulse" />
                </div>
                <ProductGridSkeleton count={4} />
              </div>
            </div>
          </section>
        }>
          <ProductGrid />
        </Suspense>
        <CustomSource />
        <Testimonials />
        <InstagramSection />
      </main>
      <Footer />
    </div>
  )
}
