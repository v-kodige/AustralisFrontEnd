
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, HelpCircle, CreditCard, Users, ChevronDown } from "lucide-react";

interface AccountDropdownProps {
  user: any;
}

const AccountDropdown = ({ user }: AccountDropdownProps) => {
  const handleAccountSettings = () => {
    console.log("Opening account settings");
  };

  const handleBilling = () => {
    console.log("Opening billing settings");
  };

  const handleTeamSettings = () => {
    console.log("Opening team settings");
  };

  const handleHelp = () => {
    console.log("Opening help center");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-australis-gray/20 bg-white/70 backdrop-blur-sm hover:bg-australis-lightGray transition-all duration-200"
        >
          <User className="w-4 h-4 text-australis-gray" />
          <span className="text-sm font-medium text-australis-navy hidden sm:inline">
            {user.user_metadata?.first_name || user.email?.split('@')[0]}
          </span>
          <ChevronDown className="w-3 h-3 text-australis-gray" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border border-australis-gray/20 shadow-lg">
        <DropdownMenuLabel className="text-australis-navy">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem 
            onClick={handleAccountSettings}
            className="flex items-center gap-2 cursor-pointer hover:bg-australis-lightGray"
          >
            <Settings className="w-4 h-4" />
            <span>Account Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleBilling}
            className="flex items-center gap-2 cursor-pointer hover:bg-australis-lightGray"
          >
            <CreditCard className="w-4 h-4" />
            <span>Billing & Plans</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleTeamSettings}
            className="flex items-center gap-2 cursor-pointer hover:bg-australis-lightGray"
          >
            <Users className="w-4 h-4" />
            <span>Team Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleHelp}
          className="flex items-center gap-2 cursor-pointer hover:bg-australis-lightGray"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountDropdown;
