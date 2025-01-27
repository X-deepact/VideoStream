import { Button } from '@/components/ui/button';
import {
  Check,
  CircleHelp,
  Copy,
  LetterText,
  MessageSquare,
  Video,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import DetailsForm, { getStreamCrendentials } from '../DetailsForm';
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
import LiveIndicator from '../LiveIndicator';
import { StreamDetailsResponse } from '@/data/dto/stream';
import useUserAccount from '@/hooks/useUserAccount';
import ControlButtons from '../ControlButtons';
import StreamerAvatar from '@/components/StreamerAvatar';
import Chat from '@/components/Chat';
import { useIsMobile } from '@/hooks/useMobile';
import { fetchCategories } from '@/services/category';
import { CategoryResponse } from '@/data/dto/category';
import { cn, getObjectsByIds } from '@/lib/utils';
import { EVENT_EMITTER_NAME, EventEmitter } from '@/lib/event-emitter';
import { useLiveChatWebSocket } from '@/hooks/webSocket/useLiveChatWebSocket';
import { FORM_MODE } from '@/data/types/ui/form';
import VideoDescriptionBox from '@/components/VideoDescriptionBox';
import { STREAM_TYPE } from '@/data/types/stream';
import { useLiveStreamSoftwareWebSocket } from '@/hooks/webSocket/useLiveStreamSoftwareWebSocket';
import SetupGuideContent from './SetupGuideContent';
import { fetchImageWithAuth } from '@/api/image';
import { Label } from '@/components/ui/label';
import TooltipComponent from '@/components/TooltipComponent';
import { toast } from 'sonner';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

const LiveStreamSoftware = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const currentUser = useUserAccount();

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
  const [streamServer, setStreamServer] = useState('');
  const [streamKey, setStreamKey] = useState('');
  const [thumbnailSrc, setThumbnailSrc] = useState<string>('');
  const [isStreamDetailsModalOpen, setIsStreamDetailsModalOpen] =
    useState(false);
  const [isStreamServerCopied, setIsStreamServerCopied] = useState(false);
  const [isStreamKeyCopied, setIsStreamKeyCopied] = useState(false);
  const [copiedText, copy, isCopied] = useCopyToClipboard();
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

  // stream websocket
  const { isStreamStarted, setIsStreamStarted, startStream, stopStream } =
    useLiveStreamSoftwareWebSocket({
      setStreamDetails,
    });

  // live chat interaction websocket
  const {
    isChatVisible,
    isLiveEndEventReceived,
    liveInitialStats,
    liveViewersCount,
    liveSharesCount,
    toggleChat,
    openChat,
    sendReaction,
    sendComment,
  } = useLiveChatWebSocket(
    streamDetails?.id?.toString() || null,
    isStreamStarted,
    setIsStreamStarted
  );

  // toggle stream initialize modal to start a stream. Without this step, can't stream.
  const handleStreamDetailsModalOpen = (): void =>
    setIsStreamDetailsModalOpen(true);
  const handleStreamDetailsModalClose = (): void =>
    setIsStreamDetailsModalOpen(false);

  // open stream setup guide model
  const handleStreamSetupGuideOpen = (): void => {
    openNotifyModal(
      NotifyModalType.INFO,
      'Stream by Software Setup Guide',
      <SetupGuideContent />,
      () => {}
    );
  };

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

      const [streamServerValue, streamKeyValue] = getStreamCrendentials(
        push_url || ''
      );
      if (streamServerValue) setStreamServer(streamServerValue);
      if (streamKeyValue) setStreamKey(streamKeyValue);

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

  // cancel streaming.
  const handleInitializeStreamCancel = (): void => {
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

  // Open fetch categories as soon as this page is rendered
  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      if (data) setStreamCategories(data);
    };
    getCategories();
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

  // fetch authed thumbnail img
  useEffect(() => {
    const fetchAuthThumbnail = async () => {
      if (streamDetails && streamDetails?.thumbnail_url) {
        const blobUrl = await fetchImageWithAuth(streamDetails.thumbnail_url);
        if (blobUrl) setThumbnailSrc(blobUrl);
      }
    };
    fetchAuthThumbnail();
  }, [streamDetails]);

  useEffect(() => {
    if (isCopied) {
      if (copiedText === streamServer) {
        setIsStreamServerCopied(true);
      } else if (copiedText === streamKey) {
        setIsStreamKeyCopied(true);
      }
    } else {
      setIsStreamServerCopied(false);
      setIsStreamKeyCopied(false);
    }
  }, [isCopied, copiedText, streamServer, streamKey]);

  return (
    <div>
      {!isStreamStarted && isStreamDetailsModalOpen && (
        <DetailsForm
          type={STREAM_TYPE.SOFTWARE}
          mode={FORM_MODE.CREATE}
          isOpen={isStreamDetailsModalOpen}
          categories={streamCategories?.map((cat) => ({
            id: cat.id.toString(),
            name: cat.name,
          }))}
          onSuccess={(data: StreamDetailsResponse) =>
            handleStreamSaveSuccess(data, FORM_MODE.CREATE)
          }
          onClose={handleStreamDetailsModalClose}
        />
      )}

      <div className="flex flex-col w-full h-full gap-3 overflow-hidden box-border">
        <div className="flex w-full lg:h-full items-center justify-center overflow-hidden">
          {/* Video and Chat Layout */}
          <div className="flex flex-col lg:flex-row w-full h-full gap-3">
            {/* Webcam View */}
            <div
              className={cn(
                'flex-1 flex items-center justify-center border rounded-md overflow-hidden relative'
              )}
            >
              {/* Live indicators */}
              {isStreamStarted && (
                <div className="absolute top-3 left-3 z-20">
                  <LiveIndicator
                    isStreamStarted={isStreamStarted}
                    likeCount={liveInitialStats.like_count}
                    commentCount={liveInitialStats.comments?.length}
                    viewerCount={liveViewersCount}
                    sharedCount={
                      liveSharesCount || liveInitialStats.share_count || 0
                    }
                  />
                </div>
              )}
              {/* sm: Control buttons */}
              <div className="absolute bottom-3 z-10 inline md:hidden">
                <ControlButtons
                  type={STREAM_TYPE.SOFTWARE}
                  isStreamStarted={isStreamStarted}
                  onEndStream={handleEndStream}
                  onInitializeStreamModalOpen={handleStreamDetailsModalOpen}
                  onInitializeStreamCancel={handleInitializeStreamCancel}
                />
              </div>
              {/* video */}
              <div className="w-full h-[82vh] relative flex items-center justify-center">
                {isStreamStarted && thumbnailSrc && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${thumbnailSrc})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      zIndex: 0,
                    }}
                  ></div>
                )}

                <div className="relative z-10 flex flex-col justify-center items-center text-center gap-3 bg-white/60 dark:bg-black/60 p-10 backdrop-blur rounded-md">
                  <div className="bg-primary/60 p-2 rounded-full">
                    <Video />
                  </div>
                  <span className="text-lg">
                    Start stream and connect with your streaming software <br />
                    by entering server and stream key which will be provided
                    after you have started stream.
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Viewers will be able to find your stream once you go live.
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={handleStreamSetupGuideOpen}
                  >
                    Stream Setup Guide <CircleHelp />
                  </Button>

                  {isStreamStarted &&
                    streamDetails &&
                    streamDetails?.push_url && (
                      <div className="text-left w-full border-t pt-3 mt-3">
                        <Label>
                          Stream crendentials (paste them into your streaming
                          software)
                        </Label>
                        <div className="text-left w-full border rounded-md py-4 px-3 space-y-2 mt-2">
                          <div className="border-b pb-2 text-xs relative">
                            <span className="italic text-muted-foreground">
                              Stream Server:
                            </span>{' '}
                            <span>{streamServer}</span>{' '}
                            <TooltipComponent
                              align="center"
                              text="Copy to Clipboard"
                              children={
                                <div
                                  onClick={() => {
                                    if (streamServer) {
                                      copy(streamServer);
                                      toast.success(
                                        'Stream Server copied to clipboard!'
                                      );
                                    }
                                  }}
                                  className="absolute cursor-pointer hover:bg-muted p-2 right-0 -top-3 rounded-sm"
                                >
                                  {isStreamServerCopied ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </div>
                              }
                            />
                          </div>
                          <div className="text-xs flex relative">
                            <span className="italic text-muted-foreground">
                              Stream Key:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </span>{' '}
                            <span>{streamKey}</span>{' '}
                            <TooltipComponent
                              align="center"
                              text="Copy to Clipboard"
                              children={
                                <div
                                  onClick={() => {
                                    if (streamKey) {
                                      copy(streamKey);
                                      toast.success(
                                        'Stream Key copied to clipboard!'
                                      );
                                    }
                                  }}
                                  className="absolute cursor-pointer hover:bg-muted p-2 right-0 -bottom-3 rounded-sm"
                                >
                                  {isStreamKeyCopied ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </div>
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                </div>

                {isStreamStarted && thumbnailSrc && (
                  <div className="absolute inset-0 bg-black/40 z-5"></div>
                )}
              </div>
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
                  onClick={handleStreamDetailsModalOpen}
                >
                  <LetterText />
                  Details
                </Button>
                {isStreamStarted && (
                  <DetailsForm
                    type={STREAM_TYPE.SOFTWARE}
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
                    onClose={handleStreamDetailsModalClose}
                  />
                )}
              </div>
              {/* Start - Mobile stream details card */}
              {!isChatVisible && isStreamStarted && (
                <div className="block w-full md:hidden">
                  <div className="flex justify-between items-start">
                    <StreamerAvatar />
                    <Button onClick={toggleChat} variant="outline" size="sm">
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
                        streamDetails?.started_at || new Date()?.toDateString()
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
              type={STREAM_TYPE.SOFTWARE}
              isStreamStarted={isStreamStarted}
              onEndStream={handleEndStream}
              onInitializeStreamModalOpen={handleStreamDetailsModalOpen}
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
    </div>
  );
};

export default LiveStreamSoftware;
