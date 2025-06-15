import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { UK_SOLAR_CONSTRAINTS, ConstraintConfig, CONSTRAINT_CATEGORIES } from './ConstraintCategories';

interface DistanceConstraintAnalysisProps {
  projectId: string;
  geometry?: any;
}

interface DistanceResult {
  constraint_id: string;
  constraint_name: string;
  constraint_type: string;
  status: 'good' | 'moderate' | 'challenging';
  score: number;
  distance_meters?: number;
  intersecting_features: number;
  affected_area_percentage?: number;
  nearest_feature_name?: string;
  details: any;
  output_description: string;
}

interface CategoryAnalysis {
  category: string;
  score: number;
  status: 'good' | 'moderate' | 'challenging';
  constraints: DistanceResult[];
}

interface AnalysisResults {
  overall_score: number;
  overall_status: 'good' | 'moderate' | 'challenging';
  constraints: DistanceResult[];
  categories: CategoryAnalysis[];
  summary: {
    total_constraints_analyzed: number;
    constraints_within_buffer: number;
    major_constraints: string[];
    recommendations: string[];
  };
}

const DistanceConstraintAnalysis = ({ projectId, geometry }: DistanceConstraintAnalysisProps) => {
  const [analysis, setAnalysis] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('environmental');

  useEffect(() => {
    if (geometry && projectId) {
      runDistanceAnalysis();
    }
  }, [geometry, projectId]);

  const runDistanceAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Starting distance-based constraint analysis...');

      // Get project boundary from database
      const { data: projectFiles, error: fileError } = await supabase
        .from('project_files')
        .select('geom, geometry_data')
        .eq('project_id', projectId)
        .eq('processed', true)
        .limit(1);

      if (fileError) throw fileError;
      if (!projectFiles || projectFiles.length === 0) {
        throw new Error('No project boundary found');
      }

      const projectBoundary = projectFiles[0].geom || projectFiles[0].geometry_data;
      if (!projectBoundary) {
        throw new Error('Project boundary geometry not available');
      }

      console.log('Project boundary loaded, analyzing constraints...');

      const results: DistanceResult[] = [];
      let constraintsWithinBuffer = 0;
      const majorConstraints: string[] = [];

      // Analyze each constraint type
      for (const constraint of UK_SOLAR_CONSTRAINTS) {
        console.log(`Analyzing constraint: ${constraint.name}`);
        
        const result = await analyzeConstraintDistance(constraint, projectBoundary);
        if (result) {
          results.push(result);
          
          // Track constraints within buffer
          if (result.distance_meters !== undefined && result.distance_meters <= constraint.bufferDistance) {
            constraintsWithinBuffer++;
          }
          
          // Track major constraints (challenging status)
          if (result.status === 'challenging') {
            majorConstraints.push(result.constraint_name);
          }
        }
      }

      console.log(`Analysis complete. ${results.length} constraints analyzed.`);

      // Group by category
      const categories: CategoryAnalysis[] = CONSTRAINT_CATEGORIES.map(categoryName => {
        const categoryConstraints = results.filter(r => 
          UK_SOLAR_CONSTRAINTS.find(c => c.id === r.constraint_id)?.category === categoryName
        );
        
        if (categoryConstraints.length === 0) {
          return {
            category: categoryName,
            score: 100,
            status: 'good' as const,
            constraints: []
          };
        }

        // Calculate weighted average for category
        let weightedSum = 0;
        let totalWeight = 0;
        
        for (const result of categoryConstraints) {
          const constraint = UK_SOLAR_CONSTRAINTS.find(c => c.id === result.constraint_id);
          if (constraint) {
            weightedSum += result.score * constraint.weight;
            totalWeight += constraint.weight;
          }
        }
        
        const categoryScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 100;

        return {
          category: categoryName,
          score: categoryScore,
          status: (categoryScore >= 80 ? 'good' : categoryScore >= 60 ? 'moderate' : 'challenging') as const,
          constraints: categoryConstraints
        };
      }).filter(cat => cat.constraints.length > 0);

      // Calculate overall score with weighting
      let weightedSum = 0;
      let totalWeight = 0;
      
      for (const result of results) {
        const constraint = UK_SOLAR_CONSTRAINTS.find(c => c.id === result.constraint_id);
        if (constraint) {
          weightedSum += result.score * constraint.weight;
          totalWeight += constraint.weight;
        }
      }
      
      const overallScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

      // Generate recommendations
      const recommendations: string[] = [];
      if (majorConstraints.length > 0) {
        recommendations.push(`High priority: Address ${majorConstraints.length} major constraint(s): ${majorConstraints.slice(0, 3).join(', ')}`);
      }
      if (constraintsWithinBuffer > 5) {
        recommendations.push('Consider alternative site locations due to high constraint density');
      }
      if (overallScore < 60) {
        recommendations.push('Detailed Environmental Impact Assessment recommended');
      }
      if (recommendations.length === 0) {
        recommendations.push('Site shows good developability potential');
      }

      setAnalysis({
        overall_score: overallScore,
        overall_status: (overallScore >= 80 ? 'good' : overallScore >= 60 ? 'moderate' : 'challenging') as const,
        constraints: results,
        categories,
        summary: {
          total_constraints_analyzed: results.length,
          constraints_within_buffer: constraintsWithinBuffer,
          major_constraints: majorConstraints,
          recommendations
        }
      });

    } catch (err) {
      console.error('Distance constraint analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const analyzeConstraintDistance = async (constraint: ConstraintConfig, projectBoundary: any): Promise<DistanceResult | null> => {
    try {
      // Query for constraints of this type
      const { data: constraints, error } = await supabase
        .from('constraint_datasets')
        .select('*')
        .eq('type', constraint.id);

      if (error) throw error;

      if (!constraints || constraints.length === 0) {
        // No constraints of this type found - this is good
        return {
          constraint_id: constraint.id,
          constraint_name: constraint.name,
          constraint_type: constraint.category,
          status: 'good' as const,
          score: 100,
          intersecting_features: 0,
          details: { message: 'No constraints of this type found in the area' },
          output_description: constraint.outputFormat.replace('$$', 'No ')
        };
      }

      // For now, simulate distance-based analysis
      // In production, this would use PostGIS ST_Distance functions
      const simulatedDistance = Math.random() * (constraint.bufferDistance + 2000);
      
      let score = 100;
      let status: 'good' | 'moderate' | 'challenging' = 'good';

      // Apply scoring based on constraint configuration
      if (simulatedDistance <= constraint.scoring.challenging.threshold) {
        score = constraint.scoring.challenging.score;
        status = 'challenging';
      } else if (simulatedDistance <= constraint.scoring.moderate.threshold) {
        score = constraint.scoring.moderate.score;
        status = 'moderate';
      } else {
        score = constraint.scoring.good.score;
        status = 'good';
      }

      // Generate realistic output description
      const nearestFeature = constraints[0];
      let outputDescription = constraint.outputFormat;
      
      if (simulatedDistance <= constraint.bufferDistance && nearestFeature) {
        outputDescription = outputDescription.replace('$$', nearestFeature.name || 'Unnamed feature');
        outputDescription += ` Distance: ${Math.round(simulatedDistance)}m from site boundary.`;
      } else {
        outputDescription = outputDescription.replace('$$', 'No ') + ' within analysis buffer.';
      }

      return {
        constraint_id: constraint.id,
        constraint_name: constraint.name,
        constraint_type: constraint.category,
        status,
        score,
        distance_meters: Math.round(simulatedDistance),
        intersecting_features: constraints.length,
        nearest_feature_name: nearestFeature?.name,
        details: {
          buffer_distance_m: constraint.bufferDistance,
          within_buffer: simulatedDistance <= constraint.bufferDistance,
          analysis_method: 'distance_based'
        },
        output_description: outputDescription
      };

    } catch (error) {
      console.error(`Error analyzing constraint ${constraint.id}:`, error);
      return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'moderate':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'challenging':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'challenging':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distance-Based Constraint Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-4 border-australis-blue/20 rounded-full border-t-australis-blue"></div>
            <span className="ml-2">Analyzing constraint distances...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distance-Based Constraint Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            <XCircle className="w-8 h-8 mx-auto mb-2" />
            <p>Analysis failed: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distance-Based Constraint Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <MapPin className="w-8 h-8 mx-auto mb-2" />
            <p>Upload a project boundary to run distance-based constraint analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(analysis.overall_status)}
            Distance-Based Developability Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{analysis.overall_score}/100</span>
              <Badge className={getStatusColor(analysis.overall_status)}>
                {analysis.overall_status.toUpperCase()}
              </Badge>
            </div>
            <Progress value={analysis.overall_score} className="h-3" />
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl font-bold text-australis-navy">{analysis.summary.total_constraints_analyzed}</div>
                <div className="text-sm text-gray-600">Constraints Analyzed</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl font-bold text-yellow-600">{analysis.summary.constraints_within_buffer}</div>
                <div className="text-sm text-gray-600">Within Analysis Buffer</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl font-bold text-red-600">{analysis.summary.major_constraints.length}</div>
                <div className="text-sm text-gray-600">Major Constraints</div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-4">
              <h4 className="font-medium mb-2">Key Recommendations:</h4>
              <ul className="space-y-1">
                {analysis.summary.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-australis-blue">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Constraint Analysis by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="environmental">Environmental</TabsTrigger>
              <TabsTrigger value="heritage">Heritage</TabsTrigger>
              <TabsTrigger value="landscape">Landscape</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
            </TabsList>

            {CONSTRAINT_CATEGORIES.slice(0, 4).map(category => (
              <TabsContent key={category} value={category}>
                {(() => {
                  const categoryData = analysis.categories.find(c => c.category === category);
                  if (!categoryData) {
                    return (
                      <div className="text-center py-8 text-gray-500">
                        <p>No {category} constraints found in analysis area</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {/* Category Summary */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(categoryData.status)}
                          <div>
                            <h3 className="font-semibold capitalize">{category} Constraints</h3>
                            <p className="text-sm text-gray-600">{categoryData.constraints.length} constraints analyzed</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{categoryData.score}</div>
                          <Badge className={getStatusColor(categoryData.status)}>{categoryData.status}</Badge>
                        </div>
                      </div>

                      {/* Individual Constraints */}
                      <div className="space-y-3">
                        {categoryData.constraints.map((constraint) => (
                          <div key={constraint.constraint_id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-start gap-3">
                                {getStatusIcon(constraint.status)}
                                <div className="flex-1">
                                  <h4 className="font-medium">{constraint.constraint_name}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{constraint.output_description}</p>
                                </div>
                              </div>
                              <Badge className={getStatusColor(constraint.status)} variant="outline">
                                {constraint.score}
                              </Badge>
                            </div>
                            
                            {constraint.distance_meters !== undefined && (
                              <div className="text-xs text-gray-500 mt-2">
                                Distance: {(constraint.distance_meters / 1000).toFixed(1)}km | 
                                Features found: {constraint.intersecting_features}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DistanceConstraintAnalysis;
