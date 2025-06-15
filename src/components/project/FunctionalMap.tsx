
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      console.log('Found stored token:', storedToken.substring(0, 10) + '...');
      setMapboxToken(storedToken);
      setIsTokenSet(true);
      setShowTokenInput(false);
      initializeMap(storedToken);
    }
  }, []);

  const initializeMap = async (token: string) => {
    if (!mapContainer.current || mapRef.current) return;

    try {
      console.log('Setting Mapbox token and initializing map...');
      mapboxgl.accessToken = token;

      // Test token validity
      const testResponse = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/london.json?access_token=${token}`);
      if (!testResponse.ok) {
        throw new Error('Invalid Mapbox token');
      }

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [-2.4, 53.4], // UK center
        zoom: 6
      });

      mapRef.current = map;

      map.on('load', () => {
        console.log('Map loaded successfully');
        setMapError(null);
        
        if (boundaryData) {
          addBoundaryToMap(map, boundaryData);
        }

        if (constraintLayers.length > 0) {
          addConstraintLayers(map, constraintLayers);
        }

        if (onMapReady) {
          onMapReady(map);
        }
      });

      map.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Map failed to load. Please check your token.');
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(error instanceof Error ? error.message : 'Failed to initialize map');
      setIsTokenSet(false);
      setShowTokenInput(true);
    }
  };

  const addBoundaryToMap = (map: mapboxgl.Map, data: any) => {
    if (!data || !data.features) return;

    try {
      map.addSource('project-boundary', {
        type: 'geojson',
        data: data
      });

      map.addLayer({
        id: 'boundary-fill',
        type: 'fill',
        source: 'project-boundary',
        paint: {
          'fill-color': '#ff0000',
          'fill-opacity': 0.2
        }
      });

      map.addLayer({
        id: 'boundary-stroke',
        type: 'line',
        source: 'project-boundary',
        paint: {
          'line-color': '#ff0000',
          'line-width': 3
        }
      });

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
    layers.forEach((layer) => {
      if (!layer.visible || !layer.features.length) return;

      try {
        const sourceId = `constraint-${layer.id}`;
        
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

        map.addSource(sourceId, {
          type: 'geojson',
          data: geoJsonData as any
        });

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
      setMapError(null);
      initializeMap(mapboxToken);
    }
  };

  const resetToken = () => {
    localStorage.removeItem('mapbox_token');
    setMapboxToken('');
    setIsTokenSet(false);
    setShowTokenInput(true);
    setMapError(null);
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  };

  useEffect(() => {
    if (mapRef.current && isTokenSet) {
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

      Object.keys(style.sources || {}).forEach(sourceId => {
        if (sourceId.startsWith('constraint-')) {
          try {
            map.removeSource(sourceId);
          } catch (error) {
            // Source might not exist
          }
        }
      });

      addConstraintLayers(map, constraintLayers);
    }
  }, [constraintLayers, isTokenSet]);

  if (showTokenInput) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent className="text-center space-y-4 p-6">
          <CardTitle>Mapbox Token Required</CardTitle>
          <p className="text-sm text-gray-600">
            Get your free token at: <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">mapbox.com</a>
          </p>
          {mapError && (
            <p className="text-sm text-red-600">{mapError}</p>
          )}
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
          className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm z-10"
        >
          Change Token
        </Button>
      )}
      
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
          <div className="text-center">
            <p className="text-red-600 mb-2">{mapError}</p>
            <Button onClick={resetToken} variant="outline">
              Reset Token
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FunctionalMap;
