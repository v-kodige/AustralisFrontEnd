
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FolderOpen, FileText, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleOpenProject = () => {
    console.log("Opening project:", project.name);
    navigate(`/project/${project.id}`);
  };

  const handleOpenReport = () => {
    console.log("Opening latest report for:", project.name);
  };

  const handleDownloadReport = () => {
    console.log("Downloading report for:", project.name);
  };

  return (
    <Card className="group bg-white border border-gray-200/60 hover:border-australis-blue/30 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <div className="w-full h-40 bg-gradient-to-br from-australis-lightGray to-australis-offWhite overflow-hidden">
            <img 
              src={project.image} 
              alt={`${project.name} preview`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="absolute top-3 right-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              project.score === 'undefined' 
                ? 'bg-australis-lightGray text-australis-gray' 
                : 'bg-gradient-to-r from-australis-aqua to-australis-teal text-white shadow-sm'
            }`}>
              {project.score}
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-australis-navy mb-2 group-hover:text-australis-blue transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-australis-gray mb-4">{project.date}</p>
          
          <div className="mb-6">
            <p className="text-xs font-medium text-australis-gray mb-2 uppercase tracking-wider">
              {project.status}
            </p>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-australis-teal" />
              <span className="text-sm font-medium text-australis-navy">Analysis Complete</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center gap-2 border-australis-blue/20 text-australis-blue hover:bg-australis-blue hover:text-white transition-all duration-200"
              onClick={handleOpenProject}
            >
              <FolderOpen className="w-4 h-4" />
              Open Project
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 border-australis-teal/20 text-australis-teal hover:bg-australis-teal hover:text-white transition-all duration-200"
                onClick={handleOpenReport}
              >
                <FileText className="w-4 h-4" />
                Report
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 border-australis-indigo/20 text-australis-indigo hover:bg-australis-indigo hover:text-white transition-all duration-200"
                onClick={handleDownloadReport}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
