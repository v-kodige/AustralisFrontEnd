import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const [realConstraints, setRealConstraints] = useState<any[]>([]);

  const MAPBOX_TOKEN = 'pk.eyJ1IjoidmtvZGlnZSIsImEiOiJjbWJ5NXpiOWwwajJnMmtzZXZobXp5YWxoIn0.pCYf3pokFHP394eZvLpmOQ';

  useEffect(() => {
    initializeMap();
  }, []);

  const initializeMap = async () => {
    if (!mapContainer.current || mapRef.current) return;

    try {
      console.log('=== MAP INITIALIZATION ===');
      setDebugInfo('Initializing map...');
      mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [-2.4, 53.4],
        zoom: 6
      });

      mapRef.current = map;

      map.on('load', () => {
        console.log('✅ Map loaded successfully');
        setMapError(null);
        setDebugInfo('Map loaded, processing boundary data...');
        
        if (boundaryData) {
          console.log('=== STARTING BOUNDARY ANALYSIS FROM MAP ===');
          console.log('Boundary data received in map:', JSON.stringify(boundaryData, null, 2));
          startAnalysisVisualization(map);
        } else {
          setDebugInfo('No boundary data found - please upload a KML file');
        }

        if (onMapReady) {
          onMapReady(map);
        }
      });

      map.on('error', (e) => {
        console.error('❌ Map error:', e);
        setMapError('Map failed to load. Please check your connection.');
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    } catch (error) {
      console.error('❌ Error initializing map:', error);
      setMapError(error instanceof Error ? error.message : 'Failed to initialize map');
    }
  };

  const startAnalysisVisualization = async (map: mapboxgl.Map) => {
    console.log('=== GIS TROUBLESHOOTING: MAP VISUALIZATION START ===');
    console.log('1. Boundary data input to map:', boundaryData);
    
    if (!boundaryData) {
      setDebugInfo('No boundary data to analyze');
      console.log('❌ No boundary data provided to startAnalysisVisualization');
      return;
    }

    console.log('2. Boundary data type:', typeof boundaryData);
    console.log('3. Boundary data structure:', JSON.stringify(boundaryData, null, 2));
    
    // Step 1: Show project boundary
    setAnalysisStep(1);
    setDebugInfo('Step 1: Displaying project boundary...');
    console.log('4. Starting boundary display process...');
    const boundingBox = await addProjectBoundary(map);
    
    if (!boundingBox) {
      setDebugInfo('Error: Could not create boundary from KML data');
      console.log('❌ Boundary creation failed');
      return;
    }
    
    await delay(1500);

    // Step 2: Show 5km buffer
    setAnalysisStep(2);
    setDebugInfo('Step 2: Creating 5km analysis buffer...');
    await add5kmBuffer(map, boundingBox);
    await delay(2000);

    // Step 3: Fetch and show real constraints
    setAnalysisStep(3);
    setDebugInfo('Step 3: Fetching real planning constraints...');
    await fetchAndDisplayRealConstraints(map, boundingBox);
    
    setAnalysisStep(4);
    setDebugInfo('Analysis complete!');
  };

  const addProjectBoundary = async (map: mapboxgl.Map) => {
    try {
      console.log('=== GIS TROUBLESHOOTING: BOUNDARY PROCESSING START ===');
      console.log('1. addProjectBoundary called with data:', boundaryData);

      if (!boundaryData) {
        console.error('❌ No boundary data provided to addProjectBoundary');
        setDebugInfo('Error: No boundary data provided');
        return null;
      }

      let geoJsonData = null;
      let bounds = new mapboxgl.LngLatBounds();

      console.log('2. Analyzing boundary data structure...');
      console.log('   - Type:', boundaryData.type);
      console.log('   - Has features:', !!boundaryData.features);
      console.log('   - Features type:', Array.isArray(boundaryData.features) ? 'array' : typeof boundaryData.features);

      // Handle different data structures more robustly
      if (boundaryData.type === 'FeatureCollection') {
        geoJsonData = boundaryData;
        console.log('3. Using FeatureCollection format directly');
      } else if (boundaryData.features && Array.isArray(boundaryData.features)) {
        geoJsonData = {
          type: 'FeatureCollection',
          features: boundaryData.features
        };
        console.log('3. Converting to FeatureCollection format');
      } else if (boundaryData.type === 'Feature') {
        geoJsonData = {
          type: 'FeatureCollection',
          features: [boundaryData]
        };
        console.log('3. Converting single Feature to FeatureCollection');
      } else {
        console.error('❌ Unrecognized boundary data structure:', boundaryData);
        setDebugInfo('Error: Unrecognized boundary data format');
        return null;
      }

      console.log('4. Final processed GeoJSON data:', JSON.stringify(geoJsonData, null, 2));

      // Validate and extract coordinates
      if (geoJsonData.features && geoJsonData.features.length > 0) {
        console.log(`5. Processing ${geoJsonData.features.length} features for coordinate extraction`);
        
        geoJsonData.features.forEach((feature: any, index: number) => {
          console.log(`=== FEATURE ${index + 1} ANALYSIS ===`);
          console.log('Feature:', JSON.stringify(feature, null, 2));
          
          if (feature.geometry) {
            console.log('Geometry type:', feature.geometry.type);
            console.log('Coordinates:', feature.geometry.coordinates);
            
            // Handle different geometry types
            switch (feature.geometry.type) {
              case 'Polygon':
                if (feature.geometry.coordinates && feature.geometry.coordinates[0]) {
                  console.log(`Processing Polygon with ${feature.geometry.coordinates[0].length} coordinates`);
                  feature.geometry.coordinates[0].forEach((coord: number[], coordIndex: number) => {
                    if (coord.length >= 2 && !isNaN(coord[0]) && !isNaN(coord[1])) {
                      bounds.extend([coord[0], coord[1]]);
                      console.log(`✓ Added coordinate ${coordIndex + 1}: [${coord[0]}, ${coord[1]}]`);
                    } else {
                      console.warn(`❌ Invalid coordinate at ${coordIndex + 1}:`, coord);
                    }
                  });
                }
                break;
              case 'Point':
                if (feature.geometry.coordinates && feature.geometry.coordinates.length >= 2) {
                  bounds.extend([feature.geometry.coordinates[0], feature.geometry.coordinates[1]]);
                  console.log('✓ Added point coordinate:', feature.geometry.coordinates);
                }
                break;
              case 'LineString':
                if (feature.geometry.coordinates) {
                  console.log(`Processing LineString with ${feature.geometry.coordinates.length} coordinates`);
                  feature.geometry.coordinates.forEach((coord: number[], coordIndex: number) => {
                    if (coord.length >= 2 && !isNaN(coord[0]) && !isNaN(coord[1])) {
                      bounds.extend([coord[0], coord[1]]);
                      console.log(`✓ Added line coordinate ${coordIndex + 1}: [${coord[0]}, ${coord[1]}]`);
                    }
                  });
                }
                break;
              default:
                console.warn('❌ Unsupported geometry type:', feature.geometry.type);
            }
          } else {
            console.warn('❌ Feature missing geometry:', feature);
          }
        });
      }

      if (bounds.isEmpty()) {
        console.error('❌ No valid coordinates found in boundary data');
        setDebugInfo('Error: No valid coordinates found in KML file');
        return null;
      }

      console.log('6. Final bounds calculated:');
      console.log('   - NorthEast:', bounds.getNorthEast());
      console.log('   - SouthWest:', bounds.getSouthWest());
      console.log('   - Center:', bounds.getCenter());

      // Add source and layers
      console.log('7. Adding boundary to map...');
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
      console.log('8. Fitting map to boundary...');
      map.fitBounds(bounds, { padding: 100 });
      console.log('✅ Successfully displayed boundary and fitted map');

      return bounds;

    } catch (error) {
      console.error('❌ Error adding boundary:', error);
      setDebugInfo(`Error displaying boundary: ${error}`);
      return null;
    }
  };

  const add5kmBuffer = async (map: mapboxgl.Map, bounds: mapboxgl.LngLatBounds | null) => {
    if (!bounds) return;

    try {
      const center = bounds.getCenter();
      const bufferDistance = 0.045;

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

      console.log('✅ Added 5km buffer around boundary');

    } catch (error) {
      console.error('❌ Error adding buffer:', error);
      setDebugInfo(`Error adding buffer: ${error}`);
    }
  };

  const fetchAndDisplayRealConstraints = async (map: mapboxgl.Map, bounds: mapboxgl.LngLatBounds | null) => {
    if (!bounds) return;

    try {
      const center = bounds.getCenter();
      const constraints = await fetchRealConstraintData(center.lat, center.lng);
      
      console.log('Fetched real constraints:', constraints);
      setRealConstraints(constraints);

      for (const constraint of constraints) {
        await displayConstraintLayer(map, constraint);
        await delay(300);
      }

    } catch (error) {
      console.error('Error fetching real constraints:', error);
      setDebugInfo('Using demo constraint data due to API limitations');
      await addDemoConstraints(map, bounds);
    }
  };

  const fetchRealConstraintData = async (lat: number, lng: number) => {
    const constraints = [];

    try {
      const ancientWoodlandResponse = await fetch(
        `https://services.arcgis.com/JJzESW51TqeY9uat/arcgis/rest/services/Ancient_Woodland_England/FeatureServer/0/query?f=geojson&where=1=1&geometry=${lng-0.05},${lat-0.05},${lng+0.05},${lat+0.05}&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects`
      );
      
      if (ancientWoodlandResponse.ok) {
        const ancientWoodlandData = await ancientWoodlandResponse.json();
        constraints.push({
          id: 'ancient_woodland',
          name: 'Ancient Woodland',
          type: 'environmental',
          color: '#228B22',
          features: ancientWoodlandData.features || []
        });
      }
    } catch (error) {
      console.log('Could not fetch Ancient Woodland data:', error);
    }

    try {
      const listedBuildingsResponse = await fetch(
        `https://services.arcgis.com/JJzESW51TqeY9uat/arcgis/rest/services/National_Heritage_List_for_England_NHLE/FeatureServer/0/query?f=geojson&where=1=1&geometry=${lng-0.05},${lat-0.05},${lng+0.05},${lat+0.05}&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects`
      );
      
      if (listedBuildingsResponse.ok) {
        const listedBuildingsData = await listedBuildingsResponse.json();
        constraints.push({
          id: 'listed_buildings',
          name: 'Listed Buildings',
          type: 'heritage',
          color: '#800080',
          features: listedBuildingsData.features || []
        });
      }
    } catch (error) {
      console.log('Could not fetch Listed Buildings data:', error);
    }

    try {
      const sssiResponse = await fetch(
        `https://services.arcgis.com/JJzESW51TqeY9uat/arcgis/rest/services/SSSI_England/FeatureServer/0/query?f=geojson&where=1=1&geometry=${lng-0.05},${lat-0.05},${lng+0.05},${lat+0.05}&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects`
      );
      
      if (sssiResponse.ok) {
        const sssiData = await sssiResponse.json();
        constraints.push({
          id: 'sssi',
          name: 'Sites of Special Scientific Interest',
          type: 'environmental',
          color: '#ff0000',
          features: sssiData.features || []
        });
      }
    } catch (error) {
      console.log('Could not fetch SSSI data:', error);
    }

    return constraints;
  };

  const displayConstraintLayer = async (map: mapboxgl.Map, constraint: any) => {
    if (!constraint.features.length) return;

    const sourceId = `constraint-${constraint.id}`;

    try {
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: constraint.features
        }
      });

      const firstFeature = constraint.features[0];
      if (firstFeature?.geometry?.type === 'Polygon' || firstFeature?.geometry?.type === 'MultiPolygon') {
        map.addLayer({
          id: `${sourceId}-fill`,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': constraint.color,
            'fill-opacity': 0.4
          }
        });

        map.addLayer({
          id: `${sourceId}-stroke`,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': constraint.color,
            'line-width': 2
          }
        });
      } else {
        map.addLayer({
          id: `${sourceId}-points`,
          type: 'circle',
          source: sourceId,
          paint: {
            'circle-color': constraint.color,
            'circle-radius': 6,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2
          }
        });
      }

      map.on('click', `${sourceId}-fill`, (e) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold">${constraint.name}</h3>
                <p class="text-sm">${feature.properties?.NAME || feature.properties?.name || 'Constraint'}</p>
              </div>
            `)
            .addTo(map);
        }
      });

      console.log(`✅ Added real constraint layer: ${constraint.name} (${constraint.features.length} features)`);

    } catch (error) {
      console.error(`❌ Error adding constraint layer ${constraint.id}:`, error);
    }
  };

  const addDemoConstraints = async (map: mapboxgl.Map, bounds: mapboxgl.LngLatBounds) => {
    const center = bounds.getCenter();
    const demoConstraints = [
      {
        id: 'demo_sssi',
        name: 'SSSI (Demo)',
        color: '#ff0000',
        coordinates: [center.lng + 0.01, center.lat + 0.01]
      },
      {
        id: 'demo_listed',
        name: 'Listed Building (Demo)', 
        color: '#800080',
        coordinates: [center.lng - 0.01, center.lat + 0.015]
      },
      {
        id: 'demo_woodland',
        name: 'Ancient Woodland (Demo)',
        color: '#228B22', 
        coordinates: [center.lng + 0.02, center.lat - 0.01]
      }
    ];

    for (const constraint of demoConstraints) {
      const sourceId = `demo-${constraint.id}`;
      
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: constraint.coordinates
            },
            properties: { name: constraint.name }
          }]
        }
      });

      map.addLayer({
        id: `${sourceId}-points`,
        type: 'circle',
        source: sourceId,
        paint: {
          'circle-color': constraint.color,
          'circle-radius': 8,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2
        }
      });

      await delay(200);
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Re-run analysis when boundary changes
  useEffect(() => {
    console.log('=== BOUNDARY DATA CHANGE DETECTED ===');
    console.log('Previous boundary data exists:', !!boundaryData);
    console.log('Map exists:', !!mapRef.current);
    console.log('New boundary data:', boundaryData);
    
    if (mapRef.current && boundaryData) {
      console.log('🔄 Map exists and boundary data provided, restarting analysis...');
      const map = mapRef.current;
      try {
        const layersToRemove = ['boundary-fill', 'boundary-stroke', 'buffer-fill', 'buffer-stroke'];
        layersToRemove.forEach(layerId => {
          if (map.getLayer(layerId)) {
            console.log('Removing layer:', layerId);
            map.removeLayer(layerId);
          }
        });

        const sourcesToRemove = ['project-boundary', 'analysis-buffer'];
        sourcesToRemove.forEach(sourceId => {
          if (map.getSource(sourceId)) {
            console.log('Removing source:', sourceId);
            map.removeSource(sourceId);
          }
        });

        realConstraints.forEach(constraint => {
          const sourceId = `constraint-${constraint.id}`;
          [`${sourceId}-fill`, `${sourceId}-stroke`, `${sourceId}-points`].forEach(layerId => {
            if (map.getLayer(layerId)) map.removeLayer(layerId);
          });
          if (map.getSource(sourceId)) map.removeSource(sourceId);
        });

      } catch (e) {
        console.log('Some layers might not exist during cleanup:', e);
      }
      
      startAnalysisVisualization(map);
    } else {
      console.log('❌ Cannot restart analysis:', {
        mapExists: !!mapRef.current,
        boundaryData: !!boundaryData
      });
    }
  }, [boundaryData]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {debugInfo && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg z-10 text-xs max-w-md">
          {debugInfo}
        </div>
      )}
      
      {analysisStep > 0 && analysisStep < 4 && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg z-10">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-australis-blue/20 rounded-full border-t-australis-blue"></div>
            <div className="text-sm">
              {analysisStep === 1 && "Displaying project boundary..."}
              {analysisStep === 2 && "Creating 5km analysis buffer..."}
              {analysisStep === 3 && "Fetching real planning constraints..."}
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
