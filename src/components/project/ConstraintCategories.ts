
export interface ConstraintConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  bufferDistance: number; // meters
  scoring: {
    good: { threshold: number; score: number; };
    moderate: { threshold: number; score: number; };
    challenging: { threshold: number; score: number; };
  };
  weight: number; // for overall developability score
}

export const UK_SOLAR_CONSTRAINTS: ConstraintConfig[] = [
  // Environmental Constraints
  {
    id: 'sssi',
    name: 'Sites of Special Scientific Interest',
    category: 'environmental',
    description: 'SSSI designations - major constraint for solar development',
    bufferDistance: 500,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 60 },
      challenging: { threshold: 0, score: 20 }
    },
    weight: 0.2
  },
  {
    id: 'sac',
    name: 'Special Areas of Conservation',
    category: 'environmental',
    description: 'European designated sites for habitat conservation',
    bufferDistance: 2000,
    scoring: {
      good: { threshold: 5000, score: 100 },
      moderate: { threshold: 2000, score: 50 },
      challenging: { threshold: 0, score: 10 }
    },
    weight: 0.15
  },
  {
    id: 'spa',
    name: 'Special Protection Areas',
    category: 'environmental',
    description: 'European designated sites for bird conservation',
    bufferDistance: 2000,
    scoring: {
      good: { threshold: 5000, score: 100 },
      moderate: { threshold: 2000, score: 50 },
      challenging: { threshold: 0, score: 10 }
    },
    weight: 0.15
  },
  {
    id: 'ramsar',
    name: 'Ramsar Sites',
    category: 'environmental',
    description: 'Wetlands of international importance',
    bufferDistance: 2000,
    scoring: {
      good: { threshold: 5000, score: 100 },
      moderate: { threshold: 2000, score: 50 },
      challenging: { threshold: 0, score: 10 }
    },
    weight: 0.1
  },
  {
    id: 'ancient_woodland',
    name: 'Ancient Woodland',
    category: 'environmental',
    description: 'Ancient and semi-natural woodlands',
    bufferDistance: 500,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 70 },
      challenging: { threshold: 0, score: 30 }
    },
    weight: 0.1
  },

  // Landscape & Heritage Constraints
  {
    id: 'aonb',
    name: 'Areas of Outstanding Natural Beauty',
    category: 'landscape',
    description: 'AONB designations - significant landscape constraint',
    bufferDistance: 0,
    scoring: {
      good: { threshold: 2000, score: 100 },
      moderate: { threshold: 1000, score: 60 },
      challenging: { threshold: 0, score: 20 }
    },
    weight: 0.15
  },
  {
    id: 'national_park',
    name: 'National Parks',
    category: 'landscape',
    description: 'National Park designations - major landscape constraint',
    bufferDistance: 0,
    scoring: {
      good: { threshold: 5000, score: 100 },
      moderate: { threshold: 2000, score: 40 },
      challenging: { threshold: 0, score: 5 }
    },
    weight: 0.2
  },
  {
    id: 'listed_buildings',
    name: 'Listed Buildings',
    category: 'heritage',
    description: 'Listed buildings requiring heritage assessment',
    bufferDistance: 1000,
    scoring: {
      good: { threshold: 2000, score: 100 },
      moderate: { threshold: 1000, score: 70 },
      challenging: { threshold: 500, score: 40 }
    },
    weight: 0.08
  },
  {
    id: 'scheduled_monuments',
    name: 'Scheduled Monuments',
    category: 'heritage',
    description: 'Ancient monuments - significant heritage constraint',
    bufferDistance: 1000,
    scoring: {
      good: { threshold: 2000, score: 100 },
      moderate: { threshold: 1000, score: 60 },
      challenging: { threshold: 500, score: 30 }
    },
    weight: 0.1
  },
  {
    id: 'conservation_areas',
    name: 'Conservation Areas',
    category: 'heritage',
    description: 'Areas of special architectural or historic interest',
    bufferDistance: 500,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 75 },
      challenging: { threshold: 0, score: 50 }
    },
    weight: 0.05
  },

  // Flood Risk Constraints
  {
    id: 'flood_zone_3',
    name: 'Flood Zone 3',
    category: 'flood_risk',
    description: 'High probability of flooding - major constraint',
    bufferDistance: 0,
    scoring: {
      good: { threshold: 500, score: 100 },
      moderate: { threshold: 100, score: 40 },
      challenging: { threshold: 0, score: 10 }
    },
    weight: 0.15
  },
  {
    id: 'flood_zone_2',
    name: 'Flood Zone 2',
    category: 'flood_risk',
    description: 'Medium probability of flooding',
    bufferDistance: 0,
    scoring: {
      good: { threshold: 200, score: 100 },
      moderate: { threshold: 50, score: 70 },
      challenging: { threshold: 0, score: 40 }
    },
    weight: 0.1
  },

  // Planning Policy Constraints
  {
    id: 'green_belt',
    name: 'Green Belt',
    category: 'planning',
    description: 'Green Belt land - significant planning constraint',
    bufferDistance: 0,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 30 },
      challenging: { threshold: 0, score: 10 }
    },
    weight: 0.2
  },
  {
    id: 'local_green_space',
    name: 'Local Green Space',
    category: 'planning',
    description: 'Locally designated green spaces',
    bufferDistance: 200,
    scoring: {
      good: { threshold: 500, score: 100 },
      moderate: { threshold: 200, score: 70 },
      challenging: { threshold: 0, score: 40 }
    },
    weight: 0.05
  },

  // Infrastructure & Access Constraints
  {
    id: 'major_roads',
    name: 'Major Roads (A-roads, Motorways)',
    category: 'infrastructure',
    description: 'Distance to major transport infrastructure',
    bufferDistance: 0,
    scoring: {
      good: { threshold: 2000, score: 60 }, // Too close is bad for access
      moderate: { threshold: 5000, score: 100 }, // Sweet spot
      challenging: { threshold: 10000, score: 40 } // Too far is challenging
    },
    weight: 0.08
  },
  {
    id: 'electrical_substations',
    name: 'Electrical Substations',
    category: 'infrastructure',
    description: 'Distance to electrical grid connection points',
    bufferDistance: 0,
    scoring: {
      good: { threshold: 5000, score: 100 },
      moderate: { threshold: 10000, score: 70 },
      challenging: { threshold: 20000, score: 30 }
    },
    weight: 0.15
  },
  {
    id: 'residential_areas',
    name: 'Residential Areas',
    category: 'infrastructure',
    description: 'Distance from residential developments for visual impact',
    bufferDistance: 500,
    scoring: {
      good: { threshold: 1000, score: 100 },
      moderate: { threshold: 500, score: 70 },
      challenging: { threshold: 200, score: 40 }
    },
    weight: 0.1
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
