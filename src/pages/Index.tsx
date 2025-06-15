
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import BenefitsSection from '@/components/BenefitsSection';
import FeaturesSection from '@/components/FeaturesSection';
import SocialProofSection from '@/components/SocialProofSection';
import DemoSection from '@/components/DemoSection';
import CtaSection from '@/components/CtaSection';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';
import ExpertPanel from '@/components/ExpertPanel';
import Auth from './Auth';
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const Index = () => {
  const { user, loading } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="spinner-border animate-spin h-8 w-8 border-4 border-australis-indigo rounded-full border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {!user && (
          <div className="pt-4 pb-8">
            <Auth />
          </div>
        )}
        {user && (
          <>
            <HeroSection />
            <ProblemSection />
            <BenefitsSection />
            <FeaturesSection />
            <SocialProofSection />
            <DemoSection />
            <ExpertPanel />
            <CtaSection />
            <FaqSection />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
