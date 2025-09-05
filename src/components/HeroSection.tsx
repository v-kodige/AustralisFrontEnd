
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AuroraBackground } from '@/components/ui/aurora-background';
import VideoBackgroundToggle from '@/components/VideoBackgroundToggle';

const HeroSection = () => {
  const [showFirstLine, setShowFirstLine] = useState(false);
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [useVideoBackground, setUseVideoBackground] = useState(false);
  
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
    <section className="pt-32 pb-20 relative overflow-hidden min-h-screen">
      {useVideoBackground ? (
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69&profile_id=139" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      ) : (
        <AuroraBackground className="absolute inset-0" showRadialGradient={true}>
          <div></div>
        </AuroraBackground>
      )}
      
      <VideoBackgroundToggle 
        onToggle={setUseVideoBackground} 
        isVideo={useVideoBackground} 
      />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div className="animate-fade-in">
            {/* Elevated content card with translucent surface */}
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 shadow-2xl shadow-australis-navy/5">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                Find the best renewable energy sites.<br />
                <span className="bg-gradient-to-r from-australis-indigo to-australis-aqua bg-clip-text text-transparent drop-shadow-none">
                  In minutes, not months.
                </span>
              </h1>
              
              <div className="space-y-2 mt-6 mb-8">
                <p className={`transition-opacity duration-500 text-lg md:text-xl text-white/90 ${showFirstLine ? 'opacity-100' : 'opacity-0'}`}>
                  Focus on what works.
                </p>
                <p className={`transition-opacity duration-500 text-lg md:text-xl text-white/90 ${showSecondLine ? 'opacity-100' : 'opacity-0'}`}>
                  Skip what doesn't.
                </p>
              </div>
              
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
                  className="border-white/30 text-white hover:bg-white hover:text-australis-indigo backdrop-blur-sm bg-white/10 shadow-lg"
                >
                  How It Works
                  <PlayCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            {/* Placeholder for future content */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
