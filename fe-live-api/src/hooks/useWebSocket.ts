import { useEffect, useState } from 'react';

const useWebSocket = (url: string) => {
  const [broadcastUrl, setBroadcastUrl] = useState<string | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received data: ', data);

      if (data.broadcast_url) {
        setBroadcastUrl(data.broadcast_url);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error: ', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    return () => {
      socket.close();
    };
  }, [url]);

  return broadcastUrl;
};

export default useWebSocket;
