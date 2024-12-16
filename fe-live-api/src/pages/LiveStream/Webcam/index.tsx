import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/AppLayout';
import LayoutHeading from '@/layouts/LayoutHeading';
import {
  Ban,
  CircleSlash,
  LetterText,
  MessageSquare,
  Mic,
  MicOff,
  Radio,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import DetailsForm from './DetailsForm';
import { useNavigate } from 'react-router-dom';
import { LIVE_STREAM_PATH } from '@/data/route';
import { retrieveAuthToken } from '@/data/model/userAccount';
import {
  NotificationModalProps,
  NotifyModal,
} from '@/components/NotificationModal';
import {
  ConfirmationModalProps,
  ConfirmModal,
} from '@/components/ConfirmationModal';
import { NotifyModalType } from '@/components/UITypes';
import { modalTexts } from '@/data/stream';
import Chat from '@/components/Chat';
import LiveIndicator from './LiveIndicator';
import ResourcePermissionDeniedOverlay from './ResourcePermissionDeniedOverlay';
import { StreamInitializeResponse } from '@/data/dto/stream';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import StreamDetailsCard from './StreamDetailsCard';

const title = 'Go Live';

const LiveStreamWebcam = () => {
  const navigate = useNavigate();

  const wsRef = useRef<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isResourcePermissionDenied, setIsResourcePermissionDenied] =
    useState(false);
  const [videoDimensions, setVideoDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isStreamStarted, setIsStreamStarted] = useState(false); // tempory state
  const [isMicOn, setIsMicOn] = useState(true); // Default to mic on
  const [isStreamInitializeModelOpen, setIsStreamInitializeModalOpen] =
    useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [streamInitializedData, setStreamInitializeData] =
    useState<StreamInitializeResponse>({
      id: null,
      title: null,
      description: null,
      thumbnail_url: null,
      push_url: null,
      broadcast_url: null,
    });
  const [notifyModal, setNotifyModal] = useState<NotificationModalProps>({
    type: NotifyModalType.SUCCESS,
    isOpen: false,
    title: '',
    description: '',
  });
  const [confirmModal, setConfirmModal] = useState<ConfirmationModalProps>({
    isDanger: false,
    isOpen: false,
    title: '',
    description: '',
    proceedBtnText: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  // Toggles chat visibility
  const handleToggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  // Toggles the microphone on or off for the current video stream.
  const handleToggleMic = () => {
    if (videoRef.current) {
      const mediaStream = videoRef.current.srcObject as MediaStream;
      if (mediaStream) {
        const audioTrack = mediaStream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = !audioTrack.enabled;
          setIsMicOn(audioTrack.enabled);
        }
      }
    }
  };

  // Toggles stream initialize modal to start a stream. Without this step, can't stream.
  const handleInitializeStreamModalToggle = (): void => {
    setIsStreamInitializeModalOpen(!isStreamInitializeModelOpen);
  };

  // Shows success modal after submitting stream initialization steps
  const handleInitializeStreamSuccess = (
    data: StreamInitializeResponse
  ): void => {
    if (data.id) {
      const { id, title, description, thumbnail_url, push_url, broadcast_url } =
        data;

      setIsStreamStarted(true);
      setIsChatVisible(true);
      setIsStreamInitializeModalOpen(false);

      setStreamInitializeData({
        id,
        title,
        description,
        thumbnail_url,
        push_url,
        broadcast_url,
      });

      openNotifyModal(
        NotifyModalType.SUCCESS,
        modalTexts.stream.successStart.title,
        modalTexts.stream.successStart.description
      );

      startStreaming(data.id);
    }
  };

  // Cancels streaming. Stops using webcam and audio.
  const handleInitializeStreamCancel = (): void => {
    stopWebcamAndAudio();
    navigate(LIVE_STREAM_PATH);
  };

  // Starts stream using websocket
  const startStreaming = (id: number) => {
    if (!videoRef.current) return;

    const video = videoRef.current as HTMLVideoElement & {
      captureStream(): MediaStream;
    };

    const token = retrieveAuthToken();
    if (!token) {
      console.error('Error: JWT token not found in localStorage');
      return;
    }

    // Open WebSocket connection with token as a query parameter
    const wsURL = import.meta.env.VITE_WS_STREAM_URL;
    const ws = new WebSocket(
      `${wsURL}/${id}?token=${encodeURIComponent(token)}`
    );

    wsRef.current = ws;

    ws.onopen = () => {
      setIsStreamStarted(true);
      console.log('WebSocket connection established');

      // Start sending video frames
      const stream = video.captureStream();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp8',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          ws.send(event.data);
        }
      };

      mediaRecorder.start(100); // Send data every 100ms

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        mediaRecorder.stop();
        setIsStreamStarted(false);
        setIsChatVisible(false);
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        mediaRecorder.stop();
        setIsStreamStarted(false);
        setIsChatVisible(false);
      };
    };
  };

  // Shows confirm modal to end stream
  const handleEndStream = () => {
    openConfirmModal(
      modalTexts.stream.confirmToEnd.title,
      modalTexts.stream.confirmToEnd.description,
      () => handleEndStreamConfirmed(),
      true,
      'Confirm to End'
    );
  };

  // Ends stream, terminates ws connection, stops using webcam & mic
  const handleEndStreamConfirmed = () => {
    setIsStreamStarted(false);

    // End websocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    stopWebcamAndAudio();

    handleStreamEndSuccess();
  };

  // Shows notify modal
  const handleStreamEndSuccess = () => {
    openNotifyModal(
      NotifyModalType.SUCCESS,
      modalTexts.stream.successEnd.title,
      modalTexts.stream.successEnd.description
    );
    navigate(LIVE_STREAM_PATH);
  };

  // 1) Get video metadata for setting dimensions
  const loadVideoMetadata = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      setVideoDimensions({ width: videoWidth, height: videoHeight });
    }
  };

  // 2) Make video scaled based on dimensions
  const getScaledVideoStyle = () => {
    if (!videoDimensions.width || !videoDimensions.height) return {};

    const aspectRatio = videoDimensions.width / videoDimensions.height;
    const containerWidth = videoRef.current?.parentElement?.clientWidth || 0;
    const containerHeight = videoRef.current?.parentElement?.clientHeight || 0;

    // Scale the video width to always take up the full container width
    const scaledWidth = containerWidth;
    const scaledHeight = scaledWidth / aspectRatio;

    // If the scaled height exceeds the container height, limit it
    if (scaledHeight > containerHeight) {
      return {
        width: `${scaledWidth}px`, // scale based on height - containerHeight * aspectRatio
        height: `${containerHeight}px`, // scale based on container height
      };
    }

    return {
      width: `${scaledWidth}px`, // scale based on width
      height: `${scaledHeight}px`, // proportional height
    };
  };

  // 3) Stop using webcam and audio
  const stopWebcamAndAudio = () => {
    if (videoRef.current) {
      const mediaStream = videoRef.current.srcObject as MediaStream;
      if (mediaStream) {
        // Clear the video source
        videoRef.current.srcObject = null;

        // Stop all tracks (audio and video)
        mediaStream.getTracks().forEach((track) => {
          console.log(`Stopping track: ${track.kind}`);
          track.stop();
        });
      }
    }
  };

  // Slose permission denied overlay and go back to index page
  const handleClosePermissionOverlay = () => {
    setIsResourcePermissionDenied(false);
    navigate(LIVE_STREAM_PATH);
  };

  useEffect(() => {
    const startWebcam = async () => {
      try {
        // Request access to the webcam
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsResourcePermissionDenied(false);
      } catch (error) {
        console.error('Error accessing webcam:', error);
        setIsResourcePermissionDenied(true);
      }
    };

    startWebcam();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Modal dialogs
  const openConfirmModal = (
    title: string,
    description: string | JSX.Element,
    onConfirm: () => void,
    isDanger?: boolean,
    proceedBtnText?: string
  ): void => {
    closeNotifyModal();
    setConfirmModal({
      isDanger,
      title,
      description,
      isOpen: true,
      proceedBtnText,
      onConfirm: () => {
        closeConfirmationModal();
        onConfirm();
      },
      onCancel: closeConfirmationModal,
    });
  };
  const closeConfirmationModal = (): void => {
    setConfirmModal({
      isOpen: false,
      title: '',
      description: '',
      onConfirm: () => {},
      onCancel: () => {},
    });
  };
  const openNotifyModal = (
    type: NotifyModalType,
    title: string,
    description: string | JSX.Element
  ): void => {
    closeConfirmationModal();
    setNotifyModal({
      type,
      title,
      description,
      isOpen: true,
    });
  };
  const closeNotifyModal = (): void => {
    setNotifyModal({
      title: '',
      description: '',
      isOpen: false,
    });
  };

  return (
    <AppLayout title={title}>
      <LayoutHeading title={title} />

      {isResourcePermissionDenied ? (
        <ResourcePermissionDeniedOverlay
          onGoBack={handleClosePermissionOverlay}
        />
      ) : (
        <>
          <DetailsForm
            isOpen={isStreamInitializeModelOpen}
            onSuccess={handleInitializeStreamSuccess}
            onClose={handleInitializeStreamModalToggle}
          />

          <div className="flex flex-col w-full h-full gap-3 overflow-hidden">
            <div className="flex w-full h-full items-center justify-center overflow-hidden">
              {/* Video and Chat Layout */}
              <div className="flex flex-row w-full h-full gap-3">
                {/* Webcam View */}
                <div className="flex-1 flex items-center justify-center border rounded-md overflow-hidden relative">
                  {isStreamStarted && (
                    <div className="absolute top-3 left-3">
                      <LiveIndicator isStreamStarted={isStreamStarted} />
                    </div>
                  )}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    onLoadedMetadata={loadVideoMetadata}
                    style={getScaledVideoStyle()}
                    className="object-contain max-h-full"
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>

                {/* Chat UI */}
                {isStreamStarted && isChatVisible && (
                  <div className="w-1/4 flex flex-col h-full border rounded-md overflow-hidden">
                    <Chat onToggleVisibility={handleToggleChat} />
                  </div>
                )}
              </div>
            </div>

            <div className="bottom-0 flex items-center justify-center">
              {streamInitializedData && streamInitializedData?.id && (
                <div className="absolute left-5">
                  <Popover>
                    <PopoverTrigger>
                      <Button variant="outline" size="sm">
                        <LetterText />
                        Details
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side="bottom">
                      <StreamDetailsCard data={streamInitializedData} />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleToggleMic}
                  variant="ghost"
                  size="sm"
                  className="rounded-full px-2.5"
                >
                  {isMicOn ? <Mic /> : <MicOff />}
                </Button>
                {isStreamStarted ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-full"
                    onClick={handleEndStream}
                  >
                    <CircleSlash /> End Stream
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="rounded-full"
                      onClick={handleInitializeStreamModalToggle}
                    >
                      <Radio /> Start Stream
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full"
                      onClick={handleInitializeStreamCancel}
                    >
                      <Ban /> Cancel
                    </Button>
                  </div>
                )}
              </div>
              <div className="absolute right-5">
                {isStreamStarted && (
                  <Button
                    variant="ghost"
                    className="rounded-full"
                    onClick={handleToggleChat}
                  >
                    <MessageSquare /> Chat
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <NotifyModal
        type={notifyModal.type}
        isOpen={notifyModal.isOpen}
        title={notifyModal.title}
        description={notifyModal.description}
        onClose={closeNotifyModal}
      />
      <ConfirmModal
        isDanger={confirmModal.isDanger}
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        proceedBtnText={confirmModal.proceedBtnText}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmationModal}
      />
    </AppLayout>
  );
};

export default LiveStreamWebcam;
