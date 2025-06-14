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
      <h3 className="text-xl font-semibold mb-4 text-card-foreground">Stay updated</h3>
      <p className="text-muted-foreground mb-6">
        Get early access and product updates by joining our waitlist.
      </p>
      
      {isSubscribed ? (
        <div className="flex items-center gap-3 text-card-foreground">
          <div className="bg-primary rounded-full p-1 text-primary-foreground">
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
              className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-ring"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-glow-aqua"
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
