
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Zap, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

interface REPDProject {
  id: string;
  project_name: string;
  technology_type: string;
  capacity_mw: number;
  development_status: string;
  planning_authority: string;
  region: string;
  county: string;
  easting: number;
  northing: number;
  lat: number;
  lng: number;
  application_date?: string;
  decision_date?: string;
  appeal_submitted?: string;
  appeal_decided?: string;
  operational_date?: string;
  planning_application_reference?: string;
  address: string;
  postcode: string;
  site_name?: string;
  operator?: string;
  planning_portal_reference?: string;
}

interface REPDAnalysis {
  nearbyProjects: REPDProject[];
  planningAuthority: string;
  approvalRate: number;
  averageTimelineMonths: number;
  totalCapacityMW: number;
  statusBreakdown: Record<string, number>;
  recommendations: string[];
}

interface REPDIntegrationProps {
  projectLocation: { lat: number; lng: number };
  searchRadiusKm?: number;
}

const REPDIntegration = ({ projectLocation, searchRadiusKm = 10 }: REPDIntegrationProps) => {
  const [analysis, setAnalysis] = useState<REPDAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectLocation?.lat && projectLocation?.lng) {
      analyzeREPDData();
    }
  }, [projectLocation, searchRadiusKm]);

  const analyzeREPDData = async () => {
    setLoading(true);
    setError(null);

    try {
      // For now, simulate REPD data analysis
      // In production, this would query the actual REPD database
      const mockREPDData = generateMockREPDData(projectLocation, searchRadiusKm);
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      setAnalysis(mockREPDData);
    } catch (err) {
      console.error('REPD analysis error:', err);
      setError('Failed to analyze REPD data');
    } finally {
      setLoading(false);
    }
  };

  const generateMockREPDData = (location: { lat: number; lng: number }, radius: number): REPDAnalysis => {
    // Generate realistic mock data based on location
    const projectCount = Math.floor(Math.random() * 25) + 5;
    const projects: REPDProject[] = [];

    const statusOptions = ['Operational', 'Under Construction', 'Consented', 'Application Submitted', 'Refused', 'Withdrawn'];
    const planningAuthorities = ['Cornwall Council', 'Devon County Council', 'Somerset Council', 'Wiltshire Council'];
    
    for (let i = 0; i < projectCount; i++) {
      // Generate random coordinates within radius
      const bearing = Math.random() * 360;
      const distance = Math.random() * radius;
      const lat = location.lat + (distance / 111) * Math.cos(bearing * Math.PI / 180);
      const lng = location.lng + (distance / (111 * Math.cos(location.lat * Math.PI / 180))) * Math.sin(bearing * Math.PI / 180);

      projects.push({
        id: `repd_${i}`,
        project_name: `Solar Farm ${String.fromCharCode(65 + i)}`,
        technology_type: Math.random() > 0.8 ? 'Wind' : 'Solar Photovoltaics',
        capacity_mw: Math.round((Math.random() * 45 + 5) * 10) / 10,
        development_status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
        planning_authority: planningAuthorities[Math.floor(Math.random() * planningAuthorities.length)],
        region: 'South West',
        county: 'Cornwall',
        easting: Math.floor(Math.random() * 100000) + 200000,
        northing: Math.floor(Math.random() * 100000) + 50000,
        lat,
        lng,
        application_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 3).toISOString().split('T')[0],
        address: `Site ${i + 1}, Rural Location`,
        postcode: `TR${Math.floor(Math.random() * 20) + 1} ${Math.floor(Math.random() * 9) + 1}XX`,
        operator: Math.random() > 0.5 ? 'Renewable Energy Ltd' : 'Green Power Corp'
      });
    }

    // Calculate statistics
    const operationalProjects = projects.filter(p => p.development_status === 'Operational');
    const consentedProjects = projects.filter(p => p.development_status === 'Consented');
    const refusedProjects = projects.filter(p => p.development_status === 'Refused');
    
    const approvalRate = Math.round(((operationalProjects.length + consentedProjects.length) / projects.length) * 100);
    const averageTimelineMonths = Math.floor(Math.random() * 18) + 12;
    const totalCapacityMW = projects.reduce((sum, p) => sum + p.capacity_mw, 0);

    const statusBreakdown = statusOptions.reduce((acc, status) => {
      acc[status] = projects.filter(p => p.development_status === status).length;
      return acc;
    }, {} as Record<string, number>);

    const recommendations = [];
    if (approvalRate > 75) {
      recommendations.push('High approval rate in this area suggests favorable planning environment');
    } else if (approvalRate < 50) {
      recommendations.push('Lower approval rates - consider detailed pre-application discussions');
    }
    
    if (averageTimelineMonths > 18) {
      recommendations.push('Longer than average planning timelines in this authority');
    } else {
      recommendations.push('Planning timelines appear reasonable for this authority');
    }

    if (totalCapacityMW > 200) {
      recommendations.push('High concentration of renewable projects - consider grid capacity');
    }

    return {
      nearbyProjects: projects,
      planningAuthority: planningAuthorities[0],
      approvalRate,
      averageTimelineMonths,
      totalCapacityMW: Math.round(totalCapacityMW * 10) / 10,
      statusBreakdown,
      recommendations
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'under construction':
      case 'consented':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'refused':
      case 'withdrawn':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Calendar className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'under construction':
      case 'consented':
        return 'bg-blue-100 text-blue-800';
      case 'refused':
      case 'withdrawn':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            REPD Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-4 border-australis-blue/20 rounded-full border-t-australis-blue"></div>
            <span className="ml-2">Analyzing REPD database...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            REPD Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            <XCircle className="w-8 h-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {/* Overview Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            REPD Analysis - Local Planning Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{analysis.nearbyProjects.length}</div>
              <div className="text-sm text-blue-700">Projects ({searchRadiusKm}km)</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">{analysis.approvalRate}%</div>
              <div className="text-sm text-green-700">Approval Rate</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">{analysis.averageTimelineMonths}</div>
              <div className="text-sm text-purple-700">Avg Timeline (months)</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-900">{analysis.totalCapacityMW}</div>
              <div className="text-sm text-orange-700">Total Capacity (MW)</div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Planning Authority: {analysis.planningAuthority}</h4>
            <Progress value={analysis.approvalRate} className="h-2" />
          </div>

          {/* Status Breakdown */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Project Status Breakdown</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(analysis.statusBreakdown).map(([status, count]) => (
                count > 0 && (
                  <div key={status} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      <span className="text-sm">{status}</span>
                    </div>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="font-medium mb-2">REPD Intelligence Insights:</h4>
            <ul className="space-y-1">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Nearby Renewable Energy Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto space-y-3">
            {analysis.nearbyProjects.slice(0, 10).map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{project.project_name}</h4>
                    <p className="text-sm text-gray-600">{project.technology_type} • {project.capacity_mw} MW</p>
                    <p className="text-xs text-gray-500">{project.address}</p>
                  </div>
                  <Badge className={getStatusColor(project.development_status)} variant="outline">
                    {project.development_status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {project.planning_authority}
                  </span>
                  {project.application_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Applied: {new Date(project.application_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default REPDIntegration;
