
import ProgressRings from './ProgressRings';

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay = ({ score }: ScoreDisplayProps) => {
  return (
    <div className="relative bg-white rounded-xl shadow-md p-6 backdrop-blur-sm border border-gray-100 flex flex-col items-center mb-8">
      <div className="mb-4 text-lg font-medium">Developability Score</div>
      <div className="relative w-40 h-40 flex items-center justify-center mb-4">
        <ProgressRings score={score} />
        <div className="absolute text-4xl font-bold">{score}</div>
      </div>
      
      <div className="text-sm text-gray-500">
        These rings represent the developability score components
      </div>
    </div>
  );
};

export default ScoreDisplay;
