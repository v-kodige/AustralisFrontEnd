
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

  useEffect(() => {
    if (!mapRef.current) return;

    try {
      // Initialize Azure Maps without authentication for now
      // In production, you would need to set up Azure Maps authentication
      const map = new atlas.Map(mapRef.current, {
        center: [-2.4, 53.4], // Default to UK center
        zoom: 6,
        view: 'Auto',
        // authOptions: {
        //   authType: atlas.AuthenticationType.subscriptionKey,
        //   subscriptionKey: 'YOUR_AZURE_MAPS_KEY'
        // }
      });

      mapInstanceRef.current = map;

      map.events.add('ready', () => {
        console.log('Azure Map is ready');
        
        // Add boundary data if available
        if (boundaryData && boundaryData.features) {
          addBoundaryToMap(map, boundaryData);
        }

        if (onMapReady) {
          onMapReady(map);
        }
      });

      map.events.add('error', (error) => {
        console.error('Azure Map error:', error);
        setMapError('Map failed to load. Azure Maps authentication may be required.');
      });

    } catch (error) {
      console.error('Error initializing Azure Maps:', error);
      setMapError('Failed to initialize Azure Maps. Authentication required.');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.dispose();
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
      // Create data source
      const dataSource = new atlas.source.DataSource();
      map.sources.add(dataSource);

      // Add GeoJSON data
      if (data.features && data.features.length > 0) {
        data.features.forEach((feature: any) => {
          dataSource.add(new atlas.data.Feature(feature.geometry, feature.properties));
        });

        // Create polygon layer
        map.layers.add(new atlas.layer.PolygonLayer(dataSource, undefined, {
          fillColor: 'rgba(255, 0, 0, 0.2)',
          fillOpacity: 0.3
        }));

        // Create line layer for borders
        map.layers.add(new atlas.layer.LineLayer(dataSource, undefined, {
          strokeColor: '#ff0000',
          strokeWidth: 2
        }));

        // Zoom to bounds
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

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-b-lg">
        <div className="text-center text-gray-500 p-4">
          <p className="text-lg font-medium">Map Authentication Required</p>
          <p className="text-sm">{mapError}</p>
          <p className="text-xs mt-2">Please configure Azure Maps authentication in production</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default AzureMap;
