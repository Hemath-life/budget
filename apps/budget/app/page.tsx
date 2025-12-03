import { 
  LandingHeader, 
  HeroSection, 
  FeaturesSection,
  PagesOutlineSection,
  TestimonialsSection, 
  FAQSection, 
  CTASection, 
  LandingFooter 
} from '@/apps/components/landing/landing-components';
import { PricingSection } from '@/apps/components/landing/pricing-section';

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
