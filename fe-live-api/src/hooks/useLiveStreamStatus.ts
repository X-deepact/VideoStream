import { useEffect, useState } from 'react';
import { EVENT_EMITTER_NAME, EventEmitter } from '@/lib/event-emitter';

export function useLiveStreamStatus() {
  const [isStreamingLive, setIsStreamingLive] = useState(false);

  useEffect(() => {
    const handleLiveStart = () => setIsStreamingLive(true);
    const handleLiveEnd = () => setIsStreamingLive(false);

    EventEmitter.subscribe(
      EVENT_EMITTER_NAME.LIVE_STREAM_START,
      handleLiveStart
    );
    EventEmitter.subscribe(EVENT_EMITTER_NAME.LIVE_STREAM_END, handleLiveEnd);

    return () => {
      EventEmitter.unsubscribe(
        EVENT_EMITTER_NAME.LIVE_STREAM_START,
        handleLiveStart
      );
      EventEmitter.unsubscribe(
        EVENT_EMITTER_NAME.LIVE_STREAM_END,
        handleLiveEnd
      );
    };
  }, []);

  return isStreamingLive;
}
