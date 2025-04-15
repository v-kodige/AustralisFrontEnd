
import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import RunningReport from './developability/RunningReport';
import ScoreDisplay from './developability/ScoreDisplay';
import ProjectDetails from './developability/ProjectDetails';

const DevelopabilityIndex = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [score, setScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef(null);
  
  useEffect(() => {
    if (inView) {
      setIsVisible(true);
      
      if (score < 88) {
        animationRef.current = setTimeout(() => {
          setScore((prev) => Math.min(prev + 1, 88));
        }, 20);
      }
      
      return () => {
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
      };
    }
  }, [inView, score]);

  return (
    <section className="py-20 bg-australis-lightGray" id="developability" ref={ref}>
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-16">
          Developability Index
        </h2>
        
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <RunningReport />
          
          <div className="flex flex-col">
            <ScoreDisplay score={score} />
            <ProjectDetails />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevelopabilityIndex;
