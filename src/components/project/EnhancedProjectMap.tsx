
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import AzureMap from './AzureMap';
import { UK_SOLAR_CONSTRAINTS } from './ConstraintCategories';

interface EnhancedProjectMapProps {
  projectId: string;
}

interface ConstraintLayer {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  color: string;
  features: any[];
}

const EnhancedProjectMap = ({ projectId }: EnhancedProjectMapProps) => {
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const [constraintLayers, setConstraintLayers] = useState<ConstraintLayer[]>([]);
  const [loading, setLoading] = useState(true);
  const mapInstanceRef = useRef<any>(null);

  const constraintColors = {
    sssi: '#ff0000',
    aonb: '#00ff00',
    flood_zone_3: '#0066cc',
    green_belt: '#90EE90',
    listed_buildings: '#800080',
    ancient_woodland: '#228B22',
    sac: '#ff6600',
    spa: '#ff9900',
    electrical_substations: '#ffff00',
    major_roads: '#808080',
    residential_areas: '#ffb6c1'
  };

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      
      // Load project boundary
      const { data: files, error: fileError } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .eq('processed', true);

      if (fileError) throw fileError;

      if (files && files.length > 0) {
        const file = files[0];
        if (file.geometry_data) {
          setBoundaryData(file.geometry_data);
        }
      }

      // Load constraint data
      await loadConstraintLayers();

    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConstraintLayers = async () => {
    try {
      const layers: ConstraintLayer[] = [];
      
      // Get unique constraint types from our data
      const { data: constraintTypes, error } = await supabase
        .from('constraint_datasets')
        .select('type')
        .distinct();

      if (error) throw error;

      for (const typeRow of constraintTypes || []) {
        const type = typeRow.type;
        
        // Get all features for this constraint type
        const { data: features, error: featuresError } = await supabase
          .from('constraint_datasets')
          .select('*')
          .eq('type', type);

        if (featuresError) continue;

        const constraint = UK_SOLAR_CONSTRAINTS.find(c => c.id === type);
        
        layers.push({
          id: type,
          name: constraint?.name || type.replace('_', ' ').toUpperCase(),
          type: constraint?.category || 'other',
          visible: false, // Start with layers hidden
          color: constraintColors[type as keyof typeof constraintColors] || '#666666',
          features: features || []
        });
      }

      setConstraintLayers(layers);
    } catch (error) {
      console.error('Error loading constraint layers:', error);
    }
  };

  const toggleLayer = (layerId: string) => {
    setConstraintLayers(prev => 
      prev.map(layer => 
        layer.id === layerId 
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    );
  };

  const onMapReady = (map: any) => {
    mapInstanceRef.current = map;
    addConstraintLayers(map);
  };

  const addConstraintLayers = (map: any) => {
    constraintLayers.forEach(layer => {
      if (layer.visible && layer.features.length > 0) {
        try {
          // Create data source for this layer
          const dataSource = new (window as any).atlas.source.DataSource();
          map.sources.add(dataSource);

          // Add features to data source
          layer.features.forEach(feature => {
            if (feature.geom) {
              // Convert PostGIS geometry to GeoJSON
              // This is a simplified approach - in production you'd use ST_AsGeoJSON
              const geoJsonFeature = {
                type: 'Feature',
                geometry: feature.geom,
                properties: {
                  name: feature.name,
                  description: feature.description,
                  ...feature.properties
                }
              };
              dataSource.add(geoJsonFeature);
            }
          });

          // Add appropriate layer based on geometry type
          if (layer.features.some(f => f.geom?.type?.includes('Polygon'))) {
            // Polygon layer
            map.layers.add(new (window as any).atlas.layer.PolygonLayer(dataSource, undefined, {
              fillColor: layer.color,
              fillOpacity: 0.3,
              strokeColor: layer.color,
              strokeWidth: 2
            }));
          } else if (layer.features.some(f => f.geom?.type === 'Point')) {
            // Symbol layer for points
            map.layers.add(new (window as any).atlas.layer.SymbolLayer(dataSource, undefined, {
              iconOptions: {
                image: 'pin-round-red',
                size: 0.8
              }
            }));
          } else if (layer.features.some(f => f.geom?.type?.includes('LineString'))) {
            // Line layer
            map.layers.add(new (window as any).atlas.layer.LineLayer(dataSource, undefined, {
              strokeColor: layer.color,
              strokeWidth: 3
            }));
          }

        } catch (error) {
          console.error(`Error adding layer ${layer.id}:`, error);
        }
      }
    });
  };

  // Update map when layer visibility changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      // Clear existing layers and re-add
      // In a production app, you'd manage this more efficiently
      try {
        mapInstanceRef.current.sources.clear();
        mapInstanceRef.current.layers.clear();
        addConstraintLayers(mapInstanceRef.current);
      } catch (error) {
        console.error('Error updating map layers:', error);
      }
    }
  }, [constraintLayers]);

  const groupedLayers = constraintLayers.reduce((acc, layer) => {
    if (!acc[layer.type]) {
      acc[layer.type] = [];
    }
    acc[layer.type].push(layer);
    return acc;
  }, {} as Record<string, ConstraintLayer[]>);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Map */}
      <div className="lg:col-span-3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Project Map with Constraints</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-96">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="animate-spin w-6 h-6 border-4 border-australis-blue/20 rounded-full border-t-australis-blue"></div>
              </div>
            ) : (
              <AzureMap 
                boundaryData={boundaryData}
                onMapReady={onMapReady}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Layer Controls */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">Constraint Layers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(groupedLayers).map(([category, layers]) => (
              <div key={category} className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700 capitalize border-b pb-1">
                  {category.replace('_', ' ')}
                </h4>
                {layers.map(layer => (
                  <div key={layer.id} className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <div 
                        className="w-3 h-3 rounded border flex-shrink-0"
                        style={{ backgroundColor: layer.color }}
                      />
                      <Label 
                        htmlFor={layer.id}
                        className="text-xs cursor-pointer truncate"
                        title={layer.name}
                      >
                        {layer.name}
                      </Label>
                    </div>
                    <Switch
                      id={layer.id}
                      checked={layer.visible}
                      onCheckedChange={() => toggleLayer(layer.id)}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            ))}
            
            {constraintLayers.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No constraint data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedProjectMap;
