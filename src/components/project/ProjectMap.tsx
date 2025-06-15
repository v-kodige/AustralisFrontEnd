
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MapboxTokenInput from './MapboxTokenInput';

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    // Check if token is stored in localStorage
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || !mapboxToken) return;

    // Test the token first
    mapboxgl.accessToken = mapboxToken;

    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [-2.3, 53.4], // UK center
        zoom: 6
      });

      mapRef.current.on('load', () => {
        setMapLoaded(true);
        setTokenError(false);
        loadProjectBoundary();
      });

      mapRef.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setTokenError(true);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setTokenError(true);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [mapboxToken]);

  const loadProjectBoundary = async () => {
    if (!mapRef.current || !mapLoaded) return;

    try {
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
          // Convert PostGIS geometry to GeoJSON
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
        }
        
        // Fallback to geometry_data if geom is not available
        if (!geometryData && file.geometry_data) {
          geometryData = file.geometry_data as unknown as GeoJSONData;
        }

        if (geometryData && geometryData.features && geometryData.features.length > 0) {
          // Remove existing layers if they exist
          if (mapRef.current!.getLayer('project-boundary-fill')) {
            mapRef.current!.removeLayer('project-boundary-fill');
          }
          if (mapRef.current!.getLayer('project-boundary-line')) {
            mapRef.current!.removeLayer('project-boundary-line');
          }
          if (mapRef.current!.getSource('project-boundary')) {
            mapRef.current!.removeSource('project-boundary');
          }

          // Add the geometry to the map
          mapRef.current!.addSource('project-boundary', {
            type: 'geojson',
            data: geometryData as any
          });

          mapRef.current!.addLayer({
            id: 'project-boundary-fill',
            type: 'fill',
            source: 'project-boundary',
            paint: {
              'fill-color': '#ef4444',
              'fill-opacity': 0.3
            }
          });

          mapRef.current!.addLayer({
            id: 'project-boundary-line',
            type: 'line',
            source: 'project-boundary',
            paint: {
              'line-color': '#ef4444',
              'line-width': 2
            }
          });

          // Fit map to boundary
          const bounds = new mapboxgl.LngLatBounds();
          geometryData.features.forEach((feature) => {
            if (feature.geometry.type === 'Polygon') {
              const coords = feature.geometry.coordinates[0] as number[][];
              coords.forEach((coord: number[]) => {
                bounds.extend([coord[0], coord[1]]);
              });
            } else if (feature.geometry.type === 'MultiPolygon') {
              const coords = feature.geometry.coordinates as number[][][];
              coords.forEach((polygon) => {
                polygon[0].forEach((coord: number[]) => {
                  bounds.extend([coord[0], coord[1]]);
                });
              });
            }
          });
          
          if (!bounds.isEmpty()) {
            mapRef.current!.fitBounds(bounds, { padding: 50 });
          }
        }
      }
    } catch (error) {
      console.error('Error loading project boundary:', error);
    }
  };

  useEffect(() => {
    if (mapLoaded) {
      loadProjectBoundary();
    }
  }, [projectId, mapLoaded]);

  const handleTokenSet = (token: string) => {
    setMapboxToken(token);
    setTokenError(false);
  };

  if (!mapboxToken) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-australis-navy">Project Map</CardTitle>
        </CardHeader>
        <CardContent className="p-6 h-80 flex items-center justify-center">
          <MapboxTokenInput onTokenSet={handleTokenSet} />
        </CardContent>
      </Card>
    );
  }

  if (tokenError) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-australis-navy">Project Map</CardTitle>
        </CardHeader>
        <CardContent className="p-6 h-80 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Invalid Mapbox token. Please check your token and try again.</p>
            <MapboxTokenInput onTokenSet={handleTokenSet} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-australis-navy">Project Map</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-80">
        <div 
          ref={mapContainerRef} 
          className="w-full h-full rounded-b-lg"
          style={{ minHeight: '320px' }}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectMap;
