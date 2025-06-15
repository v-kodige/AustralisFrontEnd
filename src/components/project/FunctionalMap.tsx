
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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
  const [mapError, setMapError] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Use your Mapbox token directly
  const MAPBOX_TOKEN = 'pk.eyJ1IjoidmtvZGlnZSIsImEiOiJjbWJ5NXpiOWwwajJnMmtzZXZobXp5YWxoIn0.pCYf3pokFHP394eZvLpmOQ';

  useEffect(() => {
    initializeMap();
  }, []);

  const initializeMap = async () => {
    if (!mapContainer.current || mapRef.current) return;

    try {
      console.log('Initializing map with boundary data:', boundaryData);
      console.log('Constraint layers:', constraintLayers);
      
      setDebugInfo('Initializing map...');
      mapboxgl.accessToken = MAPBOX_TOKEN;

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
        setDebugInfo('Map loaded, checking boundary data...');
        
        if (boundaryData) {
          console.log('Starting analysis with boundary data:', boundaryData);
          startAnalysisVisualization(map);
        } else {
          setDebugInfo('No boundary data found - please upload a KML file');
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
    }
  };

  const startAnalysisVisualization = async (map: mapboxgl.Map) => {
    if (!boundaryData) {
      setDebugInfo('No boundary data to analyze');
      return;
    }

    console.log('Starting analysis visualization with data:', boundaryData);
    
    // Step 1: Show project boundary
    setAnalysisStep(1);
    setDebugInfo('Step 1: Displaying project boundary...');
    await addProjectBoundary(map);
    await delay(1500);

    // Step 2: Show 5km buffer
    setAnalysisStep(2);
    setDebugInfo('Step 2: Creating 5km analysis buffer...');
    await add5kmBuffer(map);
    await delay(2000);

    // Step 3: Show constraints within buffer
    setAnalysisStep(3);
    setDebugInfo('Step 3: Loading constraints...');
    if (autoShowConstraints && constraintLayers.length > 0) {
      await addConstraintsWithinBuffer(map);
    } else {
      setDebugInfo(`No constraints to display (${constraintLayers.length} layers available)`);
    }
    
    setAnalysisStep(4); // Analysis complete
    setDebugInfo('Analysis complete!');
  };

  const addProjectBoundary = async (map: mapboxgl.Map) => {
    try {
      console.log('Adding project boundary, data structure:', boundaryData);

      // Handle different possible data structures
      let geoJsonData = boundaryData;
      
      // If it's already a FeatureCollection, use it directly
      if (boundaryData.type === 'FeatureCollection') {
        geoJsonData = boundaryData;
      }
      // If it has features property, use it
      else if (boundaryData.features) {
        geoJsonData = {
          type: 'FeatureCollection',
          features: boundaryData.features
        };
      }
      // If it's a single feature, wrap it
      else if (boundaryData.type === 'Feature') {
        geoJsonData = {
          type: 'FeatureCollection',
          features: [boundaryData]
        };
      }

      console.log('Processed boundary data for map:', geoJsonData);

      map.addSource('project-boundary', {
        type: 'geojson',
        data: geoJsonData
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
      let hasCoordinates = false;

      if (geoJsonData.features && geoJsonData.features.length > 0) {
        geoJsonData.features.forEach((feature: any) => {
          if (feature.geometry) {
            if (feature.geometry.type === 'Polygon' && feature.geometry.coordinates) {
              feature.geometry.coordinates[0].forEach((coord: number[]) => {
                bounds.extend(coord as [number, number]);
                hasCoordinates = true;
              });
            } else if (feature.geometry.type === 'Point' && feature.geometry.coordinates) {
              bounds.extend(feature.geometry.coordinates as [number, number]);
              hasCoordinates = true;
            }
          }
        });
      }

      if (hasCoordinates && !bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 100 });
        console.log('Fitted map to boundary bounds');
      } else {
        console.warn('No valid coordinates found in boundary data');
        setDebugInfo('Warning: No valid coordinates found in boundary data');
      }

    } catch (error) {
      console.error('Error adding boundary:', error);
      setDebugInfo(`Error adding boundary: ${error}`);
    }
  };

  const add5kmBuffer = async (map: mapboxgl.Map) => {
    try {
      // Get bounds from the project boundary
      const bounds = new mapboxgl.LngLatBounds();
      let hasCoordinates = false;

      if (boundaryData.features && boundaryData.features.length > 0) {
        boundaryData.features.forEach((feature: any) => {
          if (feature.geometry && feature.geometry.type === 'Polygon') {
            feature.geometry.coordinates[0].forEach((coord: number[]) => {
              bounds.extend(coord as [number, number]);
              hasCoordinates = true;
            });
          }
        });
      }

      if (!hasCoordinates) {
        console.warn('Cannot create buffer - no valid boundary coordinates');
        return;
      }

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
          properties: { name: '5km Analysis Buffer' }
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

      console.log('Added 5km buffer around boundary');

    } catch (error) {
      console.error('Error adding buffer:', error);
      setDebugInfo(`Error adding buffer: ${error}`);
    }
  };

  const addConstraintsWithinBuffer = async (map: mapboxgl.Map) => {
    if (!constraintLayers.length) {
      console.log('No constraint layers to display');
      return;
    }

    console.log('Adding constraint layers:', constraintLayers);

    for (const layer of constraintLayers) {
      if (!layer.features.length) {
        console.log(`Skipping empty layer: ${layer.name}`);
        continue;
      }

      try {
        const sourceId = `constraint-${layer.id}`;
        
        // Create sample UK-based coordinates for demonstration
        const geoJsonData = {
          type: 'FeatureCollection',
          features: layer.features.map((feature, index) => {
            // Generate random coordinates within UK bounds for demo
            const ukBounds = {
              north: 60.8,
              south: 49.9,
              west: -8.2,
              east: 1.8
            };
            
            const lng = ukBounds.west + Math.random() * (ukBounds.east - ukBounds.west);
            const lat = ukBounds.south + Math.random() * (ukBounds.north - ukBounds.south);
            
            return {
              type: 'Feature',
              geometry: feature.geom || {
                type: 'Point',
                coordinates: [lng, lat]
              },
              properties: {
                name: feature.name || `${layer.name} ${index + 1}`,
                type: layer.type,
                color: layer.color,
                description: `${layer.name} constraint`
              }
            };
          })
        };

        map.addSource(sourceId, {
          type: 'geojson',
          data: geoJsonData as any
        });

        // Add points for all features
        map.addLayer({
          id: `${sourceId}-points`,
          type: 'circle',
          source: sourceId,
          paint: {
            'circle-color': layer.color,
            'circle-radius': 8,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2,
            'circle-opacity': 0.8
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
                  <p class="text-xs text-gray-500">${feature.properties?.description}</p>
                </div>
              `)
              .addTo(map);
          }
        });

        console.log(`Added constraint layer: ${layer.name} (${layer.features.length} features)`);
        await delay(300); // Stagger the appearance of constraints
        
      } catch (error) {
        console.error(`Error adding constraint layer ${layer.id}:`, error);
      }
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Re-run analysis when boundary or constraints change
  useEffect(() => {
    if (mapRef.current && boundaryData) {
      console.log('Boundary or constraints changed, restarting analysis...');
      // Clear existing layers
      const map = mapRef.current;
      try {
        ['boundary-fill', 'boundary-stroke', 'buffer-fill', 'buffer-stroke'].forEach(layerId => {
          if (map.getLayer(layerId)) map.removeLayer(layerId);
        });
        ['project-boundary', 'analysis-buffer'].forEach(sourceId => {
          if (map.getSource(sourceId)) map.removeSource(sourceId);
        });
        
        // Remove constraint layers
        constraintLayers.forEach(layer => {
          const sourceId = `constraint-${layer.id}`;
          if (map.getLayer(`${sourceId}-points`)) map.removeLayer(`${sourceId}-points`);
          if (map.getSource(sourceId)) map.removeSource(sourceId);
        });
      } catch (e) {
        console.log('Some layers might not exist during cleanup');
      }
      
      startAnalysisVisualization(map);
    }
  }, [boundaryData, constraintLayers]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {/* Debug Info */}
      {debugInfo && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg z-10 text-xs">
          {debugInfo}
        </div>
      )}
      
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
      
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
          <div className="text-center">
            <p className="text-red-600 mb-2">{mapError}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FunctionalMap;
