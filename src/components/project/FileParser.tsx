
export interface ParsedGeometry {
  type: string;
  features: Array<{
    type: string;
    geometry: {
      type: string;
      coordinates: number[][] | number[][][] | number[][][][];
    };
    properties?: Record<string, any>;
  }>;
}

export const parseKMLFile = async (file: File): Promise<ParsedGeometry | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const kmlText = e.target?.result as string;
        
        // Parse KML using DOMParser
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(kmlText, 'text/xml');
        
        // Look for coordinates in various KML elements
        const coordinates = extractKMLCoordinates(kmlDoc);
        
        if (coordinates.length > 0) {
          const geometry: ParsedGeometry = {
            type: "FeatureCollection",
            features: [{
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [coordinates]
              },
              properties: {
                name: file.name
              }
            }]
          };
          resolve(geometry);
        } else {
          resolve(null);
        }
      } catch (error) {
        console.error('Error parsing KML:', error);
        resolve(null);
      }
    };
    reader.readAsText(file);
  });
};

const extractKMLCoordinates = (kmlDoc: Document): number[][] => {
  const coordinates: number[][] = [];
  
  // Try different KML coordinate elements
  const coordinateElements = [
    ...Array.from(kmlDoc.getElementsByTagName('coordinates')),
    ...Array.from(kmlDoc.getElementsByTagNameNS('*', 'coordinates'))
  ];
  
  coordinateElements.forEach(element => {
    const coordText = element.textContent?.trim();
    if (coordText) {
      // KML coordinates are in "lng,lat,alt" format
      const coords = coordText.split(/\s+/).map(coordStr => {
        const parts = coordStr.split(',');
        if (parts.length >= 2) {
          return [parseFloat(parts[0]), parseFloat(parts[1])]; // [lng, lat]
        }
        return null;
      }).filter(coord => coord !== null) as number[][];
      
      coordinates.push(...coords);
    }
  });
  
  return coordinates;
};

export const parseGeoJSONFile = async (file: File): Promise<ParsedGeometry | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const geoJsonText = e.target?.result as string;
        const geoJson = JSON.parse(geoJsonText);
        
        // Validate basic GeoJSON structure
        if (geoJson.type === 'FeatureCollection' && geoJson.features) {
          resolve(geoJson);
        } else if (geoJson.type === 'Feature') {
          resolve({
            type: 'FeatureCollection',
            features: [geoJson]
          });
        } else {
          resolve(null);
        }
      } catch (error) {
        console.error('Error parsing GeoJSON:', error);
        resolve(null);
      }
    };
    reader.readAsText(file);
  });
};

export const parseShapefileZip = async (file: File): Promise<ParsedGeometry | null> => {
  // For shapefile parsing, we would need a library like shapefile-js
  // For now, return a mock geometry similar to the original
  console.log('Shapefile parsing not yet implemented for:', file.name);
  
  // Return a basic polygon for demo purposes
  return {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-2.5, 53.3],
          [-2.3, 53.3],
          [-2.3, 53.5],
          [-2.5, 53.5],
          [-2.5, 53.3]
        ]]
      },
      properties: {
        name: file.name
      }
    }]
  };
};

export const parseGeometryFile = async (file: File): Promise<ParsedGeometry | null> => {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.kml') || fileName.endsWith('.kmz')) {
    return parseKMLFile(file);
  } else if (fileName.endsWith('.geojson') || fileName.endsWith('.json')) {
    return parseGeoJSONFile(file);
  } else if (fileName.endsWith('.zip') || fileName.endsWith('.shp')) {
    return parseShapefileZip(file);
  }
  
  return null;
};
