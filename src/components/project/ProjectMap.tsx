
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// You'll need to add your Mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'; // This is a sample token

interface ProjectMapProps {
  projectId: string;
}

const ProjectMap = ({ projectId }: ProjectMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-2.3, 53.4], // UK center
      zoom: 6
    });

    mapRef.current.on('load', () => {
      setMapLoaded(true);
      loadProjectBoundary();
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

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
        if (file.geometry_data) {
          // Add the geometry to the map
          mapRef.current!.addSource('project-boundary', {
            type: 'geojson',
            data: file.geometry_data as any
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
          if (file.geometry_data.features) {
            file.geometry_data.features.forEach((feature: any) => {
              if (feature.geometry.coordinates) {
                feature.geometry.coordinates[0].forEach((coord: [number, number]) => {
                  bounds.extend(coord);
                });
              }
            });
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
