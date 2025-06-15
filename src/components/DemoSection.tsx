
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const DemoSection = () => {
  return (
    <section id="demo" className="py-24 bg-gradient-to-br from-australis-blue/5 to-australis-teal/5">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See Australis in action
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch how our platform transforms site selection and assessment
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-20 w-20 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-australis-teal mb-4"
            >
              <Play className="h-8 w-8 text-australis-blue" />
            </Button>
            <p className="text-australis-gray">Product demonstration video</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        
        {/* REMOVED Book a Live Demo button */}
        {/* <div className="flex justify-center mt-10">
          <Button 
            variant="default" 
            size="lg"
            className="bg-australis-blue hover:bg-australis-blue/90"
          >
            Book a Live Demo
          </Button>
        </div> */}
      </div>
    </section>
  );
};

export default DemoSection;
