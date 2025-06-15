
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DevelopabilityScoreProps {
  projectId: string;
}

const DevelopabilityScore = ({ projectId }: DevelopabilityScoreProps) => {
  const [score, setScore] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [reportStatus, setReportStatus] = useState<string>('pending');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchLatestReport();
  }, [projectId]);

  const fetchLatestReport = async () => {
    const { data, error } = await supabase
      .from('project_reports')
      .select('*')
      .eq('project_id', projectId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    if (data && !error) {
      setScore(data.developability_score);
      setReportStatus(data.report_status);
    }
  };

  const runReport = async () => {
    setIsRunning(true);
    setProgress(0);
    setReportStatus('running');

    try {
      // Create a new report entry
      const { error } = await supabase
        .from('project_reports')
        .insert({
          project_id: projectId,
          report_status: 'running'
        });

      if (error) throw error;

      // Simulate report progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            completeReport();
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 800);

    } catch (error) {
      console.error('Error running report:', error);
      toast({
        title: "Error",
        description: "Failed to start report generation.",
        variant: "destructive"
      });
      setIsRunning(false);
    }
  };

  const completeReport = async () => {
    // Generate a mock developability score
    const mockScore = Math.floor(Math.random() * 30) + 70; // Score between 70-100

    const { error } = await supabase
      .from('project_reports')
      .update({
        developability_score: mockScore,
        report_status: 'completed',
        completed_at: new Date().toISOString(),
        constraint_analysis: generateMockConstraintData()
      })
      .eq('project_id', projectId)
      .eq('report_status', 'running');

    if (!error) {
      setScore(mockScore);
      setReportStatus('completed');
      setIsRunning(false);
      toast({
        title: "Report completed",
        description: `Developability score: ${mockScore}%`
      });
    }
  };

  const generateMockConstraintData = () => {
    return {
      planning: { score: Math.floor(Math.random() * 20) + 80, status: 'good' },
      environmental: { score: Math.floor(Math.random() * 30) + 60, status: 'moderate' },
      infrastructure: { score: Math.floor(Math.random() * 25) + 75, status: 'good' },
      grid_connection: { score: Math.floor(Math.random() * 40) + 50, status: 'challenging' },
      landscape: { score: Math.floor(Math.random() * 30) + 70, status: 'moderate' }
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="relative w-32 h-32 mx-auto">
            {/* Outer ring */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="4"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(score || progress) * 3.39} 339`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Inner content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {isRunning ? (
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(progress)}`}>
                    {Math.floor(progress)}%
                  </div>
                  <div className="text-xs text-australis-gray">Running...</div>
                </div>
              ) : score ? (
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                    {score}%
                  </div>
                  <div className="text-xs text-australis-gray">Score</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-xl text-australis-gray">--</div>
                  <div className="text-xs text-australis-gray">No data</div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-australis-navy">Developability Score</h3>
            
            {reportStatus === 'completed' && score ? (
              <Button
                onClick={runReport}
                disabled={isRunning}
                size="sm"
                variant="outline"
                className="w-full border-australis-blue/20 text-australis-blue hover:bg-australis-blue hover:text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Re-run Analysis
              </Button>
            ) : (
              <Button
                onClick={runReport}
                disabled={isRunning}
                size="sm"
                className="w-full bg-gradient-to-r from-australis-blue to-australis-teal hover:from-australis-blue/90 hover:to-australis-teal/90 text-white shadow-lg"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Analyzing...' : 'Run Report'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DevelopabilityScore;
