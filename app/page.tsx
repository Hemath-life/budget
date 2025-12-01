import { 
  LandingHeader, 
  HeroSection, 
  FeaturesSection,
  PagesOutlineSection,
  TestimonialsSection, 
  FAQSection, 
  CTASection, 
  LandingFooter 
} from '@/components/landing/landing-components';
import { PricingSection } from '@/components/landing/pricing-section';

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PagesOutlineSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <LandingFooter />
    </>
  );
}
