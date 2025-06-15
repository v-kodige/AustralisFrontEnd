
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface ReportTabsProps {
  projectId: string;
}

const ReportTabs = ({ projectId }: ReportTabsProps) => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('project_reports')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'project_reports', filter: `project_id=eq.${projectId}` },
        () => {
          fetchReportData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [projectId]);

  const fetchReportData = async () => {
    const { data, error } = await supabase
      .from('project_reports')
      .select('*')
      .eq('project_id', projectId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    if (data && !error) {
      setReportData(data);
    }
    setLoading(false);
  };

  const getStatusIcon = (status: string, score?: number) => {
    if (status === 'good' || (score && score >= 80)) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    if (status === 'moderate' || (score && score >= 60)) {
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
    if (status === 'challenging' || (score && score < 60)) {
      return <XCircle className="w-4 h-4 text-red-600" />;
    }
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  const getStatusColor = (status: string, score?: number) => {
    if (status === 'good' || (score && score >= 80)) return 'bg-green-100 text-green-800';
    if (status === 'moderate' || (score && score >= 60)) return 'bg-yellow-100 text-yellow-800';
    if (status === 'challenging' || (score && score < 60)) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reportData || !reportData.constraint_analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-australis-navy">
            Constraint Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-australis-gray">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No analysis data available yet.</p>
            <p className="text-sm">Run a report to see detailed constraint analysis.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const constraints = reportData.constraint_analysis;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-australis-navy">
          Constraint Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="environmental">Environmental</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(constraints).map(([key, data]: [string, any]) => (
                <div key={key} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-australis-navy capitalize">
                      {key.replace('_', ' ')}
                    </h4>
                    {getStatusIcon(data.status, data.score)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-australis-navy">
                      {data.score}%
                    </span>
                    <Badge className={getStatusColor(data.status, data.score)}>
                      {data.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="planning" className="space-y-4">
            <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg font-semibold text-australis-navy mb-4">Planning Constraints</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Local Development Plan</span>
                  <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Green Belt Status</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Conservation Areas</span>
                  <Badge className="bg-green-100 text-green-800">Clear</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="environmental" className="space-y-4">
            <div className="p-6 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
              <h3 className="text-lg font-semibold text-australis-navy mb-4">Environmental Constraints</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Protected Habitats</span>
                  <Badge className="bg-green-100 text-green-800">No Issues</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Flood Risk</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Zone 2</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>SSSI Buffer</span>
                  <Badge className="bg-red-100 text-red-800">Within 500m</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReportTabs;
