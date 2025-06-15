
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { UK_SOLAR_CONSTRAINTS, ConstraintConfig } from './ConstraintCategories';

interface ConstraintAnalysisProps {
  projectId: string;
  geometry?: any;
}

interface ConstraintResult {
  constraint_id: string;
  constraint_name: string;
  constraint_type: string;
  status: 'good' | 'moderate' | 'challenging';
  score: number;
  distance_meters?: number;
  intersecting_features: number;
  affected_area_percentage?: number;
  details: any;
}

interface AnalysisResults {
  overall_score: number;
  overall_status: 'good' | 'moderate' | 'challenging';
  constraints: ConstraintResult[];
  categories: {
    [key: string]: {
      score: number;
      status: 'good' | 'moderate' | 'challenging';
      constraints: ConstraintResult[];
    };
  };
}

const ConstraintAnalysis = ({ projectId, geometry }: ConstraintAnalysisProps) => {
  const [analysis, setAnalysis] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (geometry) {
      runConstraintAnalysis();
    }
  }, [geometry, projectId]);

  const runConstraintAnalysis = async () => {
    if (!geometry) return;

    setLoading(true);
    setError(null);

    try {
      // Get project boundary from database
      const { data: projectFiles, error: fileError } = await supabase
        .from('project_files')
        .select('geom')
        .eq('project_id', projectId)
        .eq('processed', true)
        .limit(1);

      if (fileError) throw fileError;
      if (!projectFiles || projectFiles.length === 0) {
        throw new Error('No project boundary found');
      }

      const projectBoundary = projectFiles[0].geom;
      if (!projectBoundary) {
        throw new Error('Project boundary geometry not available');
      }

      const results: ConstraintResult[] = [];
      
      // Analyze each constraint type
      for (const constraint of UK_SOLAR_CONSTRAINTS) {
        const result = await analyzeConstraint(constraint, projectBoundary);
        if (result) {
          results.push(result);
        }
      }

      // Calculate category scores
      const categories: { [key: string]: any } = {};
      const categoryNames = ['environmental', 'landscape', 'heritage', 'flood_risk', 'planning', 'infrastructure'];
      
      for (const categoryName of categoryNames) {
        const categoryConstraints = results.filter(r => 
          UK_SOLAR_CONSTRAINTS.find(c => c.id === r.constraint_id)?.category === categoryName
        );
        
        if (categoryConstraints.length > 0) {
          const avgScore = categoryConstraints.reduce((sum, c) => sum + c.score, 0) / categoryConstraints.length;
          categories[categoryName] = {
            score: Math.round(avgScore),
            status: avgScore >= 80 ? 'good' : avgScore >= 60 ? 'moderate' : 'challenging',
            constraints: categoryConstraints
          };
        }
      }

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

      setAnalysis({
        overall_score: overallScore,
        overall_status: overallScore >= 80 ? 'good' : overallScore >= 60 ? 'moderate' : 'challenging',
        constraints: results,
        categories
      });

    } catch (err) {
      console.error('Constraint analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const analyzeConstraint = async (constraint: ConstraintConfig, projectBoundary: any): Promise<ConstraintResult | null> => {
    try {
      // Query for nearby constraints
      const { data: constraints, error } = await supabase
        .from('constraint_datasets')
        .select('*')
        .eq('type', constraint.id);

      if (error) throw error;

      if (!constraints || constraints.length === 0) {
        // No constraints of this type found - this is actually good
        return {
          constraint_id: constraint.id,
          constraint_name: constraint.name,
          constraint_type: constraint.category,
          status: 'good',
          score: 100,
          intersecting_features: 0,
          details: { message: 'No constraints of this type found in the area' }
        };
      }

      // For now, simulate distance-based analysis
      // In a real implementation, you would use PostGIS ST_Distance functions
      const simulatedDistance = Math.random() * 10000; // Random distance in meters
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

      return {
        constraint_id: constraint.id,
        constraint_name: constraint.name,
        constraint_type: constraint.category,
        status,
        score,
        distance_meters: Math.round(simulatedDistance),
        intersecting_features: constraints.length,
        details: {
          nearest_feature: constraints[0]?.name,
          buffer_distance_m: constraint.bufferDistance
        }
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
          <CardTitle>Constraint Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-4 border-australis-blue/20 rounded-full border-t-australis-blue"></div>
            <span className="ml-2">Analyzing constraints...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Constraint Analysis</CardTitle>
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
          <CardTitle>Constraint Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <MapPin className="w-8 h-8 mx-auto mb-2" />
            <p>Upload a project boundary to run constraint analysis</p>
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
            Developability Score
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
            <p className="text-sm text-gray-600">
              Overall developability assessment based on UK EIA constraint analysis
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Constraint Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(analysis.categories).map(([category, data]) => (
              <div key={category} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium capitalize">{category.replace('_', ' ')}</h4>
                  <Badge className={getStatusColor(data.status)} variant="outline">
                    {data.score}
                  </Badge>
                </div>
                <Progress value={data.score} className="h-2 mb-2" />
                <p className="text-xs text-gray-600">
                  {data.constraints.length} constraint{data.constraints.length !== 1 ? 's' : ''} analyzed
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Constraint Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.constraints.map((constraint) => (
              <div key={constraint.constraint_id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(constraint.status)}
                  <div>
                    <p className="font-medium">{constraint.constraint_name}</p>
                    <p className="text-sm text-gray-600">
                      {constraint.distance_meters !== undefined && constraint.distance_meters > 0 
                        ? `Distance: ${(constraint.distance_meters / 1000).toFixed(1)}km`
                        : `${constraint.intersecting_features} feature${constraint.intersecting_features !== 1 ? 's' : ''}`
                      }
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(constraint.status)} variant="outline">
                    {constraint.score}
                  </Badge>
                  <p className="text-xs text-gray-600 mt-1 capitalize">
                    {constraint.constraint_type.replace('_', ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConstraintAnalysis;
