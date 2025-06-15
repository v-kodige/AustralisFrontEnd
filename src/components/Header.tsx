
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, User as UserIcon, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null); // Replace with a proper type if profiles table is used
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    supabase.auth.getUser().then(({ data, error }) => {
      setUser(data?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({ title: "Logged out", description: "You have been signed out." });
    navigate("/auth");
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
          {!user ? (
            <Button
              size="sm"
              asChild
              className="flex items-center gap-2 bg-australis-indigo text-white border border-australis-indigo transition-colors hover:bg-white hover:text-australis-indigo"
              style={{ boxShadow: "0 1px 4px 0 rgba(60,98,255,.10)" }}
            >
              <Link to="/auth">
                <LogIn size={16} />
                Login / Signup
              </Link>
            </Button>
          ) : (
            <>
              <span className="flex items-center gap-2 text-gray-800 text-sm">
                <UserIcon size={17} />
                {user.email}
              </span>
              <Button size="sm" variant="outline" className="gap-2" onClick={handleLogout}>
                <LogOut size={15} />
                Logout
              </Button>
            </>
          )}
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
            {!user ? (
              <Button
                size="sm"
                asChild
                className="w-full flex items-center justify-center gap-2 bg-australis-indigo text-white border border-australis-indigo transition-colors hover:bg-white hover:text-australis-indigo"
                style={{ boxShadow: "0 1px 4px 0 rgba(60,98,255,.10)" }}
              >
                <Link to="/auth">
                  <LogIn size={16} />
                  Login / Signup
                </Link>
              </Button>
            ) : (
              <>
                <span className="flex items-center gap-2 text-gray-800 text-sm">
                  <UserIcon size={17} />
                  {user.email}
                </span>
                <Button size="sm" variant="outline" className="w-full gap-2 mt-2" onClick={handleLogout}>
                  <LogOut size={15} />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
