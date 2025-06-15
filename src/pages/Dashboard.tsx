
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Protect dashboard: redirect if unauthenticated
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
      if (!session?.user) navigate("/auth");
    });
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      if (!data?.user) navigate("/auth");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({ title: "Logged out", description: "You have been signed out." });
    navigate("/auth");
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 rounded-full border-t-blue-500 mb-3"></div>
        <div className="text-gray-400">Loading your dashboard…</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full border flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-3 text-primary text-center">
          👋 Welcome, {user.email}!
        </h1>
        <p className="mb-8 text-gray-700 text-center">
          This is your dashboard. You are signed in and can now access personalized features.
        </p>
        <Button className="w-full" onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
