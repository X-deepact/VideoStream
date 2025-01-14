import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/AppLayout';
import { LetterText, MessageSquare } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import DetailsForm from './DetailsForm';
import { useNavigate } from 'react-router-dom';
import { LIVE_STREAM_PATH, WATCH_VIDEO_PATH } from '@/data/route';
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
import LiveIndicator from './LiveIndicator';
import ResourcePermissionDeniedOverlay from './ResourcePermissionDeniedOverlay';
import { StreamDetailsResponse } from '@/data/dto/stream';
import useUserAccount from '@/hooks/useUserAccount';
import ControlButtons from './ControlButtons';
import StreamerAvatar from '@/components/StreamerAvatar';
import Chat from '@/components/Chat';
import { useIsMobile } from '@/hooks/useMobile';
import { fetchCategories } from '@/services/category';
import { CategoryResponse } from '@/data/dto/category';
import { getObjectsByIds } from '@/lib/utils';
import { EVENT_EMITTER_NAME, EventEmitter } from '@/lib/event-emitter';
import { useLiveChatWebSocket } from '@/hooks/webSocket/useLiveChatWebSocket';
import { useLiveStreamWebSocket } from '@/hooks/webSocket/useLiveStreamWebSocket';
import logger from '@/lib/logger';
import { FORM_MODE } from '@/data/types/ui/form';
import VideoDescriptionBox from '@/components/VideoDescriptionBox';

const LiveStreamWebcam = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const currentUser = useUserAccount();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [videoDimensions, setVideoDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isMicOn, setIsMicOn] = useState(true);
  const [isResourcePermissionDenied, setIsResourcePermissionDenied] =
    useState(false);
  const [streamCategories, setStreamCategories] = useState<CategoryResponse[]>(
    []
  );
  const [streamDetails, setStreamDetails] = useState<StreamDetailsResponse>({
    id: null,
    title: null,
    description: null,
    thumbnail_url: null,
    push_url: null,
    broadcast_url: null,
    category_ids: [],
    started_at: null,
  });
  const [isStreamDetailsModalOpen, setIsStreamDetailsModalOpen] =
    useState(false);
  const [notifyModal, setNotifyModal] = useState<NotificationModalProps>({
    type: NotifyModalType.SUCCESS,
    isOpen: false,
    title: '',
    description: '',
    onClose: undefined,
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

  // live chat interaction websocket
  const {
    isChatVisible,
    isStreamStarted,
    isLiveEndEventReceived,
    liveInitialStats,
    liveViewersCount,
    toggleChat,
    openChat,
    sendReaction,
    sendComment,
    setIsStreamStarted,
  } = useLiveChatWebSocket(streamDetails?.id?.toString() || null);

  // stream websocket
  const { startStream, stopStream } = useLiveStreamWebSocket({
    videoRef,
    setIsStreamStarted,
    setStreamDetails,
  });

  // toggle stream initialize modal to start a stream. Without this step, can't stream.
  const handleStreamDetailsModalToggle = (): void =>
    setIsStreamDetailsModalOpen(!isStreamDetailsModalOpen);

  // show success modal and start streaming after submitting stream initialization steps
  const handleStreamSaveSuccess = (
    data: StreamDetailsResponse,
    mode: FORM_MODE
  ): void => {
    if (data.id) {
      setIsStreamDetailsModalOpen(false);

      const {
        id,
        title,
        description,
        thumbnail_url,
        push_url,
        broadcast_url,
        category_ids,
      } = data;
      setStreamDetails({
        id,
        title,
        description,
        thumbnail_url,
        push_url,
        broadcast_url,
        category_ids,
        started_at: null,
      });

      if (mode === FORM_MODE.CREATE) {
        setIsStreamStarted(true);
        if (!isMobile) openChat();

        openNotifyModal(
          NotifyModalType.SUCCESS,
          modalTexts.stream.successStart.title,
          modalTexts.stream.successStart.description
        );

        startStream(data.id);
      } else if (mode === FORM_MODE.EDIT)
        openNotifyModal(
          NotifyModalType.SUCCESS,
          modalTexts.stream.successUpdate.title,
          modalTexts.stream.successUpdate.description
        );
    }
  };

  // cancel streaming. stop using webcam and audio.
  const handleInitializeStreamCancel = (): void => {
    stopWebcamAndAudio();
    setIsStreamDetailsModalOpen(false);
    navigate(LIVE_STREAM_PATH);
  };

  // show confirm modal before ending stream
  const handleEndStream = () => {
    openConfirmModal(
      modalTexts.stream.confirmToEnd.title,
      modalTexts.stream.confirmToEnd.description,
      () => handleEndStreamConfirmed(),
      true,
      'Confirm to End'
    );
  };

  // end stream, terminates ws connection, stops using webcam & mic
  const handleEndStreamConfirmed = () => {
    EventEmitter.emit(EVENT_EMITTER_NAME.LIVE_STREAM_END);
    setIsStreamStarted(false);
    stopStream();
    stopWebcamAndAudio();
    openNotifyModal(
      NotifyModalType.SUCCESS,
      modalTexts.stream.successEnd.title,
      modalTexts.stream.successEnd.description,
      () => {
        navigate(
          WATCH_VIDEO_PATH.replace(':id', streamDetails?.id?.toString() || '')
        );
      }
    );
  };

  // toggle the microphone on or off for the current video stream.
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

  // Close permission denied overlay and go back to index page
  const handleClosePermissionOverlay = () => {
    setIsResourcePermissionDenied(false);
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
          logger.log(`Stopping track: ${track.kind}`);
          track.stop();
        });
      }
    }
  };

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
  const openNotifyModal = useCallback(
    (
      type: NotifyModalType,
      title: string,
      description: string | JSX.Element,
      onClose?: () => void
    ): void => {
      closeConfirmationModal();
      setNotifyModal({
        type,
        title,
        description,
        isOpen: true,
        onClose,
      });
    },
    []
  );
  const closeNotifyModal = (): void => {
    if (notifyModal.onClose) {
      notifyModal.onClose();
    }

    setNotifyModal({
      type: NotifyModalType.SUCCESS,
      title: '',
      description: '',
      isOpen: false,
      onClose: undefined,
    });
  };

  // Open camera and mic, fetch categories as soon as this page is rendered
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
        logger.error('Error accessing webcam:', error);
        setIsResourcePermissionDenied(true);
      }
    };
    startWebcam();

    const getCategories = async () => {
      const data = await fetchCategories();
      if (data) setStreamCategories(data);
    };
    getCategories();

    const currentVideoRef = videoRef.current;
    return () => {
      if (currentVideoRef?.srcObject) {
        const tracks = (currentVideoRef.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // show modal alert when live ends
  useEffect(() => {
    if (streamDetails && isLiveEndEventReceived) {
      openNotifyModal(
        NotifyModalType.SUCCESS,
        modalTexts.stream.forceEnd.title,
        modalTexts.stream.forceEnd.description,
        () => {
          navigate(
            WATCH_VIDEO_PATH.replace(':id', streamDetails?.id?.toString() || '')
          );
        }
      );
    }
  }, [isLiveEndEventReceived, streamDetails, navigate, openNotifyModal]);

  return (
    <AppLayout>
      {isResourcePermissionDenied ? (
        <ResourcePermissionDeniedOverlay
          onGoBack={handleClosePermissionOverlay}
        />
      ) : (
        <>
          {!isStreamStarted && (
            <DetailsForm
              mode={FORM_MODE.CREATE}
              isOpen={isStreamDetailsModalOpen}
              categories={streamCategories?.map((cat) => ({
                id: cat.id.toString(),
                name: cat.name,
              }))}
              onSuccess={(data: StreamDetailsResponse) =>
                handleStreamSaveSuccess(data, FORM_MODE.CREATE)
              }
              onClose={handleStreamDetailsModalToggle}
            />
          )}

          <div className="flex flex-col w-full h-full gap-3 overflow-hidden box-border">
            <div className="flex w-full lg:h-full items-center justify-center overflow-hidden">
              {/* Video and Chat Layout */}
              <div className="flex flex-col lg:flex-row w-full h-full gap-3">
                {/* Webcam View */}
                <div className="flex-1 flex items-center justify-center border rounded-md overflow-hidden relative">
                  {/* Live indicators */}
                  {isStreamStarted && (
                    <div className="absolute top-3 left-3 z-20">
                      <LiveIndicator
                        isStreamStarted={isStreamStarted}
                        likeCount={liveInitialStats.like_count}
                        commentCount={liveInitialStats.comments?.length}
                        viewerCount={liveViewersCount}
                      />
                    </div>
                  )}
                  {/* sm: Control buttons */}
                  <div className="absolute bottom-3 z-10 inline md:hidden">
                    <ControlButtons
                      isMicOn={isMicOn}
                      isStreamStarted={isStreamStarted}
                      onToggleMic={handleToggleMic}
                      onEndStream={handleEndStream}
                      onInitializeStreamModalToggle={
                        handleStreamDetailsModalToggle
                      }
                      onInitializeStreamCancel={handleInitializeStreamCancel}
                    />
                  </div>
                  {/* video */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    draggable={false}
                    onLoadedMetadata={loadVideoMetadata}
                    style={getScaledVideoStyle()}
                    className="object-contain lg:max-h-full"
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>

                {/* Chat */}
                {isStreamStarted && isChatVisible && (
                  <div className="w-full lg:w-1/4 flex flex-col h-[50vh] md:h-full border rounded-md overflow-hidden">
                    <Chat
                      currentUser={currentUser}
                      initialStats={liveInitialStats}
                      onToggleVisibility={toggleChat}
                      onReactOnLive={sendReaction}
                      onCommentOnLive={sendComment}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Control bars */}
            <div className="bottom-0 flex items-center md:justify-center">
              {/* Stream details card */}
              {streamDetails && streamDetails?.id && (
                <>
                  <div className="hidden md:inline-block absolute left-5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleStreamDetailsModalToggle}
                    >
                      <LetterText />
                      Details
                    </Button>
                    {isStreamStarted && (
                      <DetailsForm
                        mode={FORM_MODE.VIEW}
                        isOpen={isStreamDetailsModalOpen}
                        data={streamDetails}
                        categories={streamCategories?.map((cat) => ({
                          id: cat.id.toString(),
                          name: cat.name,
                        }))}
                        onSuccess={(data: StreamDetailsResponse) =>
                          handleStreamSaveSuccess(data, FORM_MODE.EDIT)
                        }
                        onClose={handleStreamDetailsModalToggle}
                      />
                    )}
                  </div>
                  {/* Start - Mobile stream details card */}
                  {!isChatVisible && isStreamStarted && (
                    <div className="block w-full md:hidden">
                      <div className="flex justify-between items-start">
                        <StreamerAvatar />
                        <Button
                          onClick={toggleChat}
                          variant="outline"
                          size="sm"
                        >
                          <MessageSquare /> Show Chat
                        </Button>
                      </div>
                      <div className="flex flex-col gap-3 mt-3">
                        <p className="bg-secondary/40 p-4 rounded-lg text-xl font-semibold">
                          {streamDetails?.title || '—'}
                        </p>
                        <VideoDescriptionBox
                          totalViews={liveViewersCount}
                          description={streamDetails?.description || '—'}
                          createdAt={
                            streamDetails?.started_at ||
                            new Date()?.toDateString()
                          }
                          categories={getObjectsByIds(
                            streamCategories,
                            streamDetails?.category_ids || [],
                            'id'
                          )}
                        />
                      </div>
                    </div>
                  )}
                  {/* End - Mobile stream details card */}
                </>
              )}

              {/* md: Control buttons */}
              <div className="hidden md:inline-block">
                <ControlButtons
                  isMicOn={isMicOn}
                  isStreamStarted={isStreamStarted}
                  onToggleMic={handleToggleMic}
                  onEndStream={handleEndStream}
                  onInitializeStreamModalToggle={handleStreamDetailsModalToggle}
                  onInitializeStreamCancel={handleInitializeStreamCancel}
                />
              </div>
              {/* Chat toggle button */}
              <div className="hidden md:inline-block absolute right-5">
                {isStreamStarted && (
                  <Button variant="ghost" size="sm" onClick={toggleChat}>
                    <MessageSquare /> {isChatVisible ? 'Hide' : 'Show'} chat
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
