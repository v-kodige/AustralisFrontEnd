
import { Button } from '@/components/ui/button';
import NewsletterForm from './NewsletterForm';

const CtaSection = () => {
  return (
    <section className="py-20 bg-australis-navy text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to accelerate your solar pipeline?
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Join the developers using Australis to make smarter site decisions, faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-australis-navy"
              >
                Book a Demo
              </Button>
              <Button 
                size="lg"
                className="bg-australis-aqua text-australis-navy hover:bg-australis-aqua/90"
              >
                Join the Waitlist
              </Button>
            </div>
            
            <div className="mt-10 pt-6 border-t border-white/20">
              <p className="text-white/70 text-sm">
                Join the waitlist of top UK developers assessing 500+ sites for 2025 deployments.
              </p>
            </div>
          </div>
          
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
