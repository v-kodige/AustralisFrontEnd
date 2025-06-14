
interface FeatureSectionTitleProps {
  isVisible: boolean;
}

const FeatureSectionTitle = ({ isVisible }: FeatureSectionTitleProps) => {
  return (
    <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
        Powerful features for smarter site selection
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Australis combines cutting-edge AI with comprehensive geospatial data
      </p>
    </div>
  );
};

export default FeatureSectionTitle;
