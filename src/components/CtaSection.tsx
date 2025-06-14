
import { Button } from '@/components/ui/button';
import NewsletterForm from './NewsletterForm';

const CtaSection = () => {
  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#ebfef8' }}>
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="p-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#002060' }}>
              Ready to accelerate your renewable energy pipeline?
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8" style={{ color: '#3a3d5d' }}>
              Join the developers using Australis to make smarter site decisions, faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="outline" 
                className="transition-all duration-300 hover:glow-aqua"
                style={{
                  borderColor: '#3bf5b7',
                  color: '#3bf5b7'
                }}
              >
                Book a Demo
              </Button>
              <Button 
                size="lg"
                className="transition-all duration-300 hover:glow-electric"
                style={{
                  backgroundColor: '#6062ff',
                  color: '#ebfef8'
                }}
              >
                Join the Waitlist
              </Button>
            </div>
            <div className="mt-10 pt-6" style={{ borderTop: '1px solid rgba(58, 61, 93, 0.2)' }}>
              <p className="text-sm" style={{ color: '#3a3d5d' }}>
                Join the waitlist of top UK developers assessing 500+ sites for 2025 deployments.
              </p>
            </div>
          </div>
          <div className="border rounded-xl shadow-lg p-2 md:p-4" style={{ backgroundColor: '#f0f0f4', borderColor: 'rgba(58, 61, 93, 0.2)' }}>
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
