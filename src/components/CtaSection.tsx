
import { Button } from '@/components/ui/button';
import NewsletterForm from './NewsletterForm';

const CtaSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with gradient and blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-australis-navy/95 to-australis-navy/90 z-0"></div>
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-australis-aqua/20 rounded-full blur-3xl animate-pulse-slow z-0"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-australis-indigo/20 rounded-full blur-3xl animate-pulse-slow z-0"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="backdrop-blur-sm p-8 rounded-xl border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to accelerate your renewable energy pipeline?
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 text-white">
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
          
          <div className="backdrop-blur-sm p-8 rounded-xl border border-white/10">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
