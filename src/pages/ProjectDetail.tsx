
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/DashboardHeader";
import ProjectMap from "@/components/project/ProjectMap";
import FileUpload from "@/components/project/FileUpload";
import DevelopabilityScore from "@/components/project/DevelopabilityScore";
import ReportTabs from "@/components/project/ReportTabs";
import DistanceConstraintAnalysis from "@/components/project/DistanceConstraintAnalysis";
import EnhancedProjectMap from "@/components/project/EnhancedProjectMap";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [projectGeometry, setProjectGeometry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!id) return;
    
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        toast({
          title: "Error",
          description: "Failed to load project details.",
          variant: "destructive"
        });
        navigate('/dashboard');
        return;
      }

      setProject(data);
      await loadProjectGeometry();
      setLoading(false);
    };

    fetchProject();
  }, [id, navigate]);

  const loadProjectGeometry = async () => {
    try {
      const { data: files, error } = await supabase
        .from('project_files')
        .select('geometry_data, geom')
        .eq('project_id', id)
        .eq('processed', true)
        .limit(1);

      if (error) throw error;
      
      if (files && files.length > 0) {
        setProjectGeometry(files[0].geometry_data || files[0].geom);
      }
    } catch (error) {
      console.error('Error loading project geometry:', error);
    }
  };

  const handleFileUploaded = () => {
    loadProjectGeometry();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-australis-offWhite via-white to-australis-lightBlue/10">
        <DashboardHeader user={user} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-australis-blue/20 rounded-full border-t-australis-blue mb-3"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-australis-offWhite via-white to-australis-lightBlue/10">
        <DashboardHeader user={user} />
        <div className="container-custom py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-australis-navy mb-4">Project not found</h1>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-australis-offWhite via-white to-australis-lightBlue/10">
      <DashboardHeader user={user} />
      
      <div className="container-custom py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-australis-gray hover:text-australis-navy mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-australis-navy mb-2">{project.name}</h1>
              <p className="text-australis-gray">{project.description || 'No description provided'}</p>
              {project.location && (
                <p className="text-sm text-australis-gray mt-1">📍 {project.location}</p>
              )}
            </div>
            <DevelopabilityScore projectId={project.id} />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="map">Enhanced Map</TabsTrigger>
            <TabsTrigger value="constraints">Distance Analysis</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <FileUpload projectId={project.id} onFileUploaded={handleFileUploaded} />
              </div>
              
              <div className="h-96 lg:h-full">
                <ProjectMap projectId={project.id} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="map">
            <EnhancedProjectMap projectId={project.id} />
          </TabsContent>

          <TabsContent value="constraints">
            <DistanceConstraintAnalysis 
              projectId={project.id} 
              geometry={projectGeometry}
            />
          </TabsContent>

          <TabsContent value="reports">
            <ReportTabs projectId={project.id} />
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <FileUpload projectId={project.id} onFileUploaded={handleFileUploaded} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectDetail;
