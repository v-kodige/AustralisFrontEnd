
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FolderOpen, FileText } from "lucide-react";

interface Project {
  id: number;
  name: string;
  date: string;
  score: string;
  status: string;
  image: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const handleOpenProject = () => {
    console.log("Opening project:", project.name);
  };

  const handleOpenReport = () => {
    console.log("Opening latest report for:", project.name);
  };

  const handleDownloadReport = () => {
    console.log("Downloading report for:", project.name);
  };

  return (
    <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
          <p className="text-sm text-gray-500 mb-4">{project.date}</p>
          
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">{project.status}:</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              project.score === 'undefined' 
                ? 'bg-gray-100 text-gray-600' 
                : 'bg-green-100 text-green-800'
            }`}>
              {project.score}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center gap-2"
              onClick={handleOpenProject}
            >
              <FolderOpen className="w-4 h-4" />
              Open Project
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center gap-2"
              onClick={handleOpenReport}
            >
              <FileText className="w-4 h-4" />
              Open Latest Report
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center gap-2"
              onClick={handleDownloadReport}
            >
              <Download className="w-4 h-4" />
              Download Latest Report
            </Button>
          </div>

          <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={project.image} 
              alt={`${project.name} preview`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
