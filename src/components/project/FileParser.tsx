
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
        console.log('=== KML PARSING DEBUG START ===');
        console.log('File name:', file.name);
        console.log('File size:', file.size, 'bytes');
        console.log('KML content length:', kmlText.length);
        console.log('KML file content (first 2000 chars):', kmlText.substring(0, 2000));
        console.log('KML file content (last 500 chars):', kmlText.substring(Math.max(0, kmlText.length - 500)));
        
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
        
        console.log('KML Document structure:');
        console.log('- Root element:', kmlDoc.documentElement?.tagName);
        console.log('- All element names:', Array.from(kmlDoc.querySelectorAll('*')).map(el => el.tagName).slice(0, 20));
        
        // Enhanced coordinate extraction with better namespace handling
        const coordinates = extractKMLCoordinatesEnhanced(kmlDoc);
        console.log('Final extracted coordinates count:', coordinates.length);
        console.log('First 5 coordinates:', coordinates.slice(0, 5));
        console.log('Last 5 coordinates:', coordinates.slice(-5));
        
        if (coordinates.length > 0) {
          // Ensure coordinates form a closed polygon if needed
          const closedCoordinates = [...coordinates];
          if (closedCoordinates.length > 2 && 
              (closedCoordinates[0][0] !== closedCoordinates[closedCoordinates.length - 1][0] ||
               closedCoordinates[0][1] !== closedCoordinates[closedCoordinates.length - 1][1])) {
            closedCoordinates.push(closedCoordinates[0]);
            console.log('Added closing coordinate to form closed polygon');
          }
          
          // Determine geometry type based on coordinate count
          let geometryType = 'Point';
          let geometryCoordinates: any = coordinates[0];
          
          if (coordinates.length === 1) {
            geometryType = 'Point';
            geometryCoordinates = coordinates[0];
            console.log('Determined geometry type: Point');
          } else if (coordinates.length === 2) {
            geometryType = 'LineString';
            geometryCoordinates = coordinates;
            console.log('Determined geometry type: LineString');
          } else {
            geometryType = 'Polygon';
            geometryCoordinates = [closedCoordinates];
            console.log('Determined geometry type: Polygon');
          }
          
          const geometry: ParsedGeometry = {
            type: "FeatureCollection",
            features: [{
              type: "Feature",
              geometry: {
                type: geometryType,
                coordinates: geometryCoordinates
              },
              properties: {
                name: file.name.replace(/\.[^/.]+$/, ""),
                source: "KML Upload",
                originalFile: file.name,
                parsedAt: new Date().toISOString(),
                coordinateCount: coordinates.length
              }
            }]
          };
          
          console.log('=== FINAL GENERATED GEOMETRY ===');
          console.log(JSON.stringify(geometry, null, 2));
          console.log('=== KML PARSING DEBUG END ===');
          resolve(geometry);
        } else {
          console.warn('No valid coordinates found in KML file');
          console.log('=== KML PARSING DEBUG END (NO COORDINATES) ===');
          resolve(null);
        }
      } catch (error) {
        console.error('Error parsing KML:', error);
        console.log('=== KML PARSING DEBUG END (ERROR) ===');
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

const extractKMLCoordinatesEnhanced = (kmlDoc: Document): number[][] => {
  const coordinates: number[][] = [];
  
  console.log('=== COORDINATE EXTRACTION DEBUG ===');
  console.log('KML Document structure:', kmlDoc.documentElement?.tagName);
  
  // Get all elements and log their structure
  const allElements = Array.from(kmlDoc.querySelectorAll('*'));
  console.log('All KML elements found:', allElements.map(el => `${el.tagName}(${el.children.length} children)`));
  
  // Enhanced selectors for better KML parsing
  const coordinateSelectors = [
    'coordinates',
    'kml\\:coordinates', 
    '*|coordinates',
    'Placemark coordinates',
    'Polygon coordinates',
    'LinearRing coordinates',
    'Point coordinates'
  ];
  
  // Also try to find specific KML elements
  const kmlElements = [
    'Placemark',
    'Polygon',
    'LinearRing', 
    'Point',
    'LineString'
  ];
  
  // First, try to find coordinate elements directly
  for (const selector of coordinateSelectors) {
    try {
      const coordinateElements = kmlDoc.querySelectorAll(selector);
      console.log(`Selector "${selector}" found ${coordinateElements.length} elements`);
      
      coordinateElements.forEach((element, index) => {
        const coordText = element.textContent?.trim();
        console.log(`Coordinate element ${index} content (${selector}):`, coordText?.substring(0, 300));
        
        if (coordText) {
          const parsedCoords = parseCoordinateString(coordText);
          console.log(`Parsed ${parsedCoords.length} coordinates from element ${index}`);
          coordinates.push(...parsedCoords);
        }
      });
      
      if (coordinates.length > 0) {
        console.log(`Successfully extracted ${coordinates.length} coordinates using selector: ${selector}`);
        break;
      }
    } catch (error) {
      console.warn(`Error with selector ${selector}:`, error);
      continue;
    }
  }
  
  // If no coordinates found, try parsing KML structure elements
  if (coordinates.length === 0) {
    console.log('No coordinates found with direct selectors, trying structural elements...');
    
    for (const elementType of kmlElements) {
      try {
        const elements = kmlDoc.getElementsByTagName(elementType);
        console.log(`Found ${elements.length} ${elementType} elements`);
        
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          console.log(`Processing ${elementType} element ${i}:`, element.outerHTML.substring(0, 200));
          
          const coordElements = element.getElementsByTagName('coordinates');
          console.log(`Found ${coordElements.length} coordinate sub-elements in ${elementType} ${i}`);
          
          for (let j = 0; j < coordElements.length; j++) {
            const coordText = coordElements[j].textContent?.trim();
            if (coordText) {
              console.log(`Coordinate text from ${elementType}[${i}].coordinates[${j}]:`, coordText.substring(0, 200));
              const parsedCoords = parseCoordinateString(coordText);
              console.log(`Parsed ${parsedCoords.length} coordinates from ${elementType}[${i}].coordinates[${j}]`);
              coordinates.push(...parsedCoords);
            }
          }
        }
        
        if (coordinates.length > 0) {
          console.log(`Successfully extracted coordinates from ${elementType} elements`);
          break;
        }
      } catch (error) {
        console.warn(`Error parsing ${elementType} elements:`, error);
      }
    }
  }
  
  // Try a more brute-force approach if still no coordinates
  if (coordinates.length === 0) {
    console.log('Trying brute-force coordinate extraction...');
    const allTextContent = kmlDoc.documentElement?.textContent || '';
    console.log('Full document text content:', allTextContent.substring(0, 1000));
    
    // Look for patterns that might be coordinates
    const coordinatePatterns = [
      /-?\d+\.?\d*,-?\d+\.?\d*,-?\d+\.?\d*/g, // lng,lat,alt
      /-?\d+\.?\d*,-?\d+\.?\d*/g,            // lng,lat
    ];
    
    for (const pattern of coordinatePatterns) {
      const matches = allTextContent.match(pattern);
      if (matches) {
        console.log(`Found ${matches.length} coordinate matches with pattern:`, matches.slice(0, 10));
        const coordString = matches.join(' ');
        const parsedCoords = parseCoordinateString(coordString);
        if (parsedCoords.length > 0) {
          coordinates.push(...parsedCoords);
          break;
        }
      }
    }
  }
  
  console.log('=== FINAL COORDINATE EXTRACTION RESULT ===');
  console.log(`Total coordinates extracted: ${coordinates.length}`);
  console.log('First coordinate:', coordinates[0]);
  console.log('Last coordinate:', coordinates[coordinates.length - 1]);
  
  return coordinates;
};

const parseCoordinateString = (coordText: string): number[][] => {
  const coordinates: number[][] = [];
  
  try {
    console.log('=== PARSING COORDINATE STRING ===');
    console.log('Input text length:', coordText.length);
    console.log('Input text preview:', coordText.substring(0, 500));
    
    // Clean up the coordinate string
    const cleanedText = coordText
      .replace(/\s+/g, ' ')
      .replace(/,\s*,/g, ',')
      .replace(/\n/g, ' ')
      .replace(/\r/g, ' ')
      .replace(/\t/g, ' ')
      .trim();
    
    console.log('Cleaned text:', cleanedText.substring(0, 300));
    
    // KML coordinates can be space-separated or comma-separated tuples
    // Format: longitude,latitude,altitude longitude,latitude,altitude ...
    // or: longitude,latitude longitude,latitude ...
    
    // Split by whitespace first to get coordinate tuples
    const coordTuples = cleanedText.split(/\s+/).filter(tuple => tuple.length > 0);
    
    console.log(`Found ${coordTuples.length} coordinate tuples`);
    console.log('First 10 tuples:', coordTuples.slice(0, 10));
    
    coordTuples.forEach((tuple, index) => {
      const parts = tuple.split(',').map(part => part.trim()).filter(part => part.length > 0);
      
      if (parts.length >= 2) {
        const lng = parseFloat(parts[0]);
        const lat = parseFloat(parts[1]);
        
        console.log(`Tuple ${index + 1}: "${tuple}" -> lng=${lng}, lat=${lat}`);
        
        // Validate coordinates are reasonable
        if (!isNaN(lng) && !isNaN(lat) && 
            lng >= -180 && lng <= 180 && 
            lat >= -90 && lat <= 90) {
          coordinates.push([lng, lat]);
          console.log(`✓ Valid coordinate ${index + 1}: [${lng}, ${lat}]`);
        } else {
          console.warn(`✗ Invalid coordinate tuple ${index + 1}:`, tuple, 'parsed as:', lng, lat);
        }
      } else {
        console.warn(`✗ Insufficient coordinate parts in tuple ${index + 1}:`, tuple, 'parts:', parts);
      }
    });
    
    console.log(`=== COORDINATE PARSING COMPLETE: ${coordinates.length} valid coordinates ===`);
    
  } catch (error) {
    console.error('Error parsing coordinate string:', error);
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
