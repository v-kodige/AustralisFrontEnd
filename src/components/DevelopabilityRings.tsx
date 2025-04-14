
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const DevelopabilityRings = () => {
  const [score, setScore] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [showLegends, setShowLegends] = useState(false);
  
  useEffect(() => {
    if (inView) {
      const interval = setInterval(() => {
        setScore((prev) => {
          if (prev >= 88) {
            clearInterval(interval);
            setShowLegends(true);
            return 88;
          }
          return prev + 1;
        });
      }, 20);
      
      return () => clearInterval(interval);
    }
  }, [inView]);

  const legends = [
    { name: "Landscape", color: "bg-australis-aqua", score: "82%" },
    { name: "Environmental", color: "bg-australis-indigo", score: "76%" },
    { name: "Planning", color: "bg-australis-navy", score: "68%" },
    { name: "Other", color: "bg-australis-blue", score: "72%" }
  ];

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {legends.map((legend, index) => {
            const radius = 40 - (index * 8);
            const circumference = 2 * Math.PI * radius;
            const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;
            const delay = index * 0.2;
            
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
                style={{ transitionDelay: `${delay}s` }}
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
      
      {showLegends && (
        <div className="mt-8 w-full space-y-3 animate-fade-in">
          {legends.map((legend) => (
            <div key={legend.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${legend.color}`}></div>
                <span className="text-sm text-gray-600">{legend.name}</span>
              </div>
              <span className="font-medium">{legend.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DevelopabilityRings;
