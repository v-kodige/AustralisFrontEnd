
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AzureMap from './AzureMap';

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

  const renderFallbackMap = () => {
    if (!boundaryData || !boundaryData.features || boundaryData.features.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-b-lg">
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium">No boundary data</p>
            <p className="text-sm">Upload a KML, GeoJSON, or Shapefile to see the boundary</p>
          </div>
        </div>
      );
    }

    // Calculate bounds for the boundary
    let minLat = Infinity, maxLat = -Infinity;
    let minLng = Infinity, maxLng = -Infinity;
    let coordCount = 0;

    boundaryData.features.forEach((feature) => {
      if (feature.geometry.type === 'Polygon') {
        const coords = feature.geometry.coordinates as number[][][];
        coords.forEach((ring) => {
          if (Array.isArray(ring)) {
            ring.forEach((coord) => {
              if (Array.isArray(coord) && coord.length >= 2) {
                const [lng, lat] = coord;
                if (typeof lng === 'number' && typeof lat === 'number') {
                  minLat = Math.min(minLat, lat);
                  maxLat = Math.max(maxLat, lat);
                  minLng = Math.min(minLng, lng);
                  maxLng = Math.max(maxLng, lng);
                  coordCount++;
                }
              }
            });
          }
        });
      } else if (feature.geometry.type === 'MultiPolygon') {
        const coords = feature.geometry.coordinates as number[][][][];
        coords.forEach((polygon) => {
          if (Array.isArray(polygon)) {
            polygon.forEach((ring) => {
              if (Array.isArray(ring)) {
                ring.forEach((coord) => {
                  if (Array.isArray(coord) && coord.length >= 2) {
                    const [lng, lat] = coord;
                    if (typeof lng === 'number' && typeof lat === 'number') {
                      minLat = Math.min(minLat, lat);
                      maxLat = Math.max(maxLat, lat);
                      minLng = Math.min(minLng, lng);
                      maxLng = Math.max(maxLng, lng);
                      coordCount++;
                    }
                  }
                });
              }
            });
          }
        });
      }
    });

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    return (
      <div className="w-full h-full relative bg-blue-50 rounded-b-lg overflow-hidden">
        {/* Simple map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
        
        {/* Grid overlay for map-like appearance */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Boundary visualization */}
        <div className="absolute inset-4 flex items-center justify-center">
          <div className="relative">
            {/* Simple polygon representation */}
            <svg width="200" height="150" viewBox="0 0 200 150">
              <polygon
                points="20,20 180,30 170,120 30,130"
                fill="rgba(239, 68, 68, 0.3)"
                stroke="#ef4444"
                strokeWidth="2"
                className="animate-pulse"
              />
            </svg>
            
            {/* Center marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </div>
        </div>

        {/* Map info overlay */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="text-xs text-gray-600">
            <p className="font-medium">Project Boundary</p>
            <p>Center: {centerLat.toFixed(4)}, {centerLng.toFixed(4)}</p>
            <p>Coordinates: {coordCount}</p>
            <p className="text-australis-blue">📍 Fallback map view</p>
          </div>
        </div>
      </div>
    );
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
          <>
            {/* Try Azure Maps first, fallback to simple visualization */}
            <div className="w-full h-full">
              <AzureMap 
                boundaryData={boundaryData}
                onMapReady={(map) => console.log('Azure Map ready:', map)}
              />
            </div>
            {/* Uncomment below to use fallback map instead */}
            {/* {renderFallbackMap()} */}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectMap;
