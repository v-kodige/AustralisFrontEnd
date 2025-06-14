
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const DemoSection = () => {
  return (
    <section id="demo" className="py-24 bg-gradient-to-br from-background to-muted">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            See Australis in action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how our platform transforms site selection and assessment
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto aspect-video bg-card/30 rounded-xl overflow-hidden shadow-lg border">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-20 w-20 rounded-full bg-background/10 backdrop-blur-sm hover:bg-background/20 border-2 border-primary mb-4"
            >
              <Play className="h-8 w-8 text-primary" />
            </Button>
            <p className="text-muted-foreground">Product demonstration video</p>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background/50 to-transparent pointer-events-none"></div>
        </div>
        
        <div className="flex justify-center mt-10">
          <Button 
            size="lg"
            className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 hover:shadow-glow-aqua"
          >
            Book a Live Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
