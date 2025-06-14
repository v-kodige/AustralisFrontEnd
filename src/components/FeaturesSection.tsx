
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import FeatureSectionTitle from './features/FeatureSectionTitle';
import FeatureTabs from './features/FeatureTabs';

const FeaturesSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (inView) {
      setIsVisible(true);
    }
  }, [inView]);

  return (
    <section id="features" className="py-24 bg-australis-darkBlue" ref={ref}>
      <div className="container-custom">
        <FeatureSectionTitle isVisible={isVisible} />
        <FeatureTabs />
      </div>
    </section>
  );
};

export default FeaturesSection;

