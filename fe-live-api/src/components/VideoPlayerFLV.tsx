import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import 'videojs-flvjs';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { FEED_PATH } from '@/data/route';
import { RotateCw, SquarePlay, VideoOff } from 'lucide-react';
import DefaultThumbnail from '@/assets/images/video-thumbnail.jpg';
import logger from '@/lib/logger';

interface VideoPlayerProps {
  url?: string;
  token: string;
  poster?: string;
  styles?: string;
  videoWidth?: number | string;
  videoHeight?: number | string;
  onLoadVideo?: () => void;
}

const VideoPlayerFLV: React.FC<VideoPlayerProps> = ({
  url,
  token,
  poster,
  styles,
  videoWidth,
  videoHeight,
  onLoadVideo,
}) => {
  const navigate = useNavigate();

  const posterRef = useRef(poster);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    const initializeFLVPlayer = () => {
      if (!playerRef.current && videoRef.current) {
        const player = videojs(
          videoRef.current,
          {
            autoplay: true,
            controls: false,
            muted: false,
            preload: 'auto',
            aspectRatio: '16:9',
            fluid: true,
            responsive: true,
            poster: posterRef.current,
            techOrder: ['flvjs', 'html5'],
            flvjs: {
              mediaDataSource: {
                isLive: true,
                cors: true,
                withCredentials: true,
              },
              config: {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            },
          },
          () => {
            logger.log('FLV Player initialized');
          }
        );

        playerRef.current = player;

        player.src({
          src: url,
          type: 'application/x-mpegURL',
        });

        setTimeout(() => {
          player?.play()?.catch(() => {
            setError('Unable to play the video stream.');
          });
        }, 1000);
      }
    };

    initializeFLVPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
        logger.log('FLV Player disposed');
      }
    };
  }, [url, token]);

  useEffect(() => {
    posterRef.current = poster;
  }, [poster]);

  return (
    <div
      className={`${styles} relative w-full h-full flex justify-center`}
      style={{
        backgroundImage: error && poster ? `url(${poster})` : DefaultThumbnail,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {!error && (
        <video
          ref={videoRef}
          onLoad={onLoadVideo && onLoadVideo}
          className="video-js vjs-theme-city vjs-big-play-centered"
          style={{
            width: `${
              typeof videoWidth === 'number' ? videoWidth + 'px' : videoWidth
            }`,
            height: `${
              typeof videoHeight === 'number' ? videoHeight + 'px' : videoHeight
            }`,
          }}
        ></video>
      )}
      {error && (
        <div className="flex flex-col justify-center text-center items-center absolute inset-0 bg-gray-900 bg-opacity-75 text-white backdrop-blur space-y-2">
          <VideoOff className="w-7 h-7 mb-3" />
          <p className="text-lg font-semibold">Ooops!</p>
          <p className="text-sm text-gray-300">
            Check your network and refresh the page. <br /> Otherwise, this
            video may not be available anymore.
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

export default VideoPlayerFLV;
