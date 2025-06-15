
import OnboardingForm from "@/components/OnboardingForm";
import DashboardHeader from "@/components/DashboardHeader";
import ProjectCreationForm from "@/components/ProjectCreationForm";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import ProjectsHeader from "@/components/dashboard/ProjectsHeader";
import ProjectsGrid from "@/components/dashboard/ProjectsGrid";
import EmptyProjects from "@/components/dashboard/EmptyProjects";
import DashboardFooter from "@/components/dashboard/DashboardFooter";
import { useDashboard } from "@/hooks/useDashboard";

const Dashboard = () => {
  const {
    user,
    showOnboarding,
    showCreateProject,
    searchTerm,
    projects,
    setSearchTerm,
    setShowCreateProject,
    handleOnboardingComplete,
    handleCreateProject,
    getUserDisplayName
  } = useDashboard();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-australis-offWhite via-white to-australis-lightBlue/10">
        <div className="animate-spin w-8 h-8 border-4 border-australis-blue/20 rounded-full border-t-australis-blue mb-3"></div>
        <div className="text-australis-gray">Loading your dashboard…</div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingForm user={user} onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-australis-offWhite via-white to-australis-lightBlue/10">
      <DashboardHeader user={user} />
      
      <div className="container-custom py-8">
        <div className="mb-12">
          <WelcomeSection userName={getUserDisplayName()} />
          
          <ProjectsHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onCreateProject={() => setShowCreateProject(true)}
          />

          {projects.length === 0 ? (
            <EmptyProjects
              searchTerm={searchTerm}
              onCreateProject={() => setShowCreateProject(true)}
            />
          ) : (
            <ProjectsGrid projects={projects} />
          )}
        </div>
      </div>

      {showCreateProject && (
        <ProjectCreationForm
          onClose={() => setShowCreateProject(false)}
          onSubmit={handleCreateProject}
        />
      )}

      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
