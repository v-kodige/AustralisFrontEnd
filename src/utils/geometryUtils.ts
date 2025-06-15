
import * as turf from '@turf/turf';

export interface BufferOptions {
  radius: number; // in kilometers
  units?: 'kilometers' | 'miles' | 'meters';
  steps?: number;
}

export const createAccurateBuffer = (geojson: any, options: BufferOptions) => {
  try {
    console.log('=== CREATING ACCURATE BUFFER ===');
    console.log('Input geometry:', geojson);
    console.log('Buffer options:', options);

    if (!geojson || !geojson.features) {
      throw new Error('Invalid GeoJSON input');
    }

    // Convert all features to a single feature collection
    let inputFeatures = geojson.features;
    
    // If we have multiple features, union them first
    if (inputFeatures.length > 1) {
      console.log('Multiple features detected, creating union...');
      let union = inputFeatures[0];
      for (let i = 1; i < inputFeatures.length; i++) {
        union = turf.union(union, inputFeatures[i]);
      }
      inputFeatures = [union];
    }

    const feature = inputFeatures[0];
    console.log('Processing feature:', feature);

    // Create buffer using Turf.js
    const buffered = turf.buffer(feature, options.radius, {
      units: options.units || 'kilometers',
      steps: options.steps || 64
    });

    console.log('Buffer created successfully:', buffered);

    return {
      type: 'FeatureCollection',
      features: [buffered]
    };

  } catch (error) {
    console.error('Error creating buffer:', error);
    return null;
  }
};

export const calculateBounds = (geojson: any) => {
  try {
    if (!geojson || !geojson.features || geojson.features.length === 0) {
      return null;
    }

    const bbox = turf.bbox(geojson);
    return {
      west: bbox[0],
      south: bbox[1], 
      east: bbox[2],
      north: bbox[3],
      center: [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2]
    };
  } catch (error) {
    console.error('Error calculating bounds:', error);
    return null;
  }
};

export const pointInPolygon = (point: [number, number], polygon: any) => {
  try {
    const pt = turf.point(point);
    return turf.booleanPointInPolygon(pt, polygon);
  } catch (error) {
    console.error('Error checking point in polygon:', error);
    return false;
  }
};

export const calculateDistance = (point1: [number, number], point2: [number, number], units: 'kilometers' | 'miles' | 'meters' = 'kilometers') => {
  try {
    const from = turf.point(point1);
    const to = turf.point(point2);
    return turf.distance(from, to, { units });
  } catch (error) {
    console.error('Error calculating distance:', error);
    return 0;
  }
};
