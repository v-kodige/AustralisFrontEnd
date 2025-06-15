
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus } from "lucide-react";

interface ProjectsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateProject: () => void;
}

const ProjectsHeader = ({ searchTerm, onSearchChange, onCreateProject }: ProjectsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-australis-gray w-4 h-4" />
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-australis-gray/20 focus:border-australis-blue bg-white/70 backdrop-blur-sm"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex items-center gap-2 border-australis-gray/20">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
        <Button 
          onClick={onCreateProject}
          className="bg-gradient-to-r from-australis-blue to-australis-teal hover:from-australis-blue/90 hover:to-australis-teal/90 text-white shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>
    </div>
  );
};

export default ProjectsHeader;
