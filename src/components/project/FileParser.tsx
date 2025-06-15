
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
        console.log('KML file content preview:', kmlText.substring(0, 500));
        
        // Parse KML using DOMParser
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(kmlText, 'text/xml');
        
        // Check for parsing errors
        const parseError = kmlDoc.querySelector('parsererror');
        if (parseError) {
          console.error('KML parsing error:', parseError.textContent);
          resolve(null);
          return;
        }
        
        // Look for coordinates in various KML elements
        const coordinates = extractKMLCoordinates(kmlDoc);
        console.log('Extracted coordinates:', coordinates);
        
        if (coordinates.length > 0) {
          // Ensure coordinates form a closed polygon
          const closedCoordinates = [...coordinates];
          if (closedCoordinates.length > 0 && 
              (closedCoordinates[0][0] !== closedCoordinates[closedCoordinates.length - 1][0] ||
               closedCoordinates[0][1] !== closedCoordinates[closedCoordinates.length - 1][1])) {
            closedCoordinates.push(closedCoordinates[0]);
          }
          
          const geometry: ParsedGeometry = {
            type: "FeatureCollection",
            features: [{
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [closedCoordinates]
              },
              properties: {
                name: file.name.replace(/\.[^/.]+$/, ""),
                source: "KML Upload"
              }
            }]
          };
          console.log('Generated geometry:', geometry);
          resolve(geometry);
        } else {
          console.warn('No coordinates found in KML file');
          resolve(null);
        }
      } catch (error) {
        console.error('Error parsing KML:', error);
        resolve(null);
      }
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      resolve(null);
    };
    
    reader.readAsText(file);
  });
};

const extractKMLCoordinates = (kmlDoc: Document): number[][] => {
  const coordinates: number[][] = [];
  
  // Try different KML coordinate elements and namespaces
  const coordinateSelectors = [
    'coordinates',
    'kml\\:coordinates',
    '*|coordinates'
  ];
  
  for (const selector of coordinateSelectors) {
    try {
      const coordinateElements = kmlDoc.querySelectorAll(selector);
      console.log(`Found ${coordinateElements.length} coordinate elements with selector: ${selector}`);
      
      coordinateElements.forEach((element, index) => {
        const coordText = element.textContent?.trim();
        console.log(`Processing coordinate element ${index}:`, coordText?.substring(0, 100));
        
        if (coordText) {
          // KML coordinates can be separated by whitespace, newlines, or commas
          // Format: longitude,latitude,altitude (altitude is optional)
          const coordPairs = coordText
            .replace(/\s+/g, ' ') // normalize whitespace
            .trim()
            .split(/\s+/)
            .filter(pair => pair.length > 0);
            
          console.log(`Found ${coordPairs.length} coordinate pairs`);
          
          coordPairs.forEach(coordStr => {
            const parts = coordStr.split(',');
            if (parts.length >= 2) {
              const lng = parseFloat(parts[0]);
              const lat = parseFloat(parts[1]);
              
              // Validate coordinates are reasonable (rough bounds for Earth)
              if (!isNaN(lng) && !isNaN(lat) && 
                  lng >= -180 && lng <= 180 && 
                  lat >= -90 && lat <= 90) {
                coordinates.push([lng, lat]);
              } else {
                console.warn('Invalid coordinate pair:', coordStr, 'parsed as:', lng, lat);
              }
            }
          });
        }
      });
      
      if (coordinates.length > 0) {
        console.log(`Successfully extracted ${coordinates.length} coordinates`);
        break; // Stop trying other selectors if we found coordinates
      }
    } catch (error) {
      console.warn(`Error with selector ${selector}:`, error);
      continue;
    }
  }
  
  return coordinates;
};

export const parseGeoJSONFile = async (file: File): Promise<ParsedGeometry | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const geoJsonText = e.target?.result as string;
        console.log('GeoJSON file content preview:', geoJsonText.substring(0, 500));
        
        const geoJson = JSON.parse(geoJsonText);
        console.log('Parsed GeoJSON structure:', geoJson.type, geoJson.features?.length || 'no features');
        
        // Validate basic GeoJSON structure
        if (geoJson.type === 'FeatureCollection' && geoJson.features) {
          // Ensure all features have valid geometries
          const validFeatures = geoJson.features.filter((feature: any) => 
            feature.geometry && feature.geometry.coordinates
          );
          
          if (validFeatures.length > 0) {
            resolve({
              ...geoJson,
              features: validFeatures
            });
          } else {
            console.warn('No valid features found in GeoJSON');
            resolve(null);
          }
        } else if (geoJson.type === 'Feature' && geoJson.geometry) {
          resolve({
            type: 'FeatureCollection',
            features: [geoJson]
          });
        } else {
          console.warn('Invalid GeoJSON structure:', geoJson.type);
          resolve(null);
        }
      } catch (error) {
        console.error('Error parsing GeoJSON:', error);
        resolve(null);
      }
    };
    
    reader.onerror = () => {
      console.error('Error reading GeoJSON file');
      resolve(null);
    };
    
    reader.readAsText(file);
  });
};

export const parseShapefileZip = async (file: File): Promise<ParsedGeometry | null> => {
  console.log('Shapefile parsing not yet fully implemented for:', file.name);
  console.log('Returning demo polygon for testing purposes');
  
  // Return a basic polygon for demo purposes - in production you'd use a shapefile library
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
        name: file.name.replace(/\.[^/.]+$/, ""),
        source: "Shapefile Upload (Demo)"
      }
    }]
  };
};

export const parseGeometryFile = async (file: File): Promise<ParsedGeometry | null> => {
  const fileName = file.name.toLowerCase();
  console.log('Parsing geometry file:', fileName);
  
  try {
    if (fileName.endsWith('.kml') || fileName.endsWith('.kmz')) {
      return await parseKMLFile(file);
    } else if (fileName.endsWith('.geojson') || fileName.endsWith('.json')) {
      return await parseGeoJSONFile(file);
    } else if (fileName.endsWith('.zip') || fileName.endsWith('.shp')) {
      return await parseShapefileZip(file);
    }
    
    console.warn('Unsupported file type:', fileName);
    return null;
  } catch (error) {
    console.error('Error parsing geometry file:', error);
    return null;
  }
};
