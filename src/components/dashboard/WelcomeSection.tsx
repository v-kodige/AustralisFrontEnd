
interface WelcomeSectionProps {
  userName: string;
}

const WelcomeSection = ({ userName }: WelcomeSectionProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-australis-navy mb-3">
        Welcome back, {userName}
      </h1>
      <p className="text-australis-gray text-lg">
        Manage your renewable energy projects and track development scores
      </p>
    </div>
  );
};

export default WelcomeSection;
