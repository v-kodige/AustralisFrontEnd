
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const DemoSection = () => {
  return (
    <section id="demo" className="py-24" style={{ backgroundColor: '#ebfef8' }}>
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#002060' }}>
            See Australis in action
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#3a3d5d' }}>
            Watch how our platform transforms site selection and assessment
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-lg border" style={{ backgroundColor: '#f0f0f4', borderColor: 'rgba(58, 61, 93, 0.2)' }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-20 w-20 rounded-full backdrop-blur-sm hover:bg-turquoise/20 border-2 mb-4"
              style={{ 
                backgroundColor: 'rgba(59, 245, 183, 0.1)',
                borderColor: '#3bf5b7'
              }}
            >
              <Play className="h-8 w-8" style={{ color: '#3bf5b7' }} />
            </Button>
            <p style={{ color: '#3a3d5d' }}>Product demonstration video</p>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(235, 254, 248, 0.5), transparent)' }}></div>
        </div>
        
        <div className="flex justify-center mt-10">
          <Button 
            size="lg"
            className="font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-glow-aqua"
            style={{ 
              backgroundColor: '#3bf5b7',
              color: '#002060'
            }}
          >
            Book a Live Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
