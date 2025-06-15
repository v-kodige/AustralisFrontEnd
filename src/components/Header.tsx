import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn } from 'lucide-react';
import { Link } from "react-router-dom";
import UserMenu from "@/components/UserMenu";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const B2C_LOGIN_URL =
  "https://australisenergyb2corg.b2clogin.com/australisenergyb2corg.onmicrosoft.com/b2c_1_signupsignin-dev/oauth2/v2.0/authorize?client_id=27285428-316d-429f-a2a7-40e6c2c758f7&scope=openid%20profile%20email%20offline_access&redirect_uri=https%3A%2F%2Faustralis-energy-dev-app.azurewebsites.net&client-request-id=019773f9-2e20-747a-8525-51f33052216e&response_mode=fragment&response_type=code&x-client-SKU=msal.js.browser&x-client-VER=3.23.0&client_info=1&code_challenge=yjgwPuAcxqVCd7CdVkxluUsc_I6Y3694UvEVwHGxomw&code_challenge_method=S256&nonce=019773f9-2ec4-7932-9c65-5b32a1d45fa6&state=eyJpZCI6IjAxOTc3M2Y5LTJlYzMtNzNkMC05YmNkLWUzMDE5MDk0ZTUwNSIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicG9wdXAifX0%3D";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useSupabaseAuth();

  const handleLogin = () => {
    window.open(
      B2C_LOGIN_URL,
      "loginPopup",
      "width=480,height=720,menubar=no,toolbar=no,status=no,scrollbars=yes"
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-lg border-b border-gray-200/50">
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
          <Link to="/pricing" className="text-sm text-gray-600 hover:text-australis-blue transition-colors">
            Pricing
          </Link>
          {user ? (
            <UserMenu />
          ) : (
            <Link to="/auth">
              <Button
                size="sm"
                className="flex items-center gap-2 bg-australis-indigo text-white border border-australis-indigo transition-colors hover:bg-white hover:text-australis-indigo"
                style={{ boxShadow: "0 1px 4px 0 rgba(60,98,255,.10)" }}
              >
                <LogIn size={16} />
                Login
              </Button>
            </Link>
          )}
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
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/80 backdrop-blur-md border-b border-gray-200/50">
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
            <Link to="/pricing" className="block text-gray-600 hover:text-australis-blue">
              Pricing
            </Link>
            {user ? (
              <UserMenu />
            ) : (
              <Link to="/auth">
                <Button
                  size="sm"
                  className="w-full flex items-center justify-center gap-2 bg-australis-indigo text-white border border-australis-indigo transition-colors hover:bg-white hover:text-australis-indigo"
                  style={{ boxShadow: "0 1px 4px 0 rgba(60,98,255,.10)" }}
                >
                  <LogIn size={16} />
                  Login
                </Button>
              </Link>
            )}
            <Button variant="default" size="sm" className="w-full">
              Book a Demo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
