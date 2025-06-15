
import ProjectCard from "@/components/ProjectCard";

interface Project {
  id: number;
  name: string;
  date: string;
  score: string;
  status: string;
  image: string;
}

interface ProjectsGridProps {
  projects: Project[];
}

const ProjectsGrid = ({ projects }: ProjectsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectsGrid;
