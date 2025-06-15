
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface FunctionalMapProps {
  boundaryData: any;
  constraintLayers?: ConstraintLayer[];
  onMapReady?: (map: mapboxgl.Map) => void;
}

interface ConstraintLayer {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  color: string;
  features: any[];
}

const FunctionalMap = ({ boundaryData, constraintLayers = [], onMapReady }: FunctionalMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(true);

  useEffect(() => {
    // Check if we have a stored token
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
      setIsTokenSet(true);
      setShowTokenInput(false);
      initializeMap(storedToken);
    }
  }, []);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = token;

    try {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [-2.4, 53.4], // UK center
        zoom: 6
      });

      mapRef.current = map;

      map.on('load', () => {
        console.log('Map loaded successfully');
        
        // Add boundary data if available
        if (boundaryData) {
          addBoundaryToMap(map, boundaryData);
        }

        // Add constraint layers
        if (constraintLayers.length > 0) {
          addConstraintLayers(map, constraintLayers);
        }

        if (onMapReady) {
          onMapReady(map);
        }
      });

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const addBoundaryToMap = (map: mapboxgl.Map, data: any) => {
    if (!data || !data.features) return;

    try {
      // Add source for boundary
      map.addSource('project-boundary', {
        type: 'geojson',
        data: data
      });

      // Add fill layer
      map.addLayer({
        id: 'boundary-fill',
        type: 'fill',
        source: 'project-boundary',
        paint: {
          'fill-color': '#ff0000',
          'fill-opacity': 0.2
        }
      });

      // Add stroke layer
      map.addLayer({
        id: 'boundary-stroke',
        type: 'line',
        source: 'project-boundary',
        paint: {
          'line-color': '#ff0000',
          'line-width': 3
        }
      });

      // Fit map to boundary
      const bounds = new mapboxgl.LngLatBounds();
      data.features.forEach((feature: any) => {
        if (feature.geometry.type === 'Polygon') {
          feature.geometry.coordinates[0].forEach((coord: number[]) => {
            bounds.extend(coord as [number, number]);
          });
        }
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 50 });
      }

    } catch (error) {
      console.error('Error adding boundary to map:', error);
    }
  };

  const addConstraintLayers = (map: mapboxgl.Map, layers: ConstraintLayer[]) => {
    layers.forEach((layer, index) => {
      if (!layer.visible || !layer.features.length) return;

      try {
        const sourceId = `constraint-${layer.id}`;
        
        // Create GeoJSON from constraint features
        const geoJsonData = {
          type: 'FeatureCollection',
          features: layer.features.map(feature => ({
            type: 'Feature',
            geometry: feature.geom || { type: 'Point', coordinates: [-2.4, 53.4] },
            properties: {
              name: feature.name || layer.name,
              type: layer.type
            }
          }))
        };

        // Add source
        map.addSource(sourceId, {
          type: 'geojson',
          data: geoJsonData as any
        });

        // Add circle layer for point features
        map.addLayer({
          id: `${sourceId}-points`,
          type: 'circle',
          source: sourceId,
          filter: ['==', ['geometry-type'], 'Point'],
          paint: {
            'circle-color': layer.color,
            'circle-radius': 8,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2,
            'circle-opacity': 0.8
          }
        });

        // Add fill layer for polygon features
        map.addLayer({
          id: `${sourceId}-fill`,
          type: 'fill',
          source: sourceId,
          filter: ['==', ['geometry-type'], 'Polygon'],
          paint: {
            'fill-color': layer.color,
            'fill-opacity': 0.3
          }
        });

        // Add line layer for polygon outlines
        map.addLayer({
          id: `${sourceId}-line`,
          type: 'line',
          source: sourceId,
          filter: ['==', ['geometry-type'], 'Polygon'],
          paint: {
            'line-color': layer.color,
            'line-width': 2
          }
        });

        // Add popup on click
        map.on('click', `${sourceId}-points`, (e) => {
          if (e.features && e.features[0]) {
            const feature = e.features[0];
            new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-bold">${feature.properties?.name}</h3>
                  <p class="text-sm text-gray-600">${layer.name}</p>
                </div>
              `)
              .addTo(map);
          }
        });

      } catch (error) {
        console.error(`Error adding layer ${layer.id}:`, error);
      }
    });
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setIsTokenSet(true);
      setShowTokenInput(false);
      initializeMap(mapboxToken);
    }
  };

  const resetToken = () => {
    localStorage.removeItem('mapbox_token');
    setMapboxToken('');
    setIsTokenSet(false);
    setShowTokenInput(true);
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  };

  // Update constraint layers when they change
  useEffect(() => {
    if (mapRef.current && isTokenSet) {
      // Clear existing constraint layers
      const map = mapRef.current;
      const style = map.getStyle();
      
      if (style.layers) {
        style.layers.forEach((layer: any) => {
          if (layer.id.startsWith('constraint-')) {
            try {
              map.removeLayer(layer.id);
            } catch (error) {
              // Layer might not exist
            }
          }
        });
      }

      // Clear existing constraint sources
      Object.keys(style.sources || {}).forEach(sourceId => {
        if (sourceId.startsWith('constraint-')) {
          try {
            map.removeSource(sourceId);
          } catch (error) {
            // Source might not exist
          }
        }
      });

      // Re-add constraint layers
      addConstraintLayers(map, constraintLayers);
    }
  }, [constraintLayers, isTokenSet]);

  if (showTokenInput) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent className="text-center space-y-4 p-6">
          <CardTitle>Mapbox Token Required</CardTitle>
          <p className="text-sm text-gray-600">
            To display the interactive map, please enter your Mapbox public token.
            <br />
            Get yours at: <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">mapbox.com</a>
          </p>
          <div className="flex gap-2 max-w-md">
            <Input
              type="text"
              placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIi..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleTokenSubmit} disabled={!mapboxToken.trim()}>
              Set Token
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {isTokenSet && (
        <Button
          variant="outline"
          size="sm"
          onClick={resetToken}
          className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm"
        >
          Change Token
        </Button>
      )}
    </div>
  );
};

export default FunctionalMap;
