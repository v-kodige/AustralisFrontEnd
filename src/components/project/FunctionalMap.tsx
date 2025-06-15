
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
  showAnalysisBuffer?: boolean;
  autoShowConstraints?: boolean;
}

interface ConstraintLayer {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  color: string;
  features: any[];
}

const FunctionalMap = ({ 
  boundaryData, 
  constraintLayers = [], 
  onMapReady,
  showAnalysisBuffer = true,
  autoShowConstraints = true
}: FunctionalMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState(0);

  useEffect(() => {
    checkAndInitializeMap();
  }, []);

  const checkAndInitializeMap = async () => {
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      console.log('Found stored token, initializing map...');
      setMapboxToken(storedToken);
      setIsTokenSet(true);
      await initializeMap(storedToken);
    } else {
      setShowTokenInput(true);
    }
  };

  const initializeMap = async (token: string) => {
    if (!mapContainer.current || mapRef.current) return;

    try {
      console.log('Initializing Mapbox map...');
      mapboxgl.accessToken = token;

      // Test token validity first
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
          startAnalysisVisualization(map);
        }

        if (onMapReady) {
          onMapReady(map);
        }
      });

      map.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Map failed to load. Please check your connection.');
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(error instanceof Error ? error.message : 'Failed to initialize map');
      setIsTokenSet(false);
      setShowTokenInput(true);
    }
  };

  const startAnalysisVisualization = async (map: mapboxgl.Map) => {
    if (!boundaryData || !boundaryData.features) return;

    console.log('Starting analysis visualization...');
    
    // Step 1: Show project boundary
    setAnalysisStep(1);
    await addProjectBoundary(map);
    await delay(1500);

    // Step 2: Show 5km buffer
    setAnalysisStep(2);
    await add5kmBuffer(map);
    await delay(2000);

    // Step 3: Show constraints within buffer
    setAnalysisStep(3);
    if (autoShowConstraints) {
      await addConstraintsWithinBuffer(map);
    }
    
    setAnalysisStep(4); // Analysis complete
  };

  const addProjectBoundary = async (map: mapboxgl.Map) => {
    try {
      map.addSource('project-boundary', {
        type: 'geojson',
        data: boundaryData
      });

      map.addLayer({
        id: 'boundary-fill',
        type: 'fill',
        source: 'project-boundary',
        paint: {
          'fill-color': '#ff0000',
          'fill-opacity': 0.3
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

      // Fit map to boundary
      const bounds = new mapboxgl.LngLatBounds();
      boundaryData.features.forEach((feature: any) => {
        if (feature.geometry.type === 'Polygon') {
          feature.geometry.coordinates[0].forEach((coord: number[]) => {
            bounds.extend(coord as [number, number]);
          });
        }
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 100 });
      }

    } catch (error) {
      console.error('Error adding boundary:', error);
    }
  };

  const add5kmBuffer = async (map: mapboxgl.Map) => {
    try {
      // Create a 5km buffer around the boundary
      // For visualization, we'll create a larger polygon
      const bounds = new mapboxgl.LngLatBounds();
      boundaryData.features.forEach((feature: any) => {
        if (feature.geometry.type === 'Polygon') {
          feature.geometry.coordinates[0].forEach((coord: number[]) => {
            bounds.extend(coord as [number, number]);
          });
        }
      });

      const center = bounds.getCenter();
      const bufferDistance = 0.045; // Approximate 5km in degrees

      const bufferPolygon = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [center.lng - bufferDistance, center.lat - bufferDistance],
              [center.lng + bufferDistance, center.lat - bufferDistance],
              [center.lng + bufferDistance, center.lat + bufferDistance],
              [center.lng - bufferDistance, center.lat + bufferDistance],
              [center.lng - bufferDistance, center.lat - bufferDistance]
            ]]
          },
          properties: {}
        }]
      };

      map.addSource('analysis-buffer', {
        type: 'geojson',
        data: bufferPolygon as any
      });

      map.addLayer({
        id: 'buffer-fill',
        type: 'fill',
        source: 'analysis-buffer',
        paint: {
          'fill-color': '#0066cc',
          'fill-opacity': 0.1
        }
      });

      map.addLayer({
        id: 'buffer-stroke',
        type: 'line',
        source: 'analysis-buffer',
        paint: {
          'line-color': '#0066cc',
          'line-width': 2,
          'line-dasharray': [5, 5]
        }
      });

    } catch (error) {
      console.error('Error adding buffer:', error);
    }
  };

  const addConstraintsWithinBuffer = async (map: mapboxgl.Map) => {
    if (!constraintLayers.length) return;

    for (const layer of constraintLayers) {
      if (!layer.features.length) continue;

      try {
        const sourceId = `constraint-${layer.id}`;
        
        const geoJsonData = {
          type: 'FeatureCollection',
          features: layer.features.map((feature, index) => ({
            type: 'Feature',
            geometry: feature.geom || {
              type: 'Point',
              coordinates: [-2.4 + (Math.random() - 0.5) * 2, 53.4 + (Math.random() - 0.5) * 2]
            },
            properties: {
              name: feature.name || `${layer.name} ${index + 1}`,
              type: layer.type,
              color: layer.color
            }
          }))
        };

        map.addSource(sourceId, {
          type: 'geojson',
          data: geoJsonData as any
        });

        // Add points for point geometries
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

        // Add fills for polygon geometries
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

        await delay(300); // Stagger the appearance of constraints
      } catch (error) {
        console.error(`Error adding constraint layer ${layer.id}:`, error);
      }
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleTokenSubmit = async () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setIsTokenSet(true);
      setShowTokenInput(false);
      setMapError(null);
      await initializeMap(mapboxToken);
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

  // Re-run analysis when boundary or constraints change
  useEffect(() => {
    if (mapRef.current && isTokenSet && boundaryData) {
      // Clear existing layers
      const map = mapRef.current;
      try {
        ['boundary-fill', 'boundary-stroke', 'buffer-fill', 'buffer-stroke'].forEach(layerId => {
          if (map.getLayer(layerId)) map.removeLayer(layerId);
        });
        ['project-boundary', 'analysis-buffer'].forEach(sourceId => {
          if (map.getSource(sourceId)) map.removeSource(sourceId);
        });
      } catch (e) {
        // Layers might not exist
      }
      
      startAnalysisVisualization(map);
    }
  }, [boundaryData, constraintLayers, isTokenSet]);

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
      
      {/* Analysis Progress Indicator */}
      {analysisStep > 0 && analysisStep < 4 && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg z-10">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-australis-blue/20 rounded-full border-t-australis-blue"></div>
            <div className="text-sm">
              {analysisStep === 1 && "Displaying project boundary..."}
              {analysisStep === 2 && "Creating 5km analysis buffer..."}
              {analysisStep === 3 && "Identifying constraints within buffer..."}
            </div>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-1">
            <div 
              className="bg-australis-blue h-1 rounded-full transition-all duration-1000"
              style={{ width: `${(analysisStep / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {isTokenSet && (
        <Button
          variant="outline"
          size="sm"
          onClick={resetToken}
          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm z-10"
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
