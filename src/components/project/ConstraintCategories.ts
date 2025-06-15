
export interface ConstraintConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  bufferDistance: number; // meters - analysis distance
  scoring: {
    good: { threshold: number; score: number; };
    moderate: { threshold: number; score: number; };
    challenging: { threshold: number; score: number; };
  };
  weight: number; // for overall developability score
  batch?: number;
  abbreviation?: string;
  outputFormat: string; // Expected output format for reporting
}

export const UK_SOLAR_CONSTRAINTS: ConstraintConfig[] = [
  // Environmental Constraints
  {
    id: 'ancient_woodland',
    name: 'Ancient Woodland',
    category: 'environmental',
    description: 'A protected woodland that has existed since 1600 or before.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 70 },
      challenging: { threshold: 0, score: 30 }
    },
    weight: 0.1,
    abbreviation: 'solar-ancwood-calculation',
    outputFormat: 'Names of Ancient Woodlands within 5km of site boundary, with distance from site given in meters.'
  },
  {
    id: 'moorland_deep_peat',
    name: 'Moorland Deep Peat (England)',
    category: 'environmental',
    description: 'Soil having a predominantly organic (peat) layer, of depth greater than 50 cm.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 60 },
      challenging: { threshold: 0, score: 20 }
    },
    weight: 0.08,
    batch: 2,
    outputFormat: 'Presence/Absence of deep peat soil within site boundary AND Area of Deep Peat within 5km of site centroid (in hectares).'
  },
  {
    id: 'peat_maps_wales',
    name: 'Peat Maps (Wales)',
    category: 'environmental',
    description: 'Soil surveys identifying areas of peat in Wales.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 60 },
      challenging: { threshold: 0, score: 20 }
    },
    weight: 0.08,
    outputFormat: 'Presence/Absence of peat soil within site boundary AND Peat Classification Type within 5km.'
  },
  {
    id: 'ramsar',
    name: 'Ramsar - Wetlands of International Importance',
    category: 'environmental',
    description: 'Wetlands of international importance designated under the Ramsar Convention.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 2000, score: 100 },
      moderate: { threshold: 1000, score: 50 },
      challenging: { threshold: 0, score: 10 }
    },
    weight: 0.12,
    batch: 2,
    outputFormat: 'Name(s) of Ramsar site(s) intersecting or within 5km of site boundary, with shortest distance from site given in meters.'
  },
  {
    id: 'sssi',
    name: 'Sites of Special Scientific Interest (SSSI)',
    category: 'environmental',
    description: 'Areas of particular interest due to rare species or important geological features.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 60 },
      challenging: { threshold: 0, score: 20 }
    },
    weight: 0.15,
    batch: 1,
    outputFormat: 'Name(s) of SSSI(s) intersecting or within 5km of site boundary, with shortest distance from site given in meters.'
  },
  {
    id: 'sac',
    name: 'Special Area of Conservation (SAC)',
    category: 'environmental',
    description: 'Designation to protect natural habitats and flora and fauna under threat.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 2000, score: 100 },
      moderate: { threshold: 1000, score: 50 },
      challenging: { threshold: 0, score: 10 }
    },
    weight: 0.15,
    abbreviation: 'solar-saoc-calculation',
    outputFormat: 'Name(s) of SAC(s) intersecting or within 5km of site boundary, with shortest distance from site given in meters.'
  },
  {
    id: 'spa',
    name: 'Special Protection Area (SPA)',
    category: 'environmental',
    description: 'Selected to protect rare, threatened or vulnerable bird species.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 2000, score: 100 },
      moderate: { threshold: 1000, score: 50 },
      challenging: { threshold: 0, score: 10 }
    },
    weight: 0.15,
    batch: 2,
    outputFormat: 'Name(s) of SPA(s) intersecting or within 5km of site boundary, with shortest distance from site given in meters.'
  },
  {
    id: 'local_wildlife_sites',
    name: 'Local Wildlife Sites',
    category: 'environmental',
    description: 'Sites with significant value for wildlife, based on local knowledge.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 500, score: 100 },
      moderate: { threshold: 200, score: 70 },
      challenging: { threshold: 0, score: 40 }
    },
    weight: 0.08,
    outputFormat: 'Number of LWS fully or partially overlapping the site boundary AND Number of LWS within 5km with minimum distance.'
  },
  {
    id: 'national_nature_reserve',
    name: 'National Nature Reserve',
    category: 'environmental',
    description: 'Established to protect important habitats, species and geology.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 60 },
      challenging: { threshold: 0, score: 20 }
    },
    weight: 0.12,
    batch: 1,
    abbreviation: 'solar-nnr-calculation',
    outputFormat: 'Name(s) of NNR(s) intersecting or within 5km of site boundary, with shortest distance from site given in meters.'
  },
  {
    id: 'rspb_reserves',
    name: 'RSPB Reserves',
    category: 'environmental',
    description: 'Areas managed by RSPB for conservation of wild birds.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 60 },
      challenging: { threshold: 0, score: 30 }
    },
    weight: 0.08,
    outputFormat: 'Name(s) of RSPB Reserves intersecting or within 5km of site boundary, with shortest distance from site given in meters.'
  },
  {
    id: 'county_wildlife_sites',
    name: 'County Wildlife Sites',
    category: 'environmental',
    description: 'Sites of local importance for wildlife, designated at county level.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 500, score: 100 },
      moderate: { threshold: 200, score: 70 },
      challenging: { threshold: 0, score: 40 }
    },
    weight: 0.06,
    batch: 2,
    outputFormat: 'Number of County Wildlife Sites intersecting or within 5km of site boundary. Shortest distance in meters.'
  },
  {
    id: 'wildlife_trust',
    name: 'Wildlife Trust Reserves',
    category: 'environmental',
    description: 'Areas managed by Wildlife Trust for conservation.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 500, score: 100 },
      moderate: { threshold: 200, score: 70 },
      challenging: { threshold: 0, score: 40 }
    },
    weight: 0.06,
    outputFormat: 'Name(s) of Wildlife Trust Reserves intersecting or within 5km of site boundary, with shortest distance from site given in meters.'
  },
  {
    id: 'flood_zone_3',
    name: 'Flood Zone 3 (High Risk)',
    category: 'environmental',
    description: 'Areas with high probability of flooding.',
    bufferDistance: 1000,
    scoring: {
      good: { threshold: 500, score: 100 },
      moderate: { threshold: 100, score: 40 },
      challenging: { threshold: 0, score: 10 }
    },
    weight: 0.15,
    outputFormat: 'Percentage of site within Flood Zone 3 AND shortest distance to Flood Zone 3 boundary in meters.'
  },

  // Heritage Constraints
  {
    id: 'battlefields',
    name: 'Historic Battlefields',
    category: 'heritage',
    description: 'Historical battlefield sites deserving material consideration.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 2000, score: 100 },
      moderate: { threshold: 1000, score: 60 },
      challenging: { threshold: 500, score: 30 }
    },
    weight: 0.08,
    outputFormat: 'Name of Battlefield(s) intersecting or within 5km of site boundary, with shortest distance from site given in meters.'
  },
  {
    id: 'conservation_areas',
    name: 'Conservation Areas',
    category: 'heritage',
    description: 'Areas of special architectural or historic interest.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 75 },
      challenging: { threshold: 0, score: 50 }
    },
    weight: 0.08,
    outputFormat: 'Name(s) of Conservation Area(s) intersecting or within 5km of site boundary, with shortest distance from site given in meters.'
  },
  {
    id: 'historic_parks_gardens',
    name: 'Historic Parks & Gardens',
    category: 'heritage',
    description: 'Parks and Gardens of special historic interest.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 70 },
      challenging: { threshold: 200, score: 40 }
    },
    weight: 0.08,
    outputFormat: 'Name(s) of Historic Park & Garden(s) intersecting or within 5km of site boundary, with shortest distance from site given in meters.'
  },
  {
    id: 'listed_buildings',
    name: 'Listed Buildings',
    category: 'heritage',
    description: 'Structures of particular architectural and/or historic interest.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 2000, score: 100 },
      moderate: { threshold: 1000, score: 70 },
      challenging: { threshold: 500, score: 40 }
    },
    weight: 0.1,
    abbreviation: 'solar-lstbld-calculation',
    outputFormat: 'Number of Listed Buildings within 5km radius, with shortest distance and Grade of closest listed building.'
  },
  {
    id: 'registered_parks_gardens',
    name: 'Registered Parks & Gardens',
    category: 'heritage',
    description: 'Registers of public parks and gardens across the UK.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 70 },
      challenging: { threshold: 200, score: 40 }
    },
    weight: 0.08,
    outputFormat: 'Name(s) of Registered Park & Garden(s) intersecting or within 5km of site boundary, with shortest distance from site given in meters.'
  },
  {
    id: 'scheduled_monuments',
    name: 'Scheduled Monuments',
    category: 'heritage',
    description: 'Nationally important archaeological sites or historic buildings.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 2000, score: 100 },
      moderate: { threshold: 1000, score: 60 },
      challenging: { threshold: 500, score: 30 }
    },
    weight: 0.12,
    outputFormat: 'Name(s) of Scheduled Monument(s) intersecting or within 5km of site boundary, with shortest distance from site given in meters.'
  },

  // Landscape Constraints
  {
    id: 'aonb',
    name: 'Areas of Outstanding Natural Beauty (AONB)',
    category: 'landscape',
    description: 'Selected areas to conserve and enhance natural beauty.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 2000, score: 100 },
      moderate: { threshold: 1000, score: 60 },
      challenging: { threshold: 0, score: 20 }
    },
    weight: 0.15,
    abbreviation: 'solar-aonb-calculation',
    outputFormat: 'Name(s) of AONB(s) intersecting or within 5km of site boundary, with shortest distance and percent overlap.'
  },
  {
    id: 'country_parks',
    name: 'Country Parks',
    category: 'landscape',
    description: 'Areas designated for recreational use in the countryside.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 70 },
      challenging: { threshold: 0, score: 40 }
    },
    weight: 0.06,
    batch: 1,
    abbreviation: 'solar-cntprk-calculation',
    outputFormat: 'Name(s) of Country Park(s) intersecting or within 5km of site boundary, with shortest distance from site given in meters.'
  },
  {
    id: 'local_landscape_areas',
    name: 'Local Landscape Areas',
    category: 'landscape',
    description: 'Areas where natural or man-made landscape is of good quality.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 70 },
      challenging: { threshold: 0, score: 40 }
    },
    weight: 0.08,
    batch: 2,
    outputFormat: 'Number of Local Landscape Areas intersecting or within 5km of site boundary AND Percentage overlap.'
  },
  {
    id: 'national_character_areas',
    name: 'National Character Areas',
    category: 'landscape',
    description: 'Spatially defined areas of similar landscape character.',
    bufferDistance: 0, // Only intersection matters
    scoring: {
      good: { threshold: 0, score: 100 }, // No impact on development
      moderate: { threshold: 0, score: 100 },
      challenging: { threshold: 0, score: 100 }
    },
    weight: 0.02,
    outputFormat: 'Name(s) of National Character Area(s) intersecting site boundary AND Percentage overlap.'
  },
  {
    id: 'national_forest',
    name: 'National Forest',
    category: 'landscape',
    description: 'Project aimed at creating a new forest in the Midlands.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 70 },
      challenging: { threshold: 0, score: 40 }
    },
    weight: 0.08,
    outputFormat: 'Distance from site to National Forest (If within 5km).'
  },
  {
    id: 'national_scenic_area_scotland',
    name: 'National Scenic Area - Scotland Only',
    category: 'landscape',
    description: 'Areas in Scotland where scenery is highly valued locally.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 2000, score: 100 },
      moderate: { threshold: 1000, score: 60 },
      challenging: { threshold: 0, score: 20 }
    },
    weight: 0.15,
    outputFormat: 'Name(s) of National Scenic Area(s) intersecting or within 5km of site boundary, with shortest distance from site given in meters.'
  },
  {
    id: 'national_parks',
    name: 'National Parks',
    category: 'landscape',
    description: 'Areas of exceptional scenery protected from inappropriate development.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 5000, score: 100 },
      moderate: { threshold: 2000, score: 40 },
      challenging: { threshold: 0, score: 5 }
    },
    weight: 0.2,
    outputFormat: 'Names of National Parks intersecting or within 5km of site boundary, with shortest distance from site given in meters.'
  },
  {
    id: 'special_landscape_areas',
    name: 'Special Landscape Areas',
    category: 'landscape',
    description: 'Designated areas with locally important landscape characteristics.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 60 },
      challenging: { threshold: 0, score: 30 }
    },
    weight: 0.1,
    outputFormat: 'Name(s) of Special Landscape Area(s) intersecting or within 5km of site boundary, shortest distance and percentage overlap.'
  },
  {
    id: 'world_heritage_sites',
    name: 'World Heritage Sites',
    category: 'landscape',
    description: 'Sites of outstanding international importance deserving special protection.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 5000, score: 100 },
      moderate: { threshold: 2000, score: 30 },
      challenging: { threshold: 0, score: 5 }
    },
    weight: 0.2,
    outputFormat: 'Names of the World Heritage Sites intersecting or within 5km of site boundary, with shortest distance from site given in meters.'
  },

  // Planning Constraints
  {
    id: 'parishes',
    name: 'Parishes',
    category: 'planning',
    description: 'Administrative parish boundaries.',
    bufferDistance: 0,
    scoring: {
      good: { threshold: 0, score: 100 },
      moderate: { threshold: 0, score: 100 },
      challenging: { threshold: 0, score: 100 }
    },
    weight: 0.01,
    outputFormat: 'Name of Parish the site falls within.'
  },
  {
    id: 'local_authority_districts',
    name: 'Local Authority Districts',
    category: 'planning',
    description: 'Areas administered by a local authority.',
    bufferDistance: 0,
    scoring: {
      good: { threshold: 0, score: 100 },
      moderate: { threshold: 0, score: 100 },
      challenging: { threshold: 0, score: 100 }
    },
    weight: 0.01,
    outputFormat: 'Name of Local Authority District the site falls within.'
  },
  {
    id: 'counties',
    name: 'Counties',
    category: 'planning',
    description: 'County administrative boundaries.',
    bufferDistance: 0,
    scoring: {
      good: { threshold: 0, score: 100 },
      moderate: { threshold: 0, score: 100 },
      challenging: { threshold: 0, score: 100 }
    },
    weight: 0.01,
    outputFormat: 'Name of County the site falls within.'
  },
  {
    id: 'agricultural_land_classification',
    name: 'Agricultural Land Classification',
    category: 'planning',
    description: 'Assessment for the quality of farmland for agricultural use.',
    bufferDistance: 0,
    scoring: {
      good: { threshold: 0, score: 80 }, // Grade 4-5 land
      moderate: { threshold: 0, score: 60 }, // Grade 3b land
      challenging: { threshold: 0, score: 30 } // Grade 1-3a land
    },
    weight: 0.12,
    outputFormat: 'Percentage of site falling within Grades 1, 2, or 3a agricultural land.'
  },
  {
    id: 'coal_mining_areas',
    name: 'Coal Mining Development Areas',
    category: 'planning',
    description: 'Coal Authority data relating to historical coal mining.',
    bufferDistance: 0,
    scoring: {
      good: { threshold: 0, score: 100 }, // Not in coal area
      moderate: { threshold: 0, score: 70 }, // Secondary resource area
      challenging: { threshold: 0, score: 40 } // Development referral area
    },
    weight: 0.08,
    outputFormat: 'Site is within a Coal Mining Development Referral Area (Yes/No) AND Site is within a Secondary Coal Resource Area (Yes/No).'
  },
  {
    id: 'green_belt',
    name: 'Green Belt',
    category: 'planning',
    description: 'Specially designated countryside protected from most development.',
    bufferDistance: 0,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 30 },
      challenging: { threshold: 0, score: 10 }
    },
    weight: 0.2,
    outputFormat: 'Site is within a Greenbelt (Yes/No).'
  },
  {
    id: 'land_parcels',
    name: 'HMLR Cadastral Land Parcels',
    category: 'planning',
    description: 'Areas of land subject to ownership or leasehold rights.',
    bufferDistance: 0,
    scoring: {
      good: { threshold: 0, score: 90 }, // Few parcels
      moderate: { threshold: 0, score: 70 }, // Moderate parcels
      challenging: { threshold: 0, score: 50 } // Many parcels
    },
    weight: 0.06,
    outputFormat: 'Number of unique land parcels comprising the site area.'
  },
  {
    id: 'local_nature_reserve',
    name: 'Local Nature Reserve',
    category: 'planning',
    description: 'Statutory designation by principal local authorities.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 70 },
      challenging: { threshold: 0, score: 40 }
    },
    weight: 0.08,
    outputFormat: 'Name(s) of Local Nature Reserves intersecting or within 5km of site boundary, with shortest distance from site given in meters.'
  },
  {
    id: 'public_rights_of_way',
    name: 'Public Rights of Way',
    category: 'planning',
    description: 'Linear routes where public can pass at all times.',
    bufferDistance: 0,
    scoring: {
      good: { threshold: 0, score: 90 }, // Few intersections
      moderate: { threshold: 0, score: 70 }, // Some intersections
      challenging: { threshold: 0, score: 40 } // Many intersections
    },
    weight: 0.08,
    outputFormat: 'Number of PRoW intersecting the site, with total length in meters.'
  },
  {
    id: 'regions',
    name: 'Administrative Regions',
    category: 'planning',
    description: 'Areas of administrative control.',
    bufferDistance: 0,
    scoring: {
      good: { threshold: 0, score: 100 },
      moderate: { threshold: 0, score: 100 },
      challenging: { threshold: 0, score: 100 }
    },
    weight: 0.01,
    outputFormat: 'Region the site falls within.'
  },
  {
    id: 'crow_act_land',
    name: 'Countryside and Rights of Way Act 2000',
    category: 'planning',
    description: 'Land designated as access land under the CROW Act.',
    bufferDistance: 0,
    scoring: {
      good: { threshold: 0, score: 90 }, // No CROW land
      moderate: { threshold: 0, score: 60 }, // Partial overlap
      challenging: { threshold: 0, score: 30 } // Significant overlap
    },
    weight: 0.08,
    abbreviation: 'solar-crow-calculation',
    outputFormat: 'Presence or absence of CROW Act Access Land AND Percentage overlap of Access Land within the site.'
  },
  {
    id: 'national_trails',
    name: 'National Trails',
    category: 'planning',
    description: 'Long-distance footpaths or bridleways designated as National Trails.',
    bufferDistance: 1000,
    scoring: {
      good: { threshold: 500, score: 100 },
      moderate: { threshold: 200, score: 70 },
      challenging: { threshold: 0, score: 40 }
    },
    weight: 0.06,
    abbreviation: 'solar-trails-calculation',
    outputFormat: 'Name of National Trail intersecting the site and distance to the boundary.'
  },
  {
    id: 'geological_conservation_review',
    name: 'Geological Conservation Review',
    category: 'planning',
    description: 'Sites containing geological features of national importance.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 60 },
      challenging: { threshold: 0, score: 30 }
    },
    weight: 0.08,
    outputFormat: 'Name(s) of GCR site intersecting or within 5 km of site boundary.'
  },

  // Infrastructure Constraints
  {
    id: 'rivers_water_bodies',
    name: 'Rivers and Water Bodies',
    category: 'infrastructure',
    description: 'Water features requiring buffer distances.',
    bufferDistance: 1000,
    scoring: {
      good: { threshold: 200, score: 100 },
      moderate: { threshold: 100, score: 70 },
      challenging: { threshold: 50, score: 40 }
    },
    weight: 0.1,
    outputFormat: 'Name of River intersecting the site and distance to the boundary.'
  },
  {
    id: 'urban_areas',
    name: 'Distance to Urban Areas',
    category: 'infrastructure',
    description: 'Proximity to load centers affects transmission costs.',
    bufferDistance: 20000,
    scoring: {
      good: { threshold: 10000, score: 100 }, // Good distance
      moderate: { threshold: 20000, score: 70 }, // Moderate distance
      challenging: { threshold: 50000, score: 40 } // Too far
    },
    weight: 0.08,
    outputFormat: 'Distance to nearest urban area in kilometers.'
  },
  {
    id: 'power_lines',
    name: 'Distance to Power Lines',
    category: 'infrastructure',
    description: 'Proximity to existing grid infrastructure.',
    bufferDistance: 10000,
    scoring: {
      good: { threshold: 2000, score: 100 },
      moderate: { threshold: 5000, score: 70 },
      challenging: { threshold: 10000, score: 30 }
    },
    weight: 0.15,
    outputFormat: 'Distance to nearest power line in meters.'
  },
  {
    id: 'roads',
    name: 'Distance to Roads',
    category: 'infrastructure',
    description: 'Proximity to transportation infrastructure.',
    bufferDistance: 5000,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 2000, score: 80 },
      challenging: { threshold: 5000, score: 50 }
    },
    weight: 0.1,
    outputFormat: 'Distance to nearest road access in meters.'
  }
];

export const getConstraintsByCategory = (category: string): ConstraintConfig[] => {
  return UK_SOLAR_CONSTRAINTS.filter(constraint => constraint.category === category);
};

export const getAllConstraints = (): ConstraintConfig[] => {
  return UK_SOLAR_CONSTRAINTS;
};

export const getConstraintById = (id: string): ConstraintConfig | undefined => {
  return UK_SOLAR_CONSTRAINTS.find(constraint => constraint.id === id);
};

export const getConstraintsByBatch = (batch: number): ConstraintConfig[] => {
  return UK_SOLAR_CONSTRAINTS.filter(constraint => constraint.batch === batch);
};

export const CONSTRAINT_CATEGORIES = [
  'environmental',
  'heritage', 
  'landscape',
  'planning',
  'infrastructure',
  'climatology',
  'orography',
  'economic'
];
