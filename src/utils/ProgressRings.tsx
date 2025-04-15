
import { calculateProgress } from '@/lib/utils';

interface ProgressRingsProps {
  score: number;
}

const ProgressRings = ({ score }: ProgressRingsProps) => {
  return (
    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
      <circle 
        cx="50" cy="50" r="45" 
        fill="none" 
        stroke="#f0f0f4" 
        strokeWidth="8" 
      />
      <circle 
        cx="50" cy="50" r="45" 
        fill="none" 
        stroke="#3bf5b7" 
        strokeWidth="8" 
        strokeDasharray={`${calculateProgress(score)} 283`} 
        strokeLinecap="round"
        className="transition-all duration-500 ease-out"
      />
      <circle 
        cx="50" cy="50" r="37" 
        fill="none" 
        stroke="#f0f0f4" 
        strokeWidth="6" 
      />
      <circle 
        cx="50" cy="50" r="37" 
        fill="none" 
        stroke="#6062ff" 
        strokeWidth="6" 
        strokeDasharray={`${calculateProgress(score * 0.85)} 233`} 
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
      <circle 
        cx="50" cy="50" r="29" 
        fill="none" 
        stroke="#f0f0f4" 
        strokeWidth="4" 
      />
      <circle 
        cx="50" cy="50" r="29" 
        fill="none" 
        stroke="#ff6b6b" 
        strokeWidth="4" 
        strokeDasharray={`${calculateProgress(score * 0.7)} 182`} 
        strokeLinecap="round"
        className="transition-all duration-900 ease-out"
      />
    </svg>
  );
};

export default ProgressRings;
