
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FunctionalMap from './FunctionalMap';

interface ProjectMapProps {
  projectId: string;
}

interface GeoJSONFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][] | number[][][] | number[][][][];
  };
  properties?: Record<string, any>;
}

interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

const ProjectMap = ({ projectId }: ProjectMapProps) => {
  const [boundaryData, setBoundaryData] = useState<GeoJSONData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectBoundary();
  }, [projectId]);

  const loadProjectBoundary = async () => {
    try {
      setLoading(true);
      const { data: files, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .eq('processed', true);

      if (error) {
        console.error('Error loading project files:', error);
        return;
      }

      if (files && files.length > 0) {
        const file = files[0];
        let geometryData: GeoJSONData | null = null;

        // Try to get geometry from the geom column first (PostGIS)
        if (file.geom) {
          try {
            const { data: geoJsonData, error: geoError } = await supabase
              .rpc('st_asgeojson', { geom: file.geom });
            
            if (!geoError && geoJsonData) {
              geometryData = {
                type: "FeatureCollection",
                features: [{
                  type: "Feature",
                  geometry: JSON.parse(geoJsonData),
                  properties: { name: file.file_name }
                }]
              };
            }
          } catch (geoError) {
            console.log('PostGIS geometry conversion failed, trying geometry_data');
          }
        }
        
        // Fallback to geometry_data if geom is not available
        if (!geometryData && file.geometry_data) {
          geometryData = file.geometry_data as unknown as GeoJSONData;
        }

        if (geometryData) {
          console.log('Loaded boundary data:', geometryData);
          setBoundaryData(geometryData);
        }
      }
    } catch (error) {
      console.error('Error loading project boundary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-australis-navy">Project Map</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-80">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-b-lg">
            <div className="animate-spin w-6 h-6 border-4 border-australis-blue/20 rounded-full border-t-australis-blue"></div>
          </div>
        ) : (
          <div className="w-full h-full">
            <FunctionalMap 
              boundaryData={boundaryData}
              onMapReady={(map) => console.log('Project Map ready:', map)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectMap;
