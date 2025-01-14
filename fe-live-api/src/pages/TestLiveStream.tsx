/* eslint-disable @typescript-eslint/no-unused-vars */
// import VideoPlayer from '@/components/VideoPlayer';
import useWebSocket from '@/hooks/useWebSocket';
import AppLayout from '@/layouts/AppLayout';
import LayoutHeading from '@/layouts/LayoutHeading';
import React, { useState } from 'react';

const title = 'Test Live Stream';

const TestLiveStream: React.FC = () => {
  const url1 =
    'https://cdn.flowplayer.com/a30bd6bc-f98b-47bc-abf5-97633d4faea0/hls/de3f6ca7-2db3-4689-8160-0f574a5996ad/playlist.m3u8';

  const broadcastUrl = useWebSocket(
    'wss://suprstrange.crabdance.com/ws/stream_live'
  );

  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);
  const [isVideoBuffered, setIsVideoBuffered] = useState<boolean>(false);
  const [isVideoRequestError, setIsVideoRequestError] =
    useState<boolean>(false);
  const [isVideoRequestSuccess, setIsVideoRequestSuccess] =
    useState<boolean>(false);

  return (
    <AppLayout>
      <LayoutHeading title={title} />
      <h1 className="text-xl font-bold mb-4">Live Stream</h1>
      {!broadcastUrl ? (
        <h3>Loading live stream...</h3>
      ) : (
        <div data-vjs-player style={{ borderRadius: '9px' }}>
          {/* <VideoPlayer
            options={{
              autoplay: true,
              controls: true,
              muted: false,
              preload: 'auto',
              aspectRatio: '16:9',
              fluid: true,
              responsive: true,
              poster: null,
              sources: [
                {
                  // src: url1,
                  src: broadcastUrl,
                  type: 'application/x-mpegurl',
                },
              ],
            }}
            styles="rounded-lg w-[400px] bg-purple-300 overflow-hidden"
            videoRequest={{
              setIsLoading: setIsVideoLoading,
              setIsBuffered: setIsVideoBuffered,
              setIsSuccess: setIsVideoRequestSuccess,
              setIsError: setIsVideoRequestError,
            }}
          /> */}
        </div>
      )}
    </AppLayout>
  );
};

export default TestLiveStream;
