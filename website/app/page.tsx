import Navigation from '@/components/sections/Navigation'
import Hero from '@/components/sections/Hero'
import Proof from '@/components/sections/Proof'
import Problem from '@/components/sections/Problem'
import FutureVision from '@/components/sections/FutureVision'
import Process from '@/components/sections/Process'
import VSL from '@/components/sections/VSL'
import Pricing from '@/components/sections/Pricing'
import UrgencyCTA from '@/components/sections/UrgencyCTA'
import FAQ from '@/components/sections/FAQ'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <Navigation />
      <Hero />
      <Proof />
      <Problem />
      <FutureVision />
      <Process />
      <VSL />
      <Pricing />
      <UrgencyCTA />
      <FAQ />
      <Footer />
    </main>
  )
}
