
import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const DevelopabilityRings = () => {
  const [score, setScore] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [showLegends, setShowLegends] = useState(false);
  const [expandCard, setExpandCard] = useState(false);
  
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
  
  // Set up the animation sequence
  useEffect(() => {
    if (score >= 88) {
      setTimeout(() => {
        setExpandCard(true);
        
        setTimeout(() => {
          setShowLegends(true);
        }, 500); // Delay showing legends after card expansion
      }, 300); // Small delay after score reaches 88
    }
  }, [score]);

  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef(null);

  const legends = [
    { name: "Landscape", color: "bg-australis-aqua", score: 82 },
    { name: "Environmental", color: "bg-australis-indigo", score: 76 },
    { name: "Planning", color: "bg-australis-navy", score: 68 },
    { name: "Other", color: "bg-australis-blue", score: 72 }
  ];

  const calculateStrokeDasharray = (percentage: number, radius: number) => {
    const circumference = 2 * Math.PI * radius;
    return `${(percentage / 100) * circumference} ${circumference}`;
  };

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {legends.map((legend, index) => {
            const radius = 40 - (index * 8);
            const strokeDasharray = calculateStrokeDasharray(
              (score / 100) * legend.score,
              radius
            );
            
            return (
              <circle
                key={legend.name}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={`var(--${legend.color.split('-')[2]})`}
                strokeWidth="6"
                strokeDasharray={strokeDasharray}
                className="transition-all duration-1000"
              />
            );
          })}
          <text
            x="50"
            y="50"
            className="text-2xl font-bold"
            textAnchor="middle"
            dy=".3em"
            transform="rotate(90 50 50)"
          >
            {score}
          </text>
        </svg>
      </div>
      
      <div 
        className={`mt-8 w-full space-y-3 transition-all duration-500 ease-in-out overflow-hidden ${
          expandCard ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {legends.map((legend) => (
          <div 
            key={legend.name} 
            className={`flex items-center justify-between transition-opacity duration-300 ${
              showLegends ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${legend.color}`}></div>
              <span className="text-sm text-gray-600">{legend.name}</span>
            </div>
            <span className="font-medium">{legend.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevelopabilityRings;
