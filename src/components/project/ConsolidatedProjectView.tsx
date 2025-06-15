
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
      
      // Check if file exists
      const { data: files, error: fileError } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .eq('processed', true);

      if (fileError) throw fileError;

      if (files && files.length > 0) {
        const file = files[0];
        if (file.geometry_data) {
          setBoundaryData(file.geometry_data);
          setHasUploadedFile(true);
          setShowFileUpload(false);
        }
      }

      await loadConstraintLayers();

    } catch (error) {
      console.error('Error loading project data:', error);
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
          visible: false,
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
    setHasUploadedFile(true);
    setShowFileUpload(false);
    loadProjectData();
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
          <PDFReportGenerator projectId={projectId} />
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
            <ConstraintChatInterface projectId={projectId} />
          </CardContent>
        </Card>
      )}

      {/* Main Map and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle>Interactive Project Map</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[520px]">
              <FunctionalMap 
                boundaryData={boundaryData}
                constraintLayers={constraintLayers}
                onMapReady={(map) => console.log('Map ready:', map)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Layer Controls */}
        <div className="lg:col-span-1">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="text-lg">Constraint Layers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[520px] overflow-y-auto">
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
                      <Switch
                        id={layer.id}
                        checked={layer.visible}
                        onCheckedChange={() => toggleLayer(layer.id)}
                      />
                    </div>
                  ))}
                </div>
              ))}
              
              {constraintLayers.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No constraint data available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedProjectView;
