import {
  CTASection,
  FAQSection,
  FeaturesSection,
  HeroSection,
  LandingFooter,
  LandingHeader,
  PagesOutlineSection,
  TestimonialsSection,
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
