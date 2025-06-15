
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

  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    <div ref={ref} className="flex flex-col items-center w-full">
      <div 
        className={`relative w-full max-w-lg bg-white/60 backdrop-blur-lg border border-white/30 rounded-3xl shadow-lg transition-all duration-700 ease-in-out hover:shadow-xl ${
          expandCard ? 'pb-6' : ''
        }`}
        style={{
          minHeight: expandCard ? '420px' : '320px'
        }}
      >
        {/* Main card content */}
        <div className="flex flex-row items-center px-6 py-8">
          {/* Score number on the left */}
          <div className="flex flex-col items-center justify-center min-w-[80px]">
            <span className="text-5xl font-extrabold text-australis-navy drop-shadow-sm">{score}</span>
            <span className="text-xs text-gray-500 mt-2">Score</span>
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

                // Get color variable value or fallback
                let colorHex = "#3bf5b7";
                if (legend.color === "bg-australis-aqua") colorHex = "#3bf5b7";
                if (legend.color === "bg-australis-indigo") colorHex = "#6062ff";
                if (legend.color === "bg-australis-navy") colorHex = "#3a3d5d";
                if (legend.color === "bg-australis-blue") colorHex = "#1E3A8A";

                return (
                  <circle
                    key={legend.name}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={colorHex}
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
        
        {/* Legend section as extension of the main card */}
        <div 
          className={`transition-all duration-700 ease-in-out overflow-hidden px-6 ${
            expandCard ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {/* Separator line */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-australis-navy/20 to-transparent mb-4"></div>
          
          {/* Legend items */}
          <div className="space-y-3 pb-2">
            {legends.map((legend) => (
              <div 
                key={legend.name} 
                className={`flex items-center justify-between gap-4 transition-opacity duration-500 px-4 py-3 rounded-lg hover:bg-australis-aqua/10 ${
                  showLegends ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${legend.color} border border-white/80 shadow-sm`}></div>
                  <span className="text-base text-australis-navy font-medium">{legend.name}</span>
                </div>
                <span className="font-semibold text-lg text-australis-navy">{legend.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopabilityRings;
