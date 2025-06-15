
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PDFReportGeneratorProps {
  projectId: string;
  projectName: string;
  analysis: any;
}

const PDFReportGenerator = ({ projectId, projectName, analysis }: PDFReportGeneratorProps) => {
  const [generating, setGenerating] = useState(false);

  const generatePDFReport = async () => {
    setGenerating(true);
    
    try {
      // Create HTML content for the report
      const reportContent = generateReportHTML();
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Unable to open print window');
      }

      printWindow.document.write(reportContent);
      printWindow.document.close();

      // Trigger print dialog
      printWindow.focus();
      printWindow.print();
      
      // Close the window after printing
      setTimeout(() => {
        printWindow.close();
      }, 1000);

      toast({
        title: "Report Generated",
        description: "Your constraint analysis report is ready for download.",
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const getRAGStatus = (score: number) => {
    if (score >= 80) return { color: '#10b981', text: 'GREEN', description: 'Low Risk - Suitable for development' };
    if (score >= 60) return { color: '#f59e0b', text: 'AMBER', description: 'Medium Risk - Development possible with mitigation' };
    return { color: '#ef4444', text: 'RED', description: 'High Risk - Significant constraints present' };
  };

  const generateReportHTML = () => {
    const ragOverall = getRAGStatus(analysis?.overall_score || 0);
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Constraint Analysis Report - ${projectName}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.6; 
            color: #333;
        }
        .header { 
            text-align: center; 
            border-bottom: 3px solid #0ea5e9; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
        }
        .logo { 
            font-size: 28px; 
            font-weight: bold; 
            color: #0ea5e9; 
            margin-bottom: 10px; 
        }
        .project-title { 
            font-size: 24px; 
            color: #1e293b; 
            margin-bottom: 5px; 
        }
        .report-date { 
            color: #64748b; 
            font-size: 14px; 
        }
        .executive-summary { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin-bottom: 30px; 
            border-left: 4px solid ${ragOverall.color}; 
        }
        .rag-status { 
            display: inline-block; 
            padding: 8px 16px; 
            border-radius: 20px; 
            color: white; 
            font-weight: bold; 
            background-color: ${ragOverall.color}; 
            margin: 10px 0; 
        }
        .score-circle { 
            display: inline-block; 
            width: 80px; 
            height: 80px; 
            border-radius: 50%; 
            background: conic-gradient(${ragOverall.color} ${(analysis?.overall_score || 0) * 3.6}deg, #e5e7eb 0deg); 
            position: relative; 
            margin: 0 20px; 
            vertical-align: middle; 
        }
        .score-text { 
            position: absolute; 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%); 
            font-weight: bold; 
            font-size: 18px; 
        }
        .category-section { 
            margin: 20px 0; 
            page-break-inside: avoid; 
        }
        .category-title { 
            font-size: 18px; 
            font-weight: bold; 
            color: #1e293b; 
            border-bottom: 2px solid #e5e7eb; 
            padding-bottom: 8px; 
            margin-bottom: 15px; 
        }
        .constraint-item { 
            margin: 10px 0; 
            padding: 12px; 
            border: 1px solid #e5e7eb; 
            border-radius: 6px; 
            background: #fafafa; 
        }
        .constraint-name { 
            font-weight: bold; 
            color: #1e293b; 
        }
        .constraint-description { 
            margin: 8px 0; 
            color: #64748b; 
        }
        .constraint-status { 
            display: inline-block; 
            padding: 4px 12px; 
            border-radius: 12px; 
            font-size: 12px; 
            font-weight: bold; 
            color: white; 
        }
        .status-good { background-color: #10b981; }
        .status-moderate { background-color: #f59e0b; }
        .status-challenging { background-color: #ef4444; }
        .recommendations { 
            background: #eff6ff; 
            padding: 20px; 
            border-radius: 8px; 
            border-left: 4px solid #0ea5e9; 
        }
        .footer { 
            margin-top: 40px; 
            text-align: center; 
            color: #64748b; 
            font-size: 12px; 
            border-top: 1px solid #e5e7eb; 
            padding-top: 20px; 
        }
        @media print {
            body { margin: 0; }
            .page-break { page-break-before: always; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">AUSTRALIS</div>
        <div class="project-title">Solar Farm Constraint Analysis Report</div>
        <div style="font-size: 20px; color: #0ea5e9; margin: 10px 0;">${projectName}</div>
        <div class="report-date">Generated on ${new Date().toLocaleDateString('en-GB', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</div>
    </div>

    <div class="executive-summary">
        <h2 style="margin-top: 0; color: #1e293b;">Executive Summary</h2>
        <div style="display: flex; align-items: center; margin: 20px 0;">
            <div>
                <div class="rag-status">${ragOverall.text} STATUS</div>
                <div style="font-size: 16px; margin: 10px 0;"><strong>Overall Score: ${analysis?.overall_score || 0}/100</strong></div>
                <div style="color: #64748b;">${ragOverall.description}</div>
            </div>
            <div class="score-circle">
                <div class="score-text">${analysis?.overall_score || 0}%</div>
            </div>
        </div>
        
        <div style="margin-top: 20px;">
            <strong>Analysis Summary:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>${analysis?.summary?.total_constraints_analyzed || 0} constraints analyzed across multiple categories</li>
                <li>${analysis?.summary?.constraints_within_buffer || 0} constraints found within analysis buffers</li>
                <li>${analysis?.summary?.major_constraints?.length || 0} major constraints requiring attention</li>
            </ul>
        </div>
    </div>

    ${analysis?.categories?.map((category: any) => {
      const ragStatus = getRAGStatus(category.score);
      return `
        <div class="category-section">
            <div class="category-title">${category.category.charAt(0).toUpperCase() + category.category.slice(1).replace('_', ' ')} Constraints</div>
            <div style="margin-bottom: 15px;">
                <span class="constraint-status status-${category.status}">${ragStatus.text}</span>
                <span style="margin-left: 10px; font-weight: bold;">Score: ${category.score}/100</span>
            </div>
            <div style="color: #64748b; margin-bottom: 15px;">${ragStatus.description}</div>
            
            ${category.constraints?.map((constraint: any) => `
                <div class="constraint-item">
                    <div class="constraint-name">${constraint.constraint_name}</div>
                    <div class="constraint-description">${constraint.output_description}</div>
                    <div style="margin-top: 8px;">
                        <span class="constraint-status status-${constraint.status}">${constraint.status.toUpperCase()}</span>
                        <span style="margin-left: 10px;">Score: ${constraint.score}/100</span>
                        ${constraint.distance_meters ? `<span style="margin-left: 15px; color: #64748b;">Distance: ${(constraint.distance_meters / 1000).toFixed(1)}km</span>` : ''}
                    </div>
                </div>
            `).join('') || ''}
        </div>
      `;
    }).join('') || ''}

    <div class="page-break"></div>
    
    <div class="recommendations">
        <h2 style="margin-top: 0; color: #1e293b;">Key Recommendations</h2>
        <ul style="margin: 10px 0; padding-left: 20px;">
            ${analysis?.summary?.recommendations?.map((rec: string) => `<li style="margin: 8px 0;">${rec}</li>`).join('') || '<li>No specific recommendations at this time</li>'}
        </ul>
    </div>

    <div style="margin-top: 30px;">
        <h2 style="color: #1e293b;">Planning Guidance</h2>
        <p>This report provides a preliminary assessment of environmental and planning constraints for solar farm development. The analysis should be used as a starting point for detailed site investigations and consultation with relevant authorities.</p>
        
        <p><strong>Next Steps:</strong></p>
        <ul style="padding-left: 20px;">
            <li>Conduct detailed environmental surveys for high-risk constraints</li>
            <li>Engage with local planning authorities for pre-application advice</li>
            <li>Consider constraint mitigation measures where applicable</li>
            <li>Review updated constraint data periodically</li>
        </ul>
    </div>

    <div class="footer">
        <p>This report was generated by Australis - Solar Farm Development Platform</p>
        <p>Report ID: ${projectId} | Generated: ${new Date().toISOString()}</p>
        <p><em>This analysis is based on available spatial data and should be verified through detailed site surveys</em></p>
    </div>
</body>
</html>
    `;
  };

  return (
    <Button
      onClick={generatePDFReport}
      disabled={generating || !analysis}
      variant="outline"
      className="flex items-center gap-2"
    >
      {generating ? (
        <div className="animate-spin w-4 h-4 border-2 border-current rounded-full border-t-transparent" />
      ) : (
        <FileDown className="w-4 h-4" />
      )}
      {generating ? 'Generating...' : 'Download PDF Report'}
    </Button>
  );
};

export default PDFReportGenerator;
