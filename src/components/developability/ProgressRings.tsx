
import { calculateProgress } from '@/lib/utils';

interface ProgressRingsProps {
  score: number;
}

const ProgressRings = ({ score }: ProgressRingsProps) => {
  // Calculate scaled percentages for each ring
  const outerRingPercent = score;
  const middleRingPercent = score * 0.85;
  const innerRingPercent = score * 0.7;

  return (
    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
      {/* Background rings */}
      <circle 
        cx="50" cy="50" r="45" 
        fill="none" 
        stroke="#f0f0f4" 
        strokeWidth="8" 
      />
      <circle 
        cx="50" cy="50" r="35" 
        fill="none" 
        stroke="#f0f0f4" 
        strokeWidth="6" 
      />
      <circle 
        cx="50" cy="50" r="25" 
        fill="none" 
        stroke="#f0f0f4" 
        strokeWidth="4" 
      />

      {/* Colored progress rings */}
      <circle 
        cx="50" cy="50" r="45" 
        fill="none" 
        stroke="#3bf5b7" 
        strokeWidth="8" 
        strokeDasharray={`${calculateProgress(outerRingPercent)} 283`} 
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
      <circle 
        cx="50" cy="50" r="35" 
        fill="none" 
        stroke="#6062ff" 
        strokeWidth="6" 
        strokeDasharray={`${calculateProgress(middleRingPercent)} 220`} 
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
      <circle 
        cx="50" cy="50" r="25" 
        fill="none" 
        stroke="#ff6b6b" 
        strokeWidth="4" 
        strokeDasharray={`${calculateProgress(innerRingPercent)} 157`} 
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
};

export default ProgressRings;
