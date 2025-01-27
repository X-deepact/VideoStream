import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import logger from '@/lib/logger';
import { NotificationResponse } from '@/data/dto/notification';
import {
  // invalidateAccount,
  retrieveAuthToken,
} from '@/data/model/userAccount';
import { fetchNotificationsCount } from '@/services/notification';
// import { LOGOUT_PATH } from '@/data/route';

const wsURL = import.meta.env.VITE_WS_NOTIFICATION_URL;

type WebSocketContextType = {
  newNotifications: NotificationResponse[];
  count: number;
  isConnected: boolean;
  sendMessage: (data: unknown) => void;
  setCount: React.Dispatch<React.SetStateAction<number>>;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const NotificationWSProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [count, setCount] = useState<number>(0);
  const [newNotifications, setNewNotifications] = useState<
    NotificationResponse[]
  >([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const token = retrieveAuthToken();

  useEffect(() => {
    if (!wsURL || !token) return;
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) return;

    const fullURL = `${wsURL}?token=${token}`;
    const ws = new WebSocket(fullURL);
    wsRef.current = ws;

    ws.onopen = () => {
      logger.log('WebSocket connected:', fullURL);
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message: NotificationResponse = JSON.parse(event.data);
        logger.log('New message received:', message);

        setNewNotifications((prev) => {
          const isAlreadyExists = prev.some((item) => item.id === message.id);
          if (!isAlreadyExists) {
            setCount((prevCount) => prevCount + 1);
            return [message, ...prev];
          }
          return prev;
        });
      } catch (error) {
        logger.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => logger.error('WebSocket error:', error);

    ws.onclose = (event) => {
      logger.warn('WebSocket closed:', event);
      setIsConnected(false);

      // TODO: commented while development
      // invalidateAccount();
      // window.location.href = LOGOUT_PATH;
    };

    return () => {
      ws.close();
      logger.log('WebSocket connection closed.');
    };
  }, [token]);

  useEffect(() => {
    const getContents = async () => {
      try {
        const response = await fetchNotificationsCount();

        if (!response) {
          throw new Error('Failed to fetch notification count!');
        }

        setCount(response?.num);
      } catch {
        logger.error('Error fetching notification count');
      }
    };

    getContents();
  }, []);

  const sendMessage = (data: unknown) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      logger.error('WebSocket is not connected.');
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ newNotifications, count, isConnected, sendMessage, setCount }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotificationWS = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
