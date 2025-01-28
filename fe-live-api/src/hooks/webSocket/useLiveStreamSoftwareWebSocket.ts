import { LiveStreamBySoftware } from '@/data/dto/chat';
import { StreamDetailsResponse } from '@/data/dto/stream';
import { retrieveAuthToken } from '@/data/model/userAccount';
import { EVENT_EMITTER_NAME, EventEmitter } from '@/lib/event-emitter';
import logger from '@/lib/logger';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const wsURL = import.meta.env.VITE_WS_STREAM_URL;

interface ComponentProps {
  setStreamDetails: React.Dispatch<React.SetStateAction<StreamDetailsResponse>>;
}

export const useLiveStreamSoftwareWebSocket = ({
  setStreamDetails,
}: ComponentProps) => {
  const streamWsRef = useRef<WebSocket | null>(null);
  const [isStreamStarted, setIsStreamStarted] = useState(false);
  const [isLiveEndEventReceivedSoftware, setIsLiveEndEventReceivedSoftware] =
    useState(false);

  const cleanupStream = (reason: string) => {
    logger.log(reason);
    setIsStreamStarted(false);
    streamWsRef.current = null;
  };

  const startStream = (streamId: number) => {
    if (streamWsRef.current) {
      logger.warn('WebSocket is already initialized.');
      return;
    }

    const token = retrieveAuthToken();
    if (!token) {
      toast.error('Authentication needed. Please refresh the page.');
      return;
    }

    const url = getWsURL(streamId);
    if (!url) return;

    const streamWs = new WebSocket(url);
    streamWsRef.current = streamWs;

    streamWs.onopen = () => {
      logger.log('WebSocket connection established');
      streamWs.onclose = () => cleanupStream('WebSocket connection closed');
      streamWs.onerror = (error) => cleanupStream(`WebSocket error: ${error}`);
    };

    streamWs.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);

        if (response?.type === LiveStreamBySoftware.STARTED) {
          setIsStreamStarted(true);
          EventEmitter.emit(EVENT_EMITTER_NAME.LIVE_STREAM_START);
        } else if (response?.type === LiveStreamBySoftware.ENDED) {
          setIsStreamStarted(false);
          setIsLiveEndEventReceivedSoftware(true);
          EventEmitter.emit(EVENT_EMITTER_NAME.LIVE_STREAM_END);
        } else if (response && response?.started_at) {
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
    isStreamStarted,
    isLiveEndEventReceivedSoftware,
    setIsStreamStarted,
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
