
-- Enable PostGIS extension for spatial data operations
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create spatial reference systems table if it doesn't exist
-- (This is usually handled by PostGIS but ensuring it exists)

-- Add spatial columns to project_files table for better geometry handling
ALTER TABLE public.project_files 
ADD COLUMN IF NOT EXISTS geom geometry(GEOMETRY, 4326);

-- Create index on geometry column for better performance
CREATE INDEX IF NOT EXISTS idx_project_files_geom_gist 
ON public.project_files USING GIST (geom);

-- Create constraint analysis data tables
CREATE TABLE IF NOT EXISTS public.constraint_datasets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'aonb', 'sssi', 'flood_zone', 'green_belt', etc.
  description TEXT,
  geom geometry(GEOMETRY, 4326),
  properties JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create spatial index on constraint datasets
CREATE INDEX IF NOT EXISTS idx_constraint_datasets_geom_gist 
ON public.constraint_datasets USING GIST (geom);

-- Create function for spatial constraint analysis
CREATE OR REPLACE FUNCTION public.analyze_project_constraints(
  project_boundary geometry,
  buffer_distance_meters integer DEFAULT 5000
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB := '{}';
  buffer_geom geometry;
  constraint_count integer;
  total_area numeric;
  intersecting_area numeric;
  percentage numeric;
BEGIN
  -- Create buffer around the project boundary
  buffer_geom := ST_Buffer(project_boundary::geography, buffer_distance_meters)::geometry;
  
  -- Calculate total project area in square meters
  total_area := ST_Area(project_boundary::geography);
  
  -- Analyze each constraint type
  
  -- AONB Analysis
  SELECT COUNT(*), COALESCE(SUM(ST_Area(ST_Intersection(cd.geom::geography, project_boundary::geography))), 0)
  INTO constraint_count, intersecting_area
  FROM public.constraint_datasets cd
  WHERE cd.type = 'aonb' 
    AND ST_Intersects(cd.geom, project_boundary);
  
  percentage := CASE WHEN total_area > 0 THEN (intersecting_area / total_area) * 100 ELSE 0 END;
  result := jsonb_set(result, '{aonb}', jsonb_build_object(
    'score', GREATEST(0, 100 - percentage),
    'status', CASE 
      WHEN percentage = 0 THEN 'good'
      WHEN percentage < 30 THEN 'moderate' 
      ELSE 'challenging' 
    END,
    'details', jsonb_build_object(
      'intersecting_features', constraint_count,
      'affected_area_percentage', ROUND(percentage, 2)
    )
  ));
  
  -- Flood Zone Analysis
  SELECT COUNT(*), COALESCE(SUM(ST_Area(ST_Intersection(cd.geom::geography, project_boundary::geography))), 0)
  INTO constraint_count, intersecting_area
  FROM public.constraint_datasets cd
  WHERE cd.type = 'flood_zone' 
    AND ST_Intersects(cd.geom, project_boundary);
  
  percentage := CASE WHEN total_area > 0 THEN (intersecting_area / total_area) * 100 ELSE 0 END;
  result := jsonb_set(result, '{flood_risk}', jsonb_build_object(
    'score', GREATEST(0, 100 - percentage),
    'status', CASE 
      WHEN percentage = 0 THEN 'good'
      WHEN percentage < 20 THEN 'moderate' 
      ELSE 'challenging' 
    END,
    'details', jsonb_build_object(
      'intersecting_features', constraint_count,
      'affected_area_percentage', ROUND(percentage, 2)
    )
  ));
  
  -- SSSI Buffer Analysis (within buffer distance)
  SELECT COUNT(*)
  INTO constraint_count
  FROM public.constraint_datasets cd
  WHERE cd.type = 'sssi' 
    AND ST_DWithin(cd.geom::geography, project_boundary::geography, buffer_distance_meters);
  
  result := jsonb_set(result, '{sssi_proximity}', jsonb_build_object(
    'score', CASE 
      WHEN constraint_count = 0 THEN 100
      WHEN constraint_count <= 2 THEN 70
      ELSE 40
    END,
    'status', CASE 
      WHEN constraint_count = 0 THEN 'good'
      WHEN constraint_count <= 2 THEN 'moderate' 
      ELSE 'challenging' 
    END,
    'details', jsonb_build_object(
      'nearby_features', constraint_count,
      'buffer_distance_km', buffer_distance_meters / 1000.0
    )
  ));
  
  -- Green Belt Analysis
  SELECT COUNT(*), COALESCE(SUM(ST_Area(ST_Intersection(cd.geom::geography, project_boundary::geography))), 0)
  INTO constraint_count, intersecting_area
  FROM public.constraint_datasets cd
  WHERE cd.type = 'green_belt' 
    AND ST_Intersects(cd.geom, project_boundary);
  
  percentage := CASE WHEN total_area > 0 THEN (intersecting_area / total_area) * 100 ELSE 0 END;
  result := jsonb_set(result, '{green_belt}', jsonb_build_object(
    'score', GREATEST(0, 100 - percentage),
    'status', CASE 
      WHEN percentage = 0 THEN 'good'
      WHEN percentage < 50 THEN 'moderate' 
      ELSE 'challenging' 
    END,
    'details', jsonb_build_object(
      'intersecting_features', constraint_count,
      'affected_area_percentage', ROUND(percentage, 2)
    )
  ));
  
  RETURN result;
END;
$$;

-- Add RLS policies for constraint datasets
ALTER TABLE public.constraint_datasets ENABLE ROW LEVEL SECURITY;

-- Allow all users to read constraint datasets (public data)
CREATE POLICY "Allow public read access to constraint datasets" 
  ON public.constraint_datasets 
  FOR SELECT 
  USING (true);

-- Only allow authenticated users to insert constraint data (for admin functions)
CREATE POLICY "Allow authenticated users to insert constraint datasets" 
  ON public.constraint_datasets 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);
