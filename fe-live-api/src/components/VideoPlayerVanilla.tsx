import logger from '@/lib/logger';
import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  jwtToken: string;
  className?: string;
}

const VideoPlayerVanilla: React.FC<VideoPlayerProps> = ({
  videoUrl,
  jwtToken,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const attachStream = () => {
      if (!videoRef.current) return;

      const xhr = new XMLHttpRequest();
      xhr.open('GET', videoUrl, true);
      xhr.setRequestHeader('Authorization', `Bearer ${jwtToken}`);
      xhr.responseType = 'arraybuffer';

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const videoBlob = new Blob([xhr.response], { type: 'video/mp4' });
          const blobUrl = URL.createObjectURL(videoBlob);

          videoRef.current!.src = blobUrl;
        } else {
          logger.error('Failed to load video:', xhr.statusText);
        }
      };

      xhr.onerror = () => {
        logger.error('An error occurred during the video request');
      };

      xhr.send();
    };

    attachStream();

    return () => {
      if (videoRef.current) {
        URL.revokeObjectURL(videoRef.current.src);
        videoRef.current.src = '';
      }
    };
  }, [videoUrl, jwtToken]);

  return (
    <div className={className}>
      <video
        ref={videoRef}
        controls
        autoPlay
        style={{ width: '100%', height: '100%' }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayerVanilla;
