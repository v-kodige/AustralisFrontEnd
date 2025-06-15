
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import OnboardingForm from "@/components/OnboardingForm";
import ProjectCard from "@/components/ProjectCard";
import DashboardHeader from "@/components/DashboardHeader";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Test Project",
      date: "4 February, 2025",
      score: "undefined",
      status: "Latest Report Score",
      image: "/lovable-uploads/818f82d1-bcb5-4fcd-a7d8-63a8d0f778cf.png"
    }
  ]);
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
      
      // Check if this is a first-time user (you can customize this logic)
      // For now, we'll show onboarding for all users on first visit
      const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
      if (!hasCompletedOnboarding && data?.user) {
        setShowOnboarding(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleOnboardingComplete = () => {
    localStorage.setItem("onboarding_completed", "true");
    setShowOnboarding(false);
    toast({
      title: "Welcome to Australis!",
      description: "Your workspace is ready. Let's get started!",
    });
  };

  const handleCreateProject = () => {
    if (projectName.trim()) {
      const newProject = {
        id: projects.length + 1,
        name: projectName,
        date: new Date().toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        score: "undefined",
        status: "Latest Report Score",
        image: "/lovable-uploads/818f82d1-bcb5-4fcd-a7d8-63a8d0f778cf.png"
      };
      setProjects([...projects, newProject]);
      setProjectName("");
      setShowCreateProject(false);
      toast({
        title: "Project Created",
        description: `${projectName} has been created successfully.`,
      });
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 rounded-full border-t-blue-500 mb-3"></div>
        <div className="text-gray-400">Loading your dashboard…</div>
      </div>
    );
  }

  // Show onboarding form for first-time users
  if (showOnboarding) {
    return <OnboardingForm user={user} onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <DashboardHeader user={user} />
      
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
          
          <div className="flex items-center gap-4 mb-8">
            {showCreateProject ? (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-64"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                />
                <Button onClick={handleCreateProject} className="bg-primary">
                  Create Project
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateProject(false);
                    setProjectName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setShowCreateProject(true)}
                className="bg-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Project
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-primary text-white py-12 mt-16">
        <div className="container-custom text-center">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
          </div>
          <p className="text-sm opacity-80">© 2025 Australis Energy. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
