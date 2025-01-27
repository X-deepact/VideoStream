import { Heart, MessageSquare, Share2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { calculateElapsedTime, getFormattedElapsedTime } from '@/lib/date-time';

interface ComponentProps {
  isStreamStarted: boolean;
  viewerCount: number;
  likeCount: number; // here, like means all types of emotions
  commentCount: number;
  sharedCount: number;
  startedAt?: string;
}

const LiveIndicator = (props: ComponentProps) => {
  const {
    isStreamStarted,
    viewerCount,
    likeCount,
    commentCount,
    sharedCount,
    startedAt,
  } = props;

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isStreamStarted) return;

    const initialElapsedTime = calculateElapsedTime(
      startedAt || new Date().toISOString()
    );
    setSeconds(initialElapsedTime);

    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isStreamStarted, startedAt]);

  if (!isStreamStarted) return null;

  return (
    <div className="flex gap-2">
      <div className="flex items-center space-x-2 bg-red-500 text-white rounded-sm px-2 py-1 text-xs shadow-md">
        <span className="font-bold uppercase text-xs">Live</span>
        <span style={{ width: '40px', textAlign: 'center' }}>
          {getFormattedElapsedTime(seconds)}
        </span>
      </div>
      <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-md rounded-sm px-2 py-1 text-sm text-gray-800 shadow-md">
        <Users className="w-3 h-3" />
        <span className="font-medium text-xs">
          {viewerCount || 0}{' '}
          <span className="hidden md:inline">
            Viewer{viewerCount > 1 ? 's' : ''}
          </span>
        </span>
      </div>
      <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-md rounded-sm px-2 py-1 text-sm text-gray-800 shadow-md">
        <Heart className="w-3 h-3" />
        <span className="font-medium text-xs">
          {likeCount || 0}{' '}
          <span className="hidden md:inline">
            Like{likeCount > 1 ? 's' : ''}
          </span>
        </span>
      </div>
      <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-md rounded-sm px-2 py-1 text-sm text-gray-800 shadow-md">
        <MessageSquare className="w-3 h-3" />
        <span className="font-medium text-xs">
          {commentCount || 0}{' '}
          <span className="hidden md:inline">
            Comment{commentCount > 1 ? 's' : ''}
          </span>
        </span>
      </div>
      <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-md rounded-sm px-2 py-1 text-sm text-gray-800 shadow-md">
        <Share2 className="w-3 h-3" />
        <span className="font-medium text-xs">
          {sharedCount || 0}{' '}
          <span className="hidden md:inline">
            Share{sharedCount > 1 ? 's' : ''}
          </span>
        </span>
      </div>
    </div>
  );
};

export default LiveIndicator;
