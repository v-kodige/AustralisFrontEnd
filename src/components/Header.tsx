import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return <header className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-lg border-b border-gray-200/50">
      <div className="container-custom flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <img alt="AE Logo" className="h-8 w-auto" src="/lovable-uploads/edc919d7-a5bd-4ead-bba9-be9e35909623.png" />
          <a href="#" className="text-xl font-bold text-black">
            Australis
          </a>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#benefits" className="text-sm text-gray-600 hover:text-australis-blue transition-colors">
            Benefits
          </a>
          <a href="#features" className="text-sm text-gray-600 hover:text-australis-blue transition-colors">
            Features
          </a>
          <a href="#blog" className="text-sm text-gray-600 hover:text-australis-blue transition-colors">
            Blog
          </a>
          <a href="#faq" className="text-sm text-gray-600 hover:text-australis-blue transition-colors">
            FAQ
          </a>
          <Button variant="default" size="sm">
            Book a Demo
          </Button>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600 hover:text-australis-blue">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && <div className="md:hidden bg-white/80 backdrop-blur-md border-b border-gray-200/50">
          <div className="container-custom py-4 space-y-4">
            <a href="#benefits" className="block text-gray-600 hover:text-australis-blue">
              Benefits
            </a>
            <a href="#features" className="block text-gray-600 hover:text-australis-blue">
              Features
            </a>
            <a href="#blog" className="block text-gray-600 hover:text-australis-blue">
              Blog
            </a>
            <a href="#faq" className="block text-gray-600 hover:text-australis-blue">
              FAQ
            </a>
            <Button variant="default" size="sm" className="w-full">
              Book a Demo
            </Button>
          </div>
        </div>}
    </header>;
};

export default Header;
