import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, Square } from 'lucide-react';

interface VideoBackgroundToggleProps {
  onToggle: (useVideo: boolean) => void;
  isVideo: boolean;
}

const VideoBackgroundToggle = ({ onToggle, isVideo }: VideoBackgroundToggleProps) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => onToggle(!isVideo)}
        variant="outline"
        size="sm"
        className="bg-white/80 backdrop-blur-sm border-australis-indigo/30 hover:bg-australis-indigo hover:text-white"
      >
        {isVideo ? (
          <>
            <Square className="h-4 w-4 mr-2" />
            Aurora
          </>
        ) : (
          <>
            <PlayCircle className="h-4 w-4 mr-2" />
            Video
          </>
        )}
      </Button>
    </div>
  );
};

export default VideoBackgroundToggle;