
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_reports(developability_score, report_status, generated_at)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match existing interface
      const transformedProjects = data?.map((project: any) => ({
        id: project.id,
        name: project.name,
        date: new Date(project.created_at).toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        score: project.project_reports?.[0]?.developability_score?.toString() || "undefined",
        status: "Development Score",
        image: "/lovable-uploads/818f82d1-bcb5-4fcd-a7d8-63a8d0f778cf.png",
        description: project.description,
        location: project.location,
        team_members: project.team_members
      })) || [];

      setProjects(transformedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem("onboarding_completed", "true");
    setShowOnboarding(false);
    toast({
      title: "Welcome to Australis!",
      description: "Your workspace is ready. Let's get started!",
    });
  };

  const handleCreateProject = async (projectData: any) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: projectData.name,
          description: projectData.description,
          location: projectData.location,
          team_members: projectData.teamMembers?.map((member: any) => member.email).filter(Boolean) || []
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Project Created",
        description: `${projectData.name} has been created successfully.`,
      });

      setShowCreateProject(false);
      fetchProjects(); // Refresh projects list
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
    }
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
    loading,
    setSearchTerm,
    setShowCreateProject,
    handleOnboardingComplete,
    handleCreateProject,
    getUserDisplayName
  };
};
