import { Button } from '@/components/ui/button';
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
    <section className="pt-32 pb-20 bg-gradient-to-br from-australis-offWhite via-white to-australis-lightGray relative overflow-hidden">
      {/* Refined aurora-style light effects with layered depth */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-australis-aqua/30 to-australis-aqua/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl animate-pulse-slow bg-gradient-to-tr from-australis-indigo/25 to-australis-indigo/5"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-radial from-white/40 to-transparent rounded-full blur-2xl"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            {/* Elevated content card with translucent surface */}
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 shadow-2xl shadow-australis-navy/5">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-australis-navy drop-shadow-sm">
                Find the best renewable energy sites.<br />
                <span className="bg-gradient-to-r from-australis-indigo to-australis-aqua bg-clip-text text-transparent drop-shadow-none">
                  In minutes, not months.
                </span>
              </h1>
              
              <div className="space-y-2 mt-6 mb-8">
                <p className={`transition-opacity duration-500 text-lg md:text-xl text-australis-navy/90 ${showFirstLine ? 'opacity-100' : 'opacity-0'}`}>
                  Focus on what works.
                </p>
                <p className={`transition-opacity duration-500 text-lg md:text-xl text-australis-navy/90 ${showSecondLine ? 'opacity-100' : 'opacity-0'}`}>
                  Skip what doesn't.
                </p>
              </div>
              
              {/* Early access only, book demo removed */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-australis-indigo to-australis-indigo/90 hover:from-australis-indigo/90 hover:to-australis-indigo/80 shadow-lg shadow-australis-indigo/20 backdrop-blur-sm border border-white/20" 
                  onClick={handleEarlyAccess}
                >
                  Request Early Access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-australis-indigo/30 text-australis-indigo hover:bg-australis-indigo/10 backdrop-blur-sm bg-white/40 shadow-lg"
                >
                  How It Works
                  <PlayCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Layered floating accent elements */}
          <div className="relative animate-fade-in">
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-australis-aqua/20 to-australis-aqua/5 rounded-full blur-2xl shadow-lg"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-tr from-australis-indigo/20 to-australis-indigo/5 rounded-full blur-2xl shadow-lg"></div>
            <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/30 rounded-full blur-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
