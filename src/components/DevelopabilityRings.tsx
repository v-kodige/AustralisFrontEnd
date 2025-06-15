
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
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        className={`relative w-full max-w-lg backdrop-blur-2xl bg-white/30 border border-white/40 rounded-3xl shadow-2xl shadow-australis-navy/10 transition-all duration-700 ease-in-out hover:shadow-3xl hover:shadow-australis-aqua/15 ${
          expandCard ? 'pb-6' : ''
        }`}
        style={{
          minHeight: expandCard ? '420px' : '320px'
        }}
      >
        {/* Floating accent elements */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-australis-aqua/30 to-australis-aqua/10 rounded-full blur-sm"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-tr from-australis-indigo/30 to-australis-indigo/10 rounded-full blur-sm"></div>
        
        {/* Main card content */}
        <div className="flex flex-row items-center px-6 py-8">
          {/* Score number with refined styling */}
          <div className="flex flex-col items-center justify-center min-w-[80px]">
            <div className="relative">
              <span className="text-5xl font-extrabold text-australis-navy drop-shadow-lg">{score}</span>
              <div className="absolute inset-0 text-5xl font-extrabold bg-gradient-to-br from-australis-navy to-australis-indigo/80 bg-clip-text text-transparent opacity-50"></div>
            </div>
            <span className="text-xs text-gray-500 mt-2 backdrop-blur-sm bg-white/20 px-2 py-1 rounded-full border border-white/30">Score</span>
          </div>
          
          {/* Enhanced rings with layered effects */}
          <div className="relative w-56 h-56 flex items-center justify-center mx-6">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-gradient-radial from-australis-aqua/10 via-transparent to-transparent rounded-full blur-xl"></div>
            
            <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 100 100">
              {legends.map((legend, index) => {
                const radius = 40 - (index * 8);
                const strokeDasharray = calculateStrokeDasharray(
                  (score / 100) * legend.score,
                  radius
                );

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
                    style={{ 
                      filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))",
                      strokeOpacity: 0.9
                    }}
                  />
                );
              })}
            </svg>
          </div>
          
          <div className="flex-1"></div>
        </div>
        
        {/* Refined legend section */}
        <div 
          className={`transition-all duration-700 ease-in-out overflow-hidden px-6 ${
            expandCard ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {/* Enhanced separator */}
          <div className="relative w-full h-px mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-australis-navy/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-sm"></div>
          </div>
          
          {/* Refined legend items */}
          <div className="space-y-3 pb-2">
            {legends.map((legend) => (
              <div 
                key={legend.name} 
                className={`group flex items-center justify-between gap-4 transition-all duration-500 px-5 py-4 rounded-xl hover:bg-gradient-to-r hover:from-australis-aqua/10 hover:to-australis-indigo/5 backdrop-blur-sm border border-transparent hover:border-white/30 hover:shadow-lg ${
                  showLegends ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`w-4 h-4 rounded-full ${legend.color} border-2 border-white/80 shadow-lg`}></div>
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-white/20 blur-sm group-hover:blur-none transition-all duration-300"></div>
                  </div>
                  <span className="text-base text-australis-navy font-medium drop-shadow-sm">{legend.name}</span>
                </div>
                <span className="font-semibold text-lg text-australis-navy backdrop-blur-sm bg-white/20 px-3 py-1 rounded-full border border-white/30 shadow-sm">
                  {legend.score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopabilityRings;
