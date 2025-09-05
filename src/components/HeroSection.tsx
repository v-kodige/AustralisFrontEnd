import { Button } from '@/components/ui/button';
import AuroraBackground from '@/components/ui/aurora-background';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const HeroSection = () => {
  const [showFirstLine, setShowFirstLine] = useState(false);
  const [showSecondLine, setShowSecondLine] = useState(false);
  
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowFirstLine(true);
      setTimeout(() => setShowSecondLine(true), 1000);
    }, 200);
    return () => clearTimeout(timer1);
  }, []);
  
  const handleEarlyAccess = () => {
    const element = document.getElementById('expert-panel');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <AuroraBackground className="min-h-screen">
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
            <div className="animate-fade-in">
              {/* Elevated content card with glass morphism */}
              <div className="backdrop-blur-xl bg-aurora-white/10 border border-aurora-white/20 rounded-3xl p-8 shadow-2xl">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-aurora-white drop-shadow-lg">
                  Intelligent Energy Decisions<br />
                  <span className="bg-gradient-to-r from-aurora-cyan to-aurora-green bg-clip-text text-transparent drop-shadow-none">
                    Transform Your Portfolio
                  </span>
                </h1>
                
                <div className="space-y-3 mt-6 mb-8">
                  <p className={`transition-opacity duration-500 text-lg md:text-xl text-aurora-white/90 font-medium ${showFirstLine ? 'opacity-100' : 'opacity-0'}`}>
                    Fast, accurate simulation tools for energy analysts.
                  </p>
                  <p className={`transition-opacity duration-500 text-lg md:text-xl text-aurora-white/80 ${showSecondLine ? 'opacity-100' : 'opacity-0'}`}>
                    Comprehensive tracking and value-stack visualization.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-aurora-cyan to-aurora-green hover:from-aurora-cyan/90 hover:to-aurora-green/90 text-aurora-navy font-semibold shadow-lg shadow-aurora-cyan/20 backdrop-blur-sm border border-aurora-white/20 transition-all duration-300" 
                    onClick={handleEarlyAccess}
                  >
                    Join Waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-aurora-white/40 text-aurora-white hover:bg-aurora-white/20 hover:text-aurora-white backdrop-blur-sm bg-aurora-white/10 shadow-lg transition-all duration-300"
                  >
                    Discover Features
                    <PlayCircle className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              {/* Data visualization placeholder */}
              <div className="backdrop-blur-sm bg-aurora-white/5 border border-aurora-white/20 rounded-2xl p-6 shadow-xl">
                <div className="space-y-4">
                  <div className="h-4 bg-gradient-to-r from-aurora-cyan/60 to-aurora-green/60 rounded animate-aurora-pulse"></div>
                  <div className="h-3 bg-gradient-to-r from-aurora-indigo/40 to-aurora-purple/40 rounded w-3/4 animate-aurora-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="h-3 bg-gradient-to-r from-aurora-pink/50 to-aurora-purple/50 rounded w-1/2 animate-aurora-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="h-16 bg-gradient-to-br from-aurora-cyan/20 to-aurora-green/20 rounded border border-aurora-white/10"></div>
                    <div className="h-16 bg-gradient-to-br from-aurora-indigo/20 to-aurora-purple/20 rounded border border-aurora-white/10"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AuroraBackground>
  );
};

export default HeroSection;