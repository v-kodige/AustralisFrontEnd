
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail('');
      
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll be in touch soon.",
      });
    }, 1000);
  };

  return (
    <div className="bg-transparent rounded-xl p-6 md:p-8">
      <h3 className="text-xl font-semibold mb-4 text-white">Stay updated</h3>
      <p className="text-white/80 mb-6">
        Get early access and product updates by joining our waitlist.
      </p>
      
      {isSubscribed ? (
        <div className="flex items-center gap-3 text-white">
          <div className="bg-australis-aqua rounded-full p-1 text-australis-navy">
            <Check className="h-4 w-4" />
          </div>
          <span>You're on the waitlist!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-australis-navy/50 border-white/30 text-white placeholder:text-white/60 focus:ring-australis-aqua"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-australis-aqua text-australis-navy font-semibold hover:bg-australis-aqua/90 transition-all duration-300 hover:shadow-glow-aqua"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Subscribing...' : 'Join Waitlist'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default NewsletterForm;

