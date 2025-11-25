import { HeroSection } from '../components/home/HeroSection'
import { HowItWorksSection } from '../components/home/HowItWorksSection'
import { BenefitsSection } from '../components/home/BenefitsSection'
import { TrustSection } from '../components/home/TrustSection'

export default function HomePage() {
  return (
    <div className="bg-slate-950">
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <TrustSection />
    </div>
  )
}
