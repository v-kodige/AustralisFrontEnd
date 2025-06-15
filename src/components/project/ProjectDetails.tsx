
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUpload from './FileUpload';
import EnhancedProjectMap from './EnhancedProjectMap';
import ConstraintAnalysis from './ConstraintAnalysis';
import DevelopabilityScore from './DevelopabilityScore';

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

const ProjectDetails = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [projectGeometry, setProjectGeometry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      loadProject();
      loadProjectGeometry();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectGeometry = async () => {
    try {
      const { data: files, error } = await supabase
        .from('project_files')
        .select('geometry_data, geom')
        .eq('project_id', projectId)
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
    // Refresh project geometry when a new file is uploaded
    loadProjectGeometry();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-australis-blue/20 rounded-full border-t-australis-blue"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">Project not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Project Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-australis-navy">
            {project.name}
          </CardTitle>
          {project.description && (
            <p className="text-gray-600">{project.description}</p>
          )}
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="map">Map & Boundary</TabsTrigger>
          <TabsTrigger value="constraints">Constraints</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FileUpload 
              projectId={project.id} 
              onFileUploaded={handleFileUploaded}
            />
            <DevelopabilityScore projectId={project.id} />
          </div>
        </TabsContent>

        <TabsContent value="map">
          <EnhancedProjectMap projectId={project.id} />
        </TabsContent>

        <TabsContent value="constraints">
          <ConstraintAnalysis 
            projectId={project.id} 
            geometry={projectGeometry}
          />
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>EIA Constraint Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Comprehensive Environmental Impact Assessment constraint analysis for UK solar farm development.
                </p>
                <div className="space-y-4">
                  <ConstraintAnalysis 
                    projectId={project.id} 
                    geometry={projectGeometry}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetails;
