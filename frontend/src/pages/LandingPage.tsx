import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import HowItWorks from '../components/landing/HowItWorks'
import ForDrivers from '../components/landing/ForDrivers'
import ForCleaners from '../components/landing/ForCleaners'
import CTA from '../components/landing/CTA'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <ForDrivers />
      <ForCleaners />
      <CTA />
      <Footer />
    </div>
  )
}
