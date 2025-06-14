
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
    let animationFrameId: number;
    if (inView) {
      let start: number | null = null;
      const animateScore = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const duration = 1500; // Animate over 1.5 seconds
        const nextScore = Math.min(Math.floor((progress / duration) * 88), 88);
        setScore(nextScore);
        if (progress < duration) {
          animationFrameId = requestAnimationFrame(animateScore);
        }
      };
      animationFrameId = requestAnimationFrame(animateScore);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [inView]);

  useEffect(() => {
    if (score >= 88) {
      setTimeout(() => {
        setExpandCard(true);

        setTimeout(() => {
          setShowLegends(true);
        }, 500);
      }, 300);
    }
  }, [score]);

  const legends = [
    { name: "Landscape", color: "#3bf5b7", score: 82 },
    { name: "Environmental", color: "#6062ff", score: 76 },
    { name: "Planning", color: "#3a3d5d", score: 68 },
    { name: "Other", color: "#002060", score: 72 }
  ];

  const calculateStrokeDasharray = (percentage: number, radius: number) => {
    const circumference = 2 * Math.PI * radius;
    return `${(percentage / 100) * circumference} ${circumference}`;
  };

  return (
    <div ref={ref} className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-lg min-h-[420px] border border-border rounded-3xl shadow-lg flex flex-row items-center px-6 py-8 mb-6 transition-shadow hover:shadow-xl" style={{ backgroundColor: '#f0f0f4' }}>
        {/* Score number on the left */}
        <div className="flex flex-col items-center justify-center min-w-[80px]">
          <span className="text-5xl font-extrabold drop-shadow-sm" style={{ color: '#002060' }}>{score}</span>
          <span className="text-xs mt-2" style={{ color: '#3a3d5d' }}>Score</span>
        </div>
        {/* Rings in the center */}
        <div className="relative w-56 h-56 flex items-center justify-center mx-6">
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
                  stroke={legend.color}
                  strokeWidth="6"
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                  style={{ filter: "drop-shadow(0 1px 6px rgba(0,0,0,0.04))" }}
                />
              );
            })}
          </svg>
        </div>
        {/* Empty space for flex balance */}
        <div className="flex-1"></div>
      </div>
      
      <div 
        className={`mt-3 w-full max-w-lg space-y-3 transition-all duration-700 ease-in-out overflow-hidden ${
          expandCard ? 'max-h-96 opacity-100 py-6' : 'max-h-0 opacity-0 py-0'
        }`}
        style={{
          backgroundColor: '#f0f0f4',
          borderRadius: '1.5rem',
          boxShadow: '0 5px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(58, 61, 93, 0.2)'
        }}
      >
        {legends.map((legend) => (
          <div 
            key={legend.name} 
            className={`flex items-center justify-between gap-4 transition-opacity duration-500 px-6 py-3 rounded-lg hover:bg-turquoise/20 ${
              showLegends ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: legend.color, borderColor: '#3a3d5d' }}></div>
              <span className="text-base" style={{ color: '#002060' }}>{legend.name}</span>
            </div>
            <span className="font-semibold text-lg" style={{ color: '#002060' }}>{legend.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevelopabilityRings;
