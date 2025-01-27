import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import 'videojs-flvjs';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { FEED_PATH } from '@/data/route';
import { Clock, RotateCw, SquarePlay, VideoOff } from 'lucide-react';
import logger from '@/lib/logger';
import { CONTENT_STATUS } from '@/data/types/stream';
import { getFormattedDate } from '@/lib/date-time';
import Countdown from './CountDown';

interface VideoPlayerProps {
  videoDetails: {
    url: string;
    status: CONTENT_STATUS;
    scheduledAt: string;
  } | null;
  token: string;
  poster?: string;
  styles?: string;
  videoWidth?: number | string;
  videoHeight?: number | string;
  onLoadVideo?: () => void;
}

const VideoPlayerFLV: React.FC<VideoPlayerProps> = ({
  videoDetails,
  token,
  poster,
  styles,
  videoWidth,
  videoHeight,
  onLoadVideo,
}) => {
  const navigate = useNavigate();

  const url = videoDetails?.url;
  const status = videoDetails?.status;
  const scheduledAt = videoDetails?.scheduledAt;

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
  }, [url, token, status]);

  useEffect(() => {
    posterRef.current = poster;
  }, [poster]);

  return (
    <div
      className={`${styles} relative w-full h-full flex justify-center`}
      style={{
        backgroundImage:
          (error && poster) || videoDetails?.status === CONTENT_STATUS.UPCOMING
            ? `url(${poster})`
            : ``,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {status === CONTENT_STATUS.UPCOMING && (
        <div className="flex flex-col justify-center text-center items-center absolute inset-0 bg-gray-900 bg-opacity-75 text-white backdrop-blur space-y-2">
          <Clock className="w-7 h-7 mb-2" />
          <p className="text-lg font-semibold">Stay Tuned. Upcoming Video!</p>
          {scheduledAt && (
            <>
              <p className="text-sm text-gray-300">
                This video can be accessed on{' '}
                {getFormattedDate(new Date(scheduledAt), true)}.
              </p>
              <div className="flex gap-2 text-xs font-medium">
                <span className="bg-red-500 text-white px-2 py-0.5 rounded-full">
                  Available on
                </span>{' '}
                <Countdown targetDate={scheduledAt} />
              </div>
            </>
          )}
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
      {status !== CONTENT_STATUS.UPCOMING && !error && (
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
      {status !== CONTENT_STATUS.UPCOMING && error && (
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
