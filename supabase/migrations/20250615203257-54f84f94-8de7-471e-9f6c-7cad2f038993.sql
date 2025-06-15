
-- Insert sample UK constraint data for testing
-- This represents key constraints that would be checked for solar farm applications under EIA regulations

-- SSSI (Sites of Special Scientific Interest)
INSERT INTO public.constraint_datasets (name, type, description, geom, properties) VALUES
('Ashdown Forest SSSI', 'sssi', 'Heathland and woodland SSSI in East Sussex', 
 ST_GeomFromText('POLYGON((0.123 51.123, 0.145 51.123, 0.145 51.135, 0.123 51.135, 0.123 51.123))', 4326),
 '{"designation_date": "1978-01-01", "area_hectares": 2674, "citation": "Important heathland habitat"}'::jsonb),
 
('Thames Basin Heaths SSSI', 'sssi', 'Heathland SSSI in Surrey/Berkshire', 
 ST_GeomFromText('POLYGON((-0.567 51.345, -0.534 51.345, -0.534 51.367, -0.567 51.367, -0.567 51.345))', 4326),
 '{"designation_date": "1976-01-01", "area_hectares": 8274, "citation": "Lowland heathland habitat"}'::jsonb);

-- AONB (Areas of Outstanding Natural Beauty)
INSERT INTO public.constraint_datasets (name, type, description, geom, properties) VALUES
('Cotswolds AONB', 'aonb', 'Area of Outstanding Natural Beauty in Gloucestershire', 
 ST_GeomFromText('POLYGON((-2.234 51.789, -1.876 51.789, -1.876 52.012, -2.234 52.012, -2.234 51.789))', 4326),
 '{"designation_date": "1966-01-01", "area_hectares": 203400, "management_plan": "Cotswolds AONB Management Plan 2019-2024"}'::jsonb),
 
('Surrey Hills AONB', 'aonb', 'Area of Outstanding Natural Beauty in Surrey', 
 ST_GeomFromText('POLYGON((-0.567 51.234, -0.345 51.234, -0.345 51.345, -0.567 51.345, -0.567 51.234))', 4326),
 '{"designation_date": "1958-01-01", "area_hectares": 41900, "management_plan": "Surrey Hills AONB Management Plan 2020-2025"}'::jsonb);

-- Flood Zone 3 (High Risk)
INSERT INTO public.constraint_datasets (name, type, description, geom, properties) VALUES
('River Thames Flood Zone 3', 'flood_zone_3', 'High probability flood zone along River Thames', 
 ST_GeomFromText('POLYGON((-0.789 51.456, -0.678 51.456, -0.678 51.467, -0.789 51.467, -0.789 51.456))', 4326),
 '{"flood_probability": "1 in 100 annual probability", "source": "Environment Agency", "last_updated": "2023-01-01"}'::jsonb),
 
('River Severn Flood Zone 3', 'flood_zone_3', 'High probability flood zone along River Severn', 
 ST_GeomFromText('POLYGON((-2.567 51.678, -2.456 51.678, -2.456 51.689, -2.567 51.689, -2.567 51.678))', 4326),
 '{"flood_probability": "1 in 100 annual probability", "source": "Environment Agency", "last_updated": "2023-01-01"}'::jsonb);

-- Green Belt
INSERT INTO public.constraint_datasets (name, type, description, geom, properties) VALUES
('Metropolitan Green Belt - Surrey', 'green_belt', 'Metropolitan Green Belt designation in Surrey', 
 ST_GeomFromText('POLYGON((-0.456 51.234, -0.234 51.234, -0.234 51.345, -0.456 51.345, -0.456 51.234))', 4326),
 '{"green_belt_type": "Metropolitan", "local_authority": "Surrey County Council", "policy_reference": "GB1"}'::jsonb),
 
('Gloucestershire Green Belt', 'green_belt', 'Green Belt designation in Gloucestershire', 
 ST_GeomFromText('POLYGON((-2.123 51.789, -1.987 51.789, -1.987 51.856, -2.123 51.856, -2.123 51.789))', 4326),
 '{"green_belt_type": "Local", "local_authority": "Gloucestershire County Council", "policy_reference": "GB2"}'::jsonb);

-- Listed Buildings (Grade I and II*)
INSERT INTO public.constraint_datasets (name, type, description, geom, properties) VALUES
('St. Mary''s Church', 'listed_buildings', 'Grade I Listed Norman Church', 
 ST_GeomFromText('POINT(-0.345 51.456)', 4326),
 '{"grade": "I", "list_entry": "1234567", "period": "Medieval", "building_type": "Church"}'::jsonb),
 
('Manor House', 'listed_buildings', 'Grade II* Listed Tudor Manor House', 
 ST_GeomFromText('POINT(-1.234 51.678)', 4326),
 '{"grade": "II*", "list_entry": "2345678", "period": "Tudor", "building_type": "Residential"}'::jsonb);

-- Ancient Woodland
INSERT INTO public.constraint_datasets (name, type, description, geom, properties) VALUES
('Kings Wood Ancient Woodland', 'ancient_woodland', 'Ancient semi-natural woodland', 
 ST_GeomFromText('POLYGON((-0.789 51.234, -0.756 51.234, -0.756 51.245, -0.789 51.245, -0.789 51.234))', 4326),
 '{"woodland_type": "Ancient semi-natural", "area_hectares": 45, "dominant_species": "Oak and Beech"}'::jsonb),
 
('Blackdown Woods', 'ancient_woodland', 'Ancient replanted woodland', 
 ST_GeomFromText('POLYGON((-2.345 51.567, -2.312 51.567, -2.312 51.578, -2.345 51.578, -2.345 51.567))', 4326),
 '{"woodland_type": "Ancient replanted", "area_hectares": 78, "dominant_species": "Coniferous plantation"}'::jsonb);

-- Special Areas of Conservation (SAC)
INSERT INTO public.constraint_datasets (name, type, description, geom, properties) VALUES
('Ashdown Forest SAC', 'sac', 'Special Area of Conservation for heathland habitats', 
 ST_GeomFromText('POLYGON((0.123 51.123, 0.145 51.123, 0.145 51.135, 0.123 51.135, 0.123 51.123))', 4326),
 '{"eu_code": "UK0012784", "habitat_types": "Northern Atlantic wet heaths", "species": "Great crested newt"}'::jsonb);

-- Special Protection Areas (SPA)
INSERT INTO public.constraint_datasets (name, type, description, geom, properties) VALUES
('Thames Basin Heaths SPA', 'spa', 'Special Protection Area for ground-nesting birds', 
 ST_GeomFromText('POLYGON((-0.567 51.345, -0.534 51.345, -0.534 51.367, -0.567 51.367, -0.567 51.345))', 4326),
 '{"eu_code": "UK9012171", "qualifying_species": "Dartford warbler, Woodlark, Nightjar", "area_hectares": 8274}'::jsonb);

-- Electrical Substations
INSERT INTO public.constraint_datasets (name, type, description, geom, properties) VALUES
('Kemsley Substation', 'electrical_substations', '400kV National Grid Substation', 
 ST_GeomFromText('POINT(-0.678 51.345)', 4326),
 '{"voltage": "400kV", "operator": "National Grid", "capacity_mva": 1500, "connection_available": true}'::jsonb),
 
('Didcot Substation', 'electrical_substations', '400kV National Grid Substation', 
 ST_GeomFromText('POINT(-1.234 51.612)', 4326),
 '{"voltage": "400kV", "operator": "National Grid", "capacity_mva": 2000, "connection_available": false}'::jsonb);

-- Major Roads
INSERT INTO public.constraint_datasets (name, type, description, geom, properties) VALUES
('M25 Motorway Section', 'major_roads', 'M25 London Orbital Motorway', 
 ST_GeomFromText('LINESTRING(-0.456 51.234, -0.345 51.245, -0.234 51.256)', 4326),
 '{"road_type": "Motorway", "road_number": "M25", "traffic_volume": "180000", "speed_limit": 70}'::jsonb),
 
('A34 Trunk Road', 'major_roads', 'A34 Strategic Trunk Road', 
 ST_GeomFromText('LINESTRING(-1.234 51.456, -1.223 51.567, -1.212 51.678)', 4326),
 '{"road_type": "A-road", "road_number": "A34", "traffic_volume": "45000", "speed_limit": 70}'::jsonb);

-- Residential Areas
INSERT INTO public.constraint_datasets (name, type, description, geom, properties) VALUES
('Guildford Residential Area', 'residential_areas', 'Main residential area of Guildford', 
 ST_GeomFromText('POLYGON((-0.567 51.234, -0.534 51.234, -0.534 51.245, -0.567 51.245, -0.567 51.234))', 4326),
 '{"population": 77057, "settlement_type": "Town", "local_authority": "Guildford Borough Council"}'::jsonb),
 
('Cirencester Residential Area', 'residential_areas', 'Main residential area of Cirencester', 
 ST_GeomFromText('POLYGON((-1.987 51.789, -1.965 51.789, -1.965 51.801, -1.987 51.801, -1.987 51.789))', 4326),
 '{"population": 19076, "settlement_type": "Town", "local_authority": "Cotswold District Council"}'::jsonb);
