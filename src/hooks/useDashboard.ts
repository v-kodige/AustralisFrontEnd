
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
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

  const handleCreateProject = (projectData: any) => {
    const newProject = {
      id: projects.length + 1,
      name: projectData.name,
      date: new Date().toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      score: "undefined",
      status: "Development Score",
      image: "/lovable-uploads/818f82d1-bcb5-4fcd-a7d8-63a8d0f778cf.png",
      description: projectData.description,
      location: projectData.location,
      teamMembers: projectData.teamMembers
    };
    setProjects([...projects, newProject]);
    setShowCreateProject(false);
    toast({
      title: "Project Created",
      description: `${projectData.name} has been created successfully.`,
    });
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    if (user?.user_metadata?.nickname) {
      return user.user_metadata.nickname;
    }
    return user?.email?.split('@')[0] || 'there';
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    user,
    showOnboarding,
    showCreateProject,
    searchTerm,
    projects: filteredProjects,
    setSearchTerm,
    setShowCreateProject,
    handleOnboardingComplete,
    handleCreateProject,
    getUserDisplayName
  };
};
