
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
import AccountDropdown from "./AccountDropdown";

interface DashboardHeaderProps {
  user: any;
}

const DashboardHeader = ({ user }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out", description: "You have been signed out." });
    navigate("/auth");
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <img 
                alt="AE Logo" 
                className="h-10 w-auto" 
                src="/lovable-uploads/edc919d7-a5bd-4ead-bba9-be9e35909623.png" 
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-australis-navy">Australis Energy</span>
                <span className="text-xs text-australis-gray font-medium">Renewable Development Platform</span>
              </div>
            </div>
            <div className="hidden sm:flex bg-gradient-to-r from-australis-blue to-australis-teal text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
              Dashboard
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <AccountDropdown user={user} />
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              size="sm"
              className="flex items-center gap-2 border-australis-gray/20 text-australis-gray hover:bg-australis-lightGray hover:text-australis-navy transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
