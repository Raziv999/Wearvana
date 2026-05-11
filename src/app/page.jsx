import Header from '@/components/Header'
import HeroBanner from '@/components/HeroBanner'
import CountdownTimer from '@/components/CountdownTimer'
import ProductGrid from '@/components/ProductGrid'
import Testimonials from '@/components/Testimonials'
import InstagramSection from '@/components/InstagramSection'
import CustomSource from '@/components/CustomSource'
import Footer from '@/components/Footer'
import { DROP_CONFIG } from '@/config/drop'

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
        <ProductGrid />
        <CustomSource />
        <Testimonials />
        <InstagramSection />
      </main>
      <Footer />
    </div>
  )
}
