
import { useEffect, useRef, useState } from 'react';
import * as atlas from 'azure-maps-control';

interface AzureMapProps {
  boundaryData: any;
  onMapReady?: (map: atlas.Map) => void;
}

const AzureMap = ({ boundaryData, onMapReady }: AzureMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<atlas.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    // Check if Azure Maps is available and try to initialize
    const initializeMap = async () => {
      try {
        // Try to initialize with a timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Map initialization timeout')), 5000)
        );

        const mapPromise = new Promise((resolve, reject) => {
          try {
            const map = new atlas.Map(mapRef.current!, {
              center: [-2.4, 53.4],
              zoom: 6,
              view: 'Auto',
              // Note: Authentication would be required for production
            });

            mapInstanceRef.current = map;

            map.events.add('ready', () => {
              console.log('Azure Map is ready');
              if (boundaryData && boundaryData.features) {
                addBoundaryToMap(map, boundaryData);
              }
              if (onMapReady) {
                onMapReady(map);
              }
              resolve(map);
            });

            map.events.add('error', (error) => {
              console.error('Azure Map error:', error);
              reject(error);
            });

          } catch (error) {
            reject(error);
          }
        });

        await Promise.race([mapPromise, timeoutPromise]);

      } catch (error) {
        console.error('Error initializing Azure Maps:', error);
        setMapError('Azure Maps requires authentication for full functionality');
        setShowFallback(true);
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.dispose();
        } catch (error) {
          console.error('Error disposing map:', error);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && boundaryData) {
      addBoundaryToMap(mapInstanceRef.current, boundaryData);
    }
  }, [boundaryData]);

  const addBoundaryToMap = (map: atlas.Map, data: any) => {
    try {
      const dataSource = new atlas.source.DataSource();
      map.sources.add(dataSource);

      if (data.features && data.features.length > 0) {
        data.features.forEach((feature: any) => {
          dataSource.add(new atlas.data.Feature(feature.geometry, feature.properties));
        });

        map.layers.add(new atlas.layer.PolygonLayer(dataSource, undefined, {
          fillColor: 'rgba(255, 0, 0, 0.2)',
          fillOpacity: 0.3
        }));

        map.layers.add(new atlas.layer.LineLayer(dataSource, undefined, {
          strokeColor: '#ff0000',
          strokeWidth: 2
        }));

        const bounds = atlas.data.BoundingBox.fromData(data);
        map.setCamera({
          bounds: bounds,
          padding: 50
        });
      }
    } catch (error) {
      console.error('Error adding boundary to map:', error);
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

    boundaryData.features.forEach((feature: any) => {
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
      }
    });

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    return (
      <div className="w-full h-full relative bg-blue-50 rounded-b-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
        
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

        <div className="absolute inset-4 flex items-center justify-center">
          <div className="relative">
            <svg width="200" height="150" viewBox="0 0 200 150">
              <polygon
                points="20,20 180,30 170,120 30,130"
                fill="rgba(239, 68, 68, 0.3)"
                stroke="#ef4444"
                strokeWidth="2"
                className="animate-pulse"
              />
            </svg>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="text-xs text-gray-600">
            <p className="font-medium">Project Boundary</p>
            <p>Center: {centerLat.toFixed(4)}, {centerLng.toFixed(4)}</p>
            <p>Coordinates: {coordCount}</p>
            <p className="text-australis-blue">📍 Simplified map view</p>
          </div>
        </div>
      </div>
    );
  };

  // Always show fallback for now since Azure Maps needs authentication
  if (mapError || showFallback || true) {
    return renderFallbackMap();
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default AzureMap;
