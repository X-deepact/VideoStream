import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import {
  LiveReactionRequest,
  LiveInteractionType,
  LiveInitialStatsResponse,
  LiveCommentRequest,
  LiveReactionResponse,
  isLiveCommentInfoObj,
  LiveCommentInfo,
  LiveShareRequest,
} from '@/data/dto/chat';
import { retrieveAuthToken } from '@/data/model/userAccount';
import { useIsMobile } from '../useMobile';
import { OnReactOnLiveParams } from '@/components/Chat/Reactions';
import { toast } from 'sonner';
import logger from '@/lib/logger';

const wsURL = import.meta.env.VITE_WS_STREAM_URL;

export function useLiveChatWebSocket(
  videoId: string | null,
  isStreamStarted: boolean,
  setIsStreamStarted: React.Dispatch<React.SetStateAction<boolean>>
) {
  const isMobile = useIsMobile();

  const chatWsRef = useRef<WebSocket | null>(null);
  const [isLiveEndEventReceived, setIsLiveEndEventReceived] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(
    !isMobile || isStreamStarted
  );
  const [liveViewersCount, setLiveViewersCount] = useState(0);
  const [liveSharesCount, setLiveSharesCount] = useState(0);
  const [liveInitialStats, setLiveInitialStats] =
    useState<LiveInitialStatsResponse>({
      type: LiveInteractionType.INITIAL,
      like_count: 0,
      like_info: {},
      current_like_type: undefined,
      comments: [],
      share_count: 0,
    });

  const sendReaction = ({ reaction }: OnReactOnLiveParams) => {
    if (chatWsRef.current?.readyState === WebSocket.OPEN) {
      const likeStatus = liveInitialStats.current_like_type !== reaction;
      const message: LiveReactionRequest = {
        type: LiveInteractionType.LIKE,
        data: {
          like_status: likeStatus,
          like_type: reaction,
        },
      };

      chatWsRef.current.send(JSON.stringify(message));
    }
  };

  const sendComment = (content: string) => {
    if (chatWsRef.current?.readyState === WebSocket.OPEN) {
      const message: LiveCommentRequest = {
        type: LiveInteractionType.COMMENT,
        data: { content },
      };

      chatWsRef.current.send(JSON.stringify(message));
    }
  };

  const sendShare = () => {
    if (chatWsRef.current?.readyState === WebSocket.OPEN) {
      const message: LiveShareRequest = {
        type: LiveInteractionType.SHARE,
      };

      chatWsRef.current.send(JSON.stringify(message));
    }
  };

  const openChat = () => setIsChatVisible(true);
  const closeChat = () => setIsChatVisible(false);
  const toggleChat = () => setIsChatVisible(!isChatVisible);

  useEffect(() => {
    if (!videoId) return;

    if (
      chatWsRef.current &&
      chatWsRef.current.readyState === WebSocket.OPEN &&
      isStreamStarted
    )
      return;

    const url = getWsURL(videoId);
    if (!url) return;

    const chatWs = new WebSocket(url);
    chatWsRef.current = chatWs;

    chatWs.onopen = () => {};

    const handleMessage = (event: MessageEvent) => {
      try {
        const response = JSON.parse(event.data);

        // On receiving initial message
        if (response?.type === LiveInteractionType.INITIAL) {
          setLiveInitialStats(response);
        }
        // On receiving a reaction
        else if (response?.type === LiveInteractionType.LIKE) {
          const liveReactionResponse = response as LiveReactionResponse;
          setLiveInitialStats((prevStats) => {
            const { like_type, like_status } = liveReactionResponse.data;

            if (!like_status)
              return {
                ...prevStats,
                current_like_type: undefined,
              };

            const updatedStats = { ...prevStats };
            updatedStats.current_like_type = like_type;

            return updatedStats;
          });
        }
        // On commenting
        else if (response && isLiveCommentInfoObj(response)) {
          setLiveInitialStats((prevStats) => {
            const commentExists = prevStats.comments.some(
              (comment) => comment.id === response.id
            );
            if (commentExists) return prevStats;

            return {
              ...prevStats,
              comments: [...prevStats.comments, response] as LiveCommentInfo[],
            };
          });
        }
        // On getting reaction stats
        else if (response?.type === LiveInteractionType.LIKE_INFO) {
          setLiveInitialStats((prev) => ({
            ...prev,
            like_count: response.data.total || 0,
            like_info: { ...response?.data },
          }));
        }
        // On getting viewers count update
        else if (response?.type === LiveInteractionType.VIEW_INFO) {
          setLiveViewersCount(response.data.total);
        }
        // On getting share count update
        else if (response?.type === LiveInteractionType.SHARE) {
          setLiveSharesCount(response.share_count);
        }
        // On getting stream ended event
        else if (response?.type === LiveInteractionType.LIVE_ENDED) {
          setIsStreamStarted(false);
          setIsLiveEndEventReceived(true);
        }
        // On getting empty result - reset - edge case
        else if (_.isEmpty(response)) {
          setLiveInitialStats((prev) => ({
            ...prev,
            like_count: 0,
            like_info: {},
            current_like_type: undefined,
          }));
        }
      } catch (error) {
        logger.error('Error parsing WebSocket message:', error);
        toast.error('Chat is unavailable!');
      }
    };
    chatWs.onmessage = handleMessage;

    chatWs.onclose = () => {
      setIsChatVisible(false);
      if (chatWs.readyState === WebSocket.OPEN) chatWs.close();
    };

    chatWs.onerror = () => {
      setIsChatVisible(false);
      if (chatWs.readyState === WebSocket.OPEN) {
        chatWs.close();
        toast.error('Chat is unavailable!');
      }
    };

    return () => {
      if (chatWs.readyState === WebSocket.OPEN) chatWs?.close();
    };
  }, [videoId, isStreamStarted, setIsStreamStarted]);

  return {
    isChatVisible,
    isLiveEndEventReceived,

    liveInitialStats,
    liveViewersCount,
    liveSharesCount,

    openChat,
    closeChat,
    toggleChat,

    sendReaction,
    sendComment,
    sendShare,

    setIsChatVisible,
  };
}

const getWsURL = (videoId: string): string | null => {
  const token = retrieveAuthToken();
  if (!token) {
    toast.error('Please reload the page');
    return null;
  }

  return `${wsURL}/${videoId}/interaction?token=${encodeURIComponent(token)}`;
};
