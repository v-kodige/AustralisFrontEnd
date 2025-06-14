
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return <header className="fixed top-0 left-0 right-0 z-50 bg-australis-darkBlue/60 backdrop-blur-lg border-b border-australis-navy/50">
      <div className="container-custom flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <img alt="AE Logo" className="h-8 w-auto" src="/lovable-uploads/edc919d7-a5bd-4ead-bba9-be9e35909623.png" />
          <a href="#" className="text-xl font-bold text-white">
            Australis
          </a>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#benefits" className="text-sm text-australis-lightGray hover:text-australis-aqua transition-colors">
            Benefits
          </a>
          <a href="#features" className="text-sm text-australis-lightGray hover:text-australis-aqua transition-colors">
            Features
          </a>
          <a href="#blog" className="text-sm text-australis-lightGray hover:text-australis-aqua transition-colors">
            Blog
          </a>
          <a href="#faq" className="text-sm text-australis-lightGray hover:text-australis-aqua transition-colors">
            FAQ
          </a>
          <Button variant="outline" size="sm" className="border-australis-aqua text-australis-aqua hover:bg-australis-aqua hover:text-australis-darkBlue transition-all duration-300 hover:shadow-glow-aqua">
            Book a Demo
          </Button>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-australis-lightGray hover:text-australis-aqua">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && <div className="md:hidden bg-australis-darkBlue/80 backdrop-blur-md border-b border-australis-navy/50">
          <div className="container-custom py-4 space-y-4">
            <a href="#benefits" className="block text-australis-lightGray hover:text-australis-aqua">
              Benefits
            </a>
            <a href="#features" className="block text-australis-lightGray hover:text-australis-aqua">
              Features
            </a>
            <a href="#blog" className="block text-australis-lightGray hover:text-australis-aqua">
              Blog
            </a>
            <a href="#faq" className="block text-australis-lightGray hover:text-australis-aqua">
              FAQ
            </a>
            <Button variant="outline" size="sm" className="w-full border-australis-aqua text-australis-aqua hover:bg-australis-aqua hover:text-australis-darkBlue">
              Book a Demo
            </Button>
          </div>
        </div>}
    </header>;
};

export default Header;

