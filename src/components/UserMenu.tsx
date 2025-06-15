
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";

const UserMenu = () => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();

  const email = user?.email ?? "Account";

  const handleSignOut = async () => {
    const { error } = await import("@/integrations/supabase/client").then(m => m.supabase.auth.signOut());
    if (error) toast({ title: "Failed to sign out", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Signed Out" });
      navigate("/auth");
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Avatar className="h-8 w-8 text-indigo-600 bg-australis-indigo/20">{email[0].toUpperCase()}</Avatar>
      <span className="text-sm font-medium">{email}</span>
      <Button size="icon" variant="ghost" title="Log out" onClick={handleSignOut}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserMenu;
