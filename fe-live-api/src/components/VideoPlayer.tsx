import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

type PlayerOptions = typeof videojs.options;

interface VideoPlayerProps {
  id?: string;
  videoUrl?: string;
  options?: PlayerOptions;
  styles?: string;
  videoRequest: {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsBuffered: React.Dispatch<React.SetStateAction<boolean>>;
    setIsError: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  options,
  styles,
  videoRequest,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>();

  const { setIsLoading, setIsBuffered, setIsError, setIsSuccess } =
    videoRequest;

  useEffect(() => {
    if (options.sources.length === 0 || !videoRef.current) return;

    // Initialize the player only if it doesn't already exist
    if (!playerRef.current) {
      const player = videojs(videoRef.current, options, () => {
        console.log('Video player is ready');
      });

      playerRef.current = player;

      player.on('error', () => {
        setIsError(true);
      });

      player.on('loadedmetadata', () => {
        setIsSuccess(true);
        setIsLoading(false);
      });

      player.on('playing', () => {
        setIsBuffered(true);
        setIsError(false);
      });
    } else {
      const currentSrc = playerRef.current.currentSrc();
      // new src
      const newSrc = options.sources[0].src;
      const player = playerRef.current;

      // check if current src is not equal to new src
      if (currentSrc !== newSrc) {
        player.autoplay(options.autoplay);
        player.src(options.sources);
      }
    }
  }, [
    videoUrl,
    options,
    setIsBuffered,
    setIsError,
    setIsLoading,
    setIsSuccess,
  ]);

  return (
    <div className={styles}>
      <video
        ref={videoRef}
        className="video-js vjs-theme-city vjs-big-play-centered"
        style={{ width: '100%', height: '100%' }}
      ></video>
    </div>
  );
};

export default VideoPlayer;
