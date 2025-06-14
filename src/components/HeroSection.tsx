
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const HeroSection = () => {
  const [showTypewriter, setShowTypewriter] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTypewriter(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleEarlyAccess = () => {
    const element = document.getElementById('expert-panel');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-32 pb-20 relative overflow-hidden" style={{ backgroundColor: '#ebfef8' }}>
      {/* Subtle geometric tech pattern in very light blue, very low opacity */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg className="w-full h-full" viewBox="0 0 500 200" fill="none">
          <ellipse cx="150" cy="40" rx="120" ry="32" fill="#6062ff" fillOpacity="0.09"/>
          <ellipse cx="340" cy="180" rx="80" ry="20" fill="#3a3d5d" fillOpacity="0.07"/>
        </svg>
      </div>
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: '#002060' }}>
              Find the best solar sites.<br />
              <span className="text-gradient relative">
                In minutes, not months.
                <div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-full w-full"></div>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl mb-6 leading-relaxed" style={{ color: '#3a3d5d' }}>
              Australis is an AI-powered platform that accelerates clean energy development by helping you discover, assess and prioritise high-potential solar sites across the UK — faster, smarter, and with less risk.
            </p>

            <div className={`mb-8 ${showTypewriter ? 'block' : 'hidden'}`}>
              <p className="text-lg font-medium typewriter-text" style={{ color: '#002060' }}>
                Australis empowers you to cut through the complexity and <span className="font-bold" style={{ color: '#6062ff' }}>focus your efforts on what works best</span>.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 glow-aqua shadow"
                onClick={handleEarlyAccess}
              >
                Request Early Access
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary hover:border-secondary transition-all duration-300 glow-electric"
              >
                How It Works
                <PlayCircle className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="relative animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="aspect-square md:aspect-[4/3] bg-gradient-to-br from-card to-background rounded-xl shadow-lg overflow-hidden border border-border relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <PlayCircle className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-muted-foreground italic">
                    Interactive AI-powered site analysis
                  </p>
                </div>
              </div>
              
              {/* Tech overlay elements */}
              <div className="absolute top-4 right-4 w-12 h-12 border border-primary/30 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 bg-secondary/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
