
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";

interface EmptyProjectsProps {
  searchTerm: string;
  onCreateProject: () => void;
}

const EmptyProjects = ({ searchTerm, onCreateProject }: EmptyProjectsProps) => {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-australis-lightGray rounded-full flex items-center justify-center mx-auto mb-4">
        <FolderOpen className="w-8 h-8 text-australis-gray" />
      </div>
      <h3 className="text-lg font-medium text-australis-navy mb-2">
        {searchTerm ? 'No projects found' : 'No projects yet'}
      </h3>
      <p className="text-australis-gray mb-6">
        {searchTerm ? 'Try adjusting your search terms' : 'Create your first project to get started'}
      </p>
      {!searchTerm && (
        <Button 
          onClick={onCreateProject}
          className="bg-gradient-to-r from-australis-blue to-australis-teal hover:from-australis-blue/90 hover:to-australis-teal/90 text-white shadow-lg"
        >
          Create Your First Project
        </Button>
      )}
    </div>
  );
};

export default EmptyProjects;
