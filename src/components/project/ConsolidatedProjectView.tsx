import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, Download, MessageCircle } from 'lucide-react';
import FunctionalMap from './FunctionalMap';
import FileUpload from './FileUpload';
import DevelopabilityScore from './DevelopabilityScore';
import PDFReportGenerator from './PDFReportGenerator';
import ConstraintChatInterface from './ConstraintChatInterface';
import { UK_SOLAR_CONSTRAINTS } from './ConstraintCategories';
import REPDIntegration from './REPDIntegration';

interface ConsolidatedProjectViewProps {
  projectId: string;
}

interface ConstraintLayer {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  color: string;
  features: any[];
}

const ConsolidatedProjectView = ({ projectId }: ConsolidatedProjectViewProps) => {
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const [constraintLayers, setConstraintLayers] = useState<ConstraintLayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [projectLocation, setProjectLocation] = useState<{ lat: number; lng: number } | null>(null);

  const constraintColors = {
    sssi: '#ff0000',
    aonb: '#00ff00', 
    flood_zone_3: '#0066cc',
    green_belt: '#90EE90',
    listed_buildings: '#800080',
    ancient_woodland: '#228B22',
    sac: '#ff6600',
    spa: '#ff9900',
    electrical_substations: '#ffff00',
    major_roads: '#808080',
    residential_areas: '#ffb6c1',
    environmental: '#ff4444',
    landscape: '#44ff44',
    heritage: '#4444ff',
    flood_risk: '#44ffff',
    planning: '#ff44ff',
    infrastructure: '#ffff44'
  };

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      console.log('=== GIS TROUBLESHOOTING: PROJECT DATA LOADING START ===');
      console.log('1. Project ID:', projectId);
      
      // Load project details
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;
      console.log('2. Project loaded:', project);
      setProjectData(project);

      // Check if file exists - STEP-BY-STEP DEBUGGING
      console.log('3. Querying project_files table...');
      const { data: files, error: fileError } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .eq('processed', true);

      if (fileError) throw fileError;
      console.log('4. Raw files from database:', files);
      console.log('4a. Files count:', files ? files.length : 0);

      if (files && files.length > 0) {
        const file = files[0];
        console.log('=== GIS TROUBLESHOOTING: FILE ANALYSIS START ===');
        console.log('5. Selected file details:');
        console.log('   - File name:', file.file_name);
        console.log('   - File ID:', file.id);
        console.log('   - File type:', file.file_type);
        console.log('   - File uploaded at:', file.upload_date); // Fixed: use upload_date instead of created_at
        console.log('   - File processed:', file.processed);
        console.log('   - File size:', file.file_size);
        console.log('   - Has geometry_data:', !!file.geometry_data);
        console.log('   - Has geom (PostGIS):', !!file.geom);
        
        if (file.geometry_data) {
          console.log('=== GIS TROUBLESHOOTING: GEOMETRY DATA ANALYSIS ===');
          console.log('6. Geometry data type:', typeof file.geometry_data);
          
          // Type assertion for geometry_data to handle the Json type properly
          const geometryData = file.geometry_data as any;
          console.log('7. Geometry data structure:', JSON.stringify(geometryData, null, 2));
          
          // Check for coordinate bounds and features - Fixed type assertions
          if (geometryData && typeof geometryData === 'object' && geometryData.features && Array.isArray(geometryData.features)) {
            console.log('8. Features found:', geometryData.features.length);
            
            if (geometryData.features.length > 0) {
              const feature = geometryData.features[0];
              console.log('9. First feature analysis:');
              console.log('   - Geometry type:', feature.geometry?.type);
              console.log('   - Has coordinates:', !!feature.geometry?.coordinates);
              console.log('   - Coordinates preview:', feature.geometry?.coordinates);
              console.log('   - Feature properties:', feature.properties);
              
              // Coordinate validation
              if (feature.geometry?.coordinates) {
                console.log('10. Coordinate validation:');
                const coords = feature.geometry.coordinates;
                if (feature.geometry.type === 'Polygon' && Array.isArray(coords[0])) {
                  console.log('    - Polygon with', coords[0].length, 'coordinate pairs');
                  console.log('    - First coordinate:', coords[0][0]);
                  console.log('    - Last coordinate:', coords[0][coords[0].length - 1]);
                } else if (feature.geometry.type === 'Point') {
                  console.log('    - Point at:', coords);
                }
              }
            }
          } else {
            console.log('8. ❌ No valid features array found in geometry_data');
          }
          
          // Extract project location for REPD analysis
          if (geometryData && geometryData.features && geometryData.features.length > 0) {
            const feature = geometryData.features[0];
            if (feature.geometry && feature.geometry.coordinates) {
              let centerLat, centerLng;
              
              if (feature.geometry.type === 'Point') {
                centerLng = feature.geometry.coordinates[0];
                centerLat = feature.geometry.coordinates[1];
              } else if (feature.geometry.type === 'Polygon') {
                // Calculate centroid of polygon
                const coords = feature.geometry.coordinates[0];
                const sumLat = coords.reduce((sum: number, coord: number[]) => sum + coord[1], 0);
                const sumLng = coords.reduce((sum: number, coord: number[]) => sum + coord[0], 0);
                centerLat = sumLat / coords.length;
                centerLng = sumLng / coords.length;
              }
              
              if (centerLat && centerLng) {
                setProjectLocation({ lat: centerLat, lng: centerLng });
                console.log('Project location set for REPD analysis:', { lat: centerLat, lng: centerLng });
              }
            }
          }
          
          setBoundaryData(geometryData);
          setHasUploadedFile(true);
          setShowFileUpload(false);
          console.log('11. ✅ Boundary data set in state successfully');
        } else {
          console.log('6. ❌ No geometry_data found in file record');
        }
      } else {
        console.log('4. ❌ No processed files found for project');
      }

      // Load analysis data
      const { data: reports, error: reportsError } = await supabase
        .from('project_reports')
        .select('*')
        .eq('project_id', projectId)
        .order('generated_at', { ascending: false })
        .limit(1);

      if (reportsError) throw reportsError;

      if (reports && reports.length > 0) {
        setAnalysisData(reports[0].constraint_analysis);
        console.log('12. Analysis data loaded:', reports[0].constraint_analysis);
      } else {
        console.log('12. No analysis data found');
      }

      await loadConstraintLayers();
      console.log('=== GIS TROUBLESHOOTING: PROJECT DATA LOADING END ===');

    } catch (error) {
      console.error('❌ Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConstraintLayers = async () => {
    try {
      const { data: allConstraints, error } = await supabase
        .from('constraint_datasets')
        .select('*');

      if (error) throw error;

      const uniqueTypes = Array.from(new Set(allConstraints?.map(c => c.type) || []));
      const layers: ConstraintLayer[] = [];

      for (const type of uniqueTypes) {
        const features = allConstraints?.filter(c => c.type === type) || [];
        const constraint = UK_SOLAR_CONSTRAINTS.find(c => c.id === type);
        
        layers.push({
          id: type,
          name: constraint?.name || type.replace('_', ' ').toUpperCase(),
          type: constraint?.category || 'other',
          visible: true,
          color: constraintColors[type as keyof typeof constraintColors] || '#666666',
          features: features
        });
      }

      setConstraintLayers(layers);
    } catch (error) {
      console.error('Error loading constraint layers:', error);
    }
  };

  const toggleLayer = (layerId: string) => {
    setConstraintLayers(prev => 
      prev.map(layer => 
        layer.id === layerId 
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    );
  };

  const handleFileUploaded = () => {
    console.log('=== GIS TROUBLESHOOTING: FILE UPLOAD CALLBACK ===');
    console.log('File uploaded, reloading project data...');
    setHasUploadedFile(true);
    setShowFileUpload(false);
    setTimeout(() => {
      console.log('Reloading project data after file upload...');
      loadProjectData();
    }, 1000);
  };

  const groupedLayers = constraintLayers.reduce((acc, layer) => {
    if (!acc[layer.type]) {
      acc[layer.type] = [];
    }
    acc[layer.type].push(layer);
    return acc;
  }, {} as Record<string, ConstraintLayer[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-australis-blue/20 rounded-full border-t-australis-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Developability Score */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <DevelopabilityScore projectId={projectId} />
        </div>
        <div className="flex gap-2">
          <PDFReportGenerator 
            projectId={projectId} 
            projectName={projectData?.name || 'Unnamed Project'}
            analysis={analysisData}
          />
          <Button
            onClick={() => setShowChat(!showChat)}
            className="bg-australis-blue hover:bg-australis-blue/90 text-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {showChat ? 'Hide Chat' : 'Ask Australis'}
          </Button>
        </div>
      </div>

      {/* File Upload (Collapsible) */}
      {(!hasUploadedFile || showFileUpload) && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Project Boundary</CardTitle>
              {hasUploadedFile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFileUpload(!showFileUpload)}
                >
                  {showFileUpload ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </CardHeader>
          {(!hasUploadedFile || showFileUpload) && (
            <CardContent>
              <FileUpload projectId={projectId} onFileUploaded={handleFileUploaded} />
            </CardContent>
          )}
        </Card>
      )}

      {hasUploadedFile && !showFileUpload && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Project boundary uploaded successfully
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFileUpload(true)}
            className="ml-auto text-xs"
          >
            Edit
          </Button>
        </div>
      )}

      {/* Chat Interface */}
      {showChat && (
        <Card>
          <CardContent className="p-0">
            <ConstraintChatInterface 
              analysis={analysisData}
              projectName={projectData?.name || 'Unnamed Project'}
            />
          </CardContent>
        </Card>
      )}

      {/* REPD Analysis - New Section */}
      {projectLocation && (
        <REPDIntegration 
          projectLocation={projectLocation}
          searchRadiusKm={10}
        />
      )}

      {/* Main Map - Full Width when File Uploaded */}
      <div className={hasUploadedFile && !showFileUpload ? "w-full" : "grid grid-cols-1 lg:grid-cols-4 gap-6"}>
        {/* Map */}
        <div className={hasUploadedFile && !showFileUpload ? "w-full" : "lg:col-span-3"}>
          <Card className="h-[700px]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Interactive Analysis Map
                {hasUploadedFile && (
                  <Badge variant="secondary" className="text-xs">
                    Accurate 5km Geometric Buffer Analysis
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[620px]">
              <FunctionalMap 
                boundaryData={boundaryData}
                constraintLayers={constraintLayers}
                onMapReady={(map) => console.log('Map ready:', map)}
                showAnalysisBuffer={true}
                autoShowConstraints={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Layer Controls - Only show when not in full map mode */}
        {(!hasUploadedFile || showFileUpload) && (
          <div className="lg:col-span-1">
            <Card className="h-[700px]">
              <CardHeader>
                <CardTitle className="text-lg">Constraint Layers</CardTitle>
                <p className="text-xs text-gray-500">
                  Constraints within 5km automatically displayed
                </p>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                {Object.entries(groupedLayers).map(([category, layers]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700 capitalize border-b pb-1">
                      {category.replace('_', ' ')}
                    </h4>
                    {layers.map(layer => (
                      <div key={layer.id} className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div 
                            className="w-3 h-3 rounded border flex-shrink-0"
                            style={{ backgroundColor: layer.color }}
                          />
                          <Label 
                            htmlFor={layer.id}
                            className="text-xs cursor-pointer truncate"
                            title={layer.name}
                          >
                            {layer.name}
                          </Label>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {layer.features.length}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ))}
                
                {constraintLayers.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Upload boundary to see constraints
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Constraint Summary when in full map mode */}
      {hasUploadedFile && !showFileUpload && constraintLayers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Constraints Within 5km Analysis Buffer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {constraintLayers.map(layer => (
                <div key={layer.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <div 
                    className="w-3 h-3 rounded flex-shrink-0"
                    style={{ backgroundColor: layer.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{layer.name}</p>
                    <p className="text-xs text-gray-500">{layer.features.length} found</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConsolidatedProjectView;
