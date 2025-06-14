
import { Button } from '@/components/ui/button';
import NewsletterForm from './NewsletterForm';

const CtaSection = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-background">
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="p-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Ready to accelerate your renewable energy pipeline?
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 text-muted-foreground">
              Join the developers using Australis to make smarter site decisions, faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:glow-aqua"
              >
                Book a Demo
              </Button>
              <Button 
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-300 hover:glow-electric"
              >
                Join the Waitlist
              </Button>
            </div>
            <div className="mt-10 pt-6 border-t border-border">
              <p className="text-muted-foreground text-sm">
                Join the waitlist of top UK developers assessing 500+ sites for 2025 deployments.
              </p>
            </div>
          </div>
          <div className="bg-card border rounded-xl shadow-lg p-2 md:p-4">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
