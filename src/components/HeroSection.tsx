
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-australis-offWhite to-australis-lightGray relative overflow-hidden">
      {/* Aurora-style light effects */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-australis-aqua/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-australis-indigo/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-australis-navy">
              Find the best renewable energy sites.<br />
              <span className="bg-gradient-to-r from-australis-indigo to-australis-aqua bg-clip-text text-transparent">
                In minutes, not months.
              </span>
            </h1>
            
            <div className="relative max-w-xl mt-6 mb-8 overflow-hidden">
              <p className="typewriter-text inline-block overflow-hidden whitespace-nowrap border-r-2 animate-typewriter animate-blink-caret text-lg md:text-xl text-australis-navy">
                Focus on what works. Skip what doesn't.
              </p>
              <p className="text-lg md:text-xl text-gray-600 mt-4">
                Australis cuts through the noise to surface the sites that matter.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-australis-indigo hover:bg-australis-indigo/90">
                Request Early Access
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="border-australis-indigo text-australis-indigo hover:bg-australis-indigo/10">
                How It Works
                <PlayCircle className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <div className="aspect-square md:aspect-[4/3] bg-gradient-to-br from-australis-navy/20 via-australis-indigo/20 to-australis-aqua/30 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm border border-white/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-center text-australis-navy italic">
                  Interactive map visualization
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-australis-aqua/10 rounded-full blur-2xl"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-australis-indigo/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
