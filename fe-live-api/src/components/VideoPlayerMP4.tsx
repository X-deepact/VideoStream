import { fetchVideoWithAuth } from '@/api/video';
import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { FEED_PATH } from '@/data/route';
import { RotateCw, SquarePlay, VideoOff } from 'lucide-react';
import DefaultThumbnail from '@/assets/images/video-thumbnail.jpg';
import logger from '@/lib/logger';

type PlayerOptions = typeof videojs.options;

interface VideoPlayerProps {
  url?: string;
  options?: PlayerOptions;
  styles?: string;
  poster?: string;
}

const VideoPlayerMP4: React.FC<VideoPlayerProps> = ({
  url,
  poster,
  styles,
}: VideoPlayerProps) => {
  const navigate = useNavigate();

  const posterRef = useRef(poster);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    const initializeVideoPlayer = async () => {
      const { success, result } = await fetchVideoWithAuth(url);

      if (!success) {
        setError(result);
        return;
      }

      if (!playerRef.current && videoRef.current) {
        const player = videojs(
          videoRef.current,
          {
            autoplay: false,
            controls: true,
            muted: false,
            preload: 'auto',
            aspectRatio: '16:9',
            fluid: true,
            responsive: true,
            poster: posterRef.current,
          },
          () => {
            logger.log('MP4 Player initialized');
          }
        );

        playerRef.current = player;
      }

      playerRef.current?.src({
        src: result, // video blob url
        type: 'video/mp4',
      });

      playerRef.current?.load();

      setTimeout(() => {
        playerRef.current?.play();
      }, 1000);
    };

    initializeVideoPlayer();

    const videoElement = videoRef.current;

    return () => {
      if (playerRef.current && videoElement) {
        setError(null);
        playerRef.current.dispose();
        playerRef.current = null;
        logger.log('MP4 Player disposed');
      }
    };
  }, [url]);

  useEffect(() => {
    posterRef.current = poster;
  }, [poster]);

  return (
    <div
      className={`${styles} relative w-full h-full`}
      style={{
        backgroundImage: error && poster ? `url(${poster})` : DefaultThumbnail,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {!error && (
        <video
          ref={videoRef}
          className="video-js vjs-theme-city vjs-big-play-centered"
          controls
        ></video>
      )}
      {error && (
        <div className="flex flex-col justify-center text-center items-center absolute inset-0 bg-gray-900 bg-opacity-75 text-white backdrop-blur space-y-2">
          <VideoOff className="w-7 h-7 mb-3" />
          <p className="text-lg font-semibold">Ooops!</p>
          <p className="text-sm text-gray-300">
            {error || 'Unexpected error occured'}
          </p>
          <div className="flex gap-2 items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(FEED_PATH)}
            >
              <SquarePlay className="w-4 h-4" /> Watch Videos
            </Button>
            <Button size="sm" onClick={() => window.location.reload()}>
              <RotateCw className="w-4 h-4" /> Reload
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayerMP4;
