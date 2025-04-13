
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import BenefitsSection from '@/components/BenefitsSection';
import FeaturesSection from '@/components/FeaturesSection';
import SocialProofSection from '@/components/SocialProofSection';
import DevelopabilityIndex from '@/components/DevelopabilityIndex';
import DemoSection from '@/components/DemoSection';
import CtaSection from '@/components/CtaSection';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <BenefitsSection />
        <FeaturesSection />
        <DevelopabilityIndex />
        <SocialProofSection />
        <DemoSection />
        <CtaSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
