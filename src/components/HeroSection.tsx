
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
    <section className="pt-32 pb-20 bg-background tech-pattern relative overflow-hidden">
      {/* Geometric tech patterns */}
      <div className="absolute top-20 right-20 w-64 h-64 opacity-30">
        <div className="w-full h-full border border-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-8 left-8 w-48 h-48 border border-secondary/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      <div className="absolute bottom-20 left-20 w-48 h-48 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Find the best solar sites.<br />
              <span className="text-gradient relative">
                In minutes, not months.
                <div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-full w-full"></div>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
              Australis is an AI-powered platform that accelerates clean energy development by helping you discover, assess and prioritise high-potential solar sites across the UK — faster, smarter, and with less risk.
            </p>

            <div className={`mb-8 ${showTypewriter ? 'block' : 'hidden'}`}>
              <p className="text-lg font-medium text-secondary typewriter-text">
                Australis empowers you to cut through the complexity and focus your efforts on what works best.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 animate-pulse-glow"
                onClick={handleEarlyAccess}
              >
                Request Early Access
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary hover:border-secondary transition-all duration-300 hover:glow-electric"
              >
                How It Works
                <PlayCircle className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="relative animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="aspect-square md:aspect-[4/3] bg-gradient-to-br from-muted to-card rounded-xl shadow-lg overflow-hidden border border-border relative">
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
              <div className="absolute top-4 right-4 w-12 h-12 border border-primary/30 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 bg-secondary/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
