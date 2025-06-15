import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import OnboardingForm from "@/components/OnboardingForm";
import ProjectCard from "@/components/ProjectCard";
import DashboardHeader from "@/components/DashboardHeader";
import { Plus, Search, Filter, FolderOpen } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Renewable Energy Assessment",
      date: "4 February, 2025",
      score: "87.5",
      status: "Development Score",
      image: "/lovable-uploads/818f82d1-bcb5-4fcd-a7d8-63a8d0f778cf.png"
    },
    {
      id: 2,
      name: "Solar Farm Analysis",
      date: "28 January, 2025",
      score: "92.1",
      status: "Development Score",
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
        status: "Development Score",
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

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-australis-offWhite via-white to-australis-lightBlue/10">
        <div className="animate-spin w-8 h-8 border-4 border-australis-blue/20 rounded-full border-t-australis-blue mb-3"></div>
        <div className="text-australis-gray">Loading your dashboard…</div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingForm user={user} onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-australis-offWhite via-white to-australis-lightBlue/10">
      <DashboardHeader user={user} />
      
      <div className="container-custom py-8">
        <div className="mb-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-australis-navy mb-3">
              Welcome back, {user.email?.split('@')[0]}
            </h1>
            <p className="text-australis-gray text-lg">
              Manage your renewable energy projects and track development scores
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-australis-gray w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-australis-gray/20 focus:border-australis-blue bg-white/70 backdrop-blur-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2 border-australis-gray/20">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              {showCreateProject ? (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-48 border-australis-blue/20 focus:border-australis-blue"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                  />
                  <Button 
                    onClick={handleCreateProject} 
                    className="bg-gradient-to-r from-australis-blue to-australis-teal hover:from-australis-blue/90 hover:to-australis-teal/90 text-white shadow-lg"
                  >
                    Create
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateProject(false);
                      setProjectName("");
                    }}
                    className="border-australis-gray/20"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowCreateProject(true)}
                  className="bg-gradient-to-r from-australis-blue to-australis-teal hover:from-australis-blue/90 hover:to-australis-teal/90 text-white shadow-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </Button>
              )}
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-australis-lightGray rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-australis-gray" />
              </div>
              <h3 className="text-lg font-medium text-australis-navy mb-2">
                {searchTerm ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-australis-gray mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first project to get started'}
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setShowCreateProject(true)}
                  className="bg-gradient-to-r from-australis-blue to-australis-teal hover:from-australis-blue/90 hover:to-australis-teal/90 text-white shadow-lg"
                >
                  Create Your First Project
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gradient-to-r from-australis-navy to-australis-darkBlue text-white py-12 mt-16">
        <div className="container-custom text-center">
          <div className="mb-4">
            <img 
              alt="AE Logo" 
              className="h-8 w-auto mx-auto mb-4 opacity-80" 
              src="/lovable-uploads/edc919d7-a5bd-4ead-bba9-be9e35909623.png" 
            />
            <h3 className="text-lg font-semibold mb-2">Australis Energy</h3>
            <p className="text-sm opacity-80 max-w-md mx-auto">
              Empowering renewable energy development with intelligent analysis and insights
            </p>
          </div>
          <p className="text-xs opacity-60">© 2025 Australis Energy. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
