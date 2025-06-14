
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border">
      <div className="container-custom flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <img alt="AE Logo" className="h-8 w-auto" src="/lovable-uploads/edc919d7-a5bd-4ead-bba9-be9e35909623.png" />
          <a href="#" className="text-xl font-bold text-foreground">
            Australis
          </a>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#benefits" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Benefits
          </a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Features
          </a>
          <a href="#demo" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Demo
          </a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            FAQ
          </a>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:glow-aqua"
          >
            Book a Demo
          </Button>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-2 text-muted-foreground hover:text-primary"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
          <div className="container-custom py-4 space-y-4">
            <a href="#benefits" className="block text-muted-foreground hover:text-primary">
              Benefits
            </a>
            <a href="#features" className="block text-muted-foreground hover:text-primary">
              Features
            </a>
            <a href="#demo" className="block text-muted-foreground hover:text-primary">
              Demo
            </a>
            <a href="#faq" className="block text-muted-foreground hover:text-primary">
              FAQ
            </a>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Book a Demo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
