import { StreamDetailsResponse } from '@/data/dto/stream';
import { retrieveAuthToken } from '@/data/model/userAccount';
import { EVENT_EMITTER_NAME, EventEmitter } from '@/lib/event-emitter';
import logger from '@/lib/logger';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const wsURL = import.meta.env.VITE_WS_STREAM_URL;

interface ComponentProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  setIsStreamStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setStreamDetails: React.Dispatch<React.SetStateAction<StreamDetailsResponse>>;
}

export const useLiveStreamWebSocket = ({
  videoRef,
  setIsStreamStarted,
  setStreamDetails,
}: ComponentProps) => {
  const streamWsRef = useRef<WebSocket | null>(null);

  const cleanupStream = (reason: string, mediaRecorder?: MediaRecorder) => {
    logger.log(reason);
    if (mediaRecorder) mediaRecorder.stop();
    setIsStreamStarted(false);
    streamWsRef.current = null;
  };

  const startStream = (streamId: number) => {
    if (streamWsRef.current) {
      logger.warn('WebSocket is already initialized.');
      return;
    }

    if (!videoRef.current) {
      toast.error('Video element not found. Please refresh the page.');
      return;
    }

    const token = retrieveAuthToken();
    if (!token) {
      toast.error('Authentication needed. Please refresh the page.');
      return;
    }

    const video = videoRef.current as HTMLVideoElement & {
      captureStream(): MediaStream;
    };

    const url = getWsURL(streamId);
    if (!url) return;

    const streamWs = new WebSocket(url);
    streamWsRef.current = streamWs;

    streamWs.onopen = () => {
      logger.log('WebSocket connection established');
      setIsStreamStarted(true);

      EventEmitter.emit(EVENT_EMITTER_NAME.LIVE_STREAM_START);

      const stream = video.captureStream();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp8',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && streamWs.readyState === WebSocket.OPEN)
          streamWs.send(event.data);
      };

      mediaRecorder.start(100); // Send data every 100ms

      streamWs.onclose = () =>
        cleanupStream(`WebSocket connection closed`, mediaRecorder);
      streamWs.onerror = (error) =>
        cleanupStream(`WebSocket error: ${error}`, mediaRecorder);
    };

    streamWs.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response && response?.started_at) {
          setStreamDetails((prevStats) => ({
            ...prevStats,
            started_at: response.started_at,
          }));
        }
      } catch (error) {
        logger.error('Error parsing Stream WebSocket message:', error);
      }
    };
  };

  const stopStream = () => {
    if (streamWsRef.current) {
      logger.log('Closing WebSocket connection');
      streamWsRef.current.close();
      streamWsRef.current = null;
    } else logger.warn('No active WebSocket connection to close.');
  };

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  return {
    startStream,
    stopStream,
  };
};

const getWsURL = (streamId: number): string | null => {
  const token = retrieveAuthToken();
  if (!token) {
    toast.error('Please reload the page');
    return null;
  }

  return `${wsURL}/${streamId}?token=${encodeURIComponent(token)}`;
};
