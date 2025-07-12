import { useState, useEffect, useRef, useCallback } from 'react';

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: Date;
  userId: string;
}

export interface WebSocketHook {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  sendMessage: (type: string, payload: any) => void;
  lastMessage: WebSocketMessage | null;
  reconnect: () => void;
}

export const useWebSocket = (url: string, userId: string): WebSocketHook => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');
    
    try {
      // For demo purposes, we'll simulate WebSocket connection
      // In production, this would be a real WebSocket URL
      console.log('🔌 Attempting WebSocket connection to:', url);
      
      // Simulate connection delay
      setTimeout(() => {
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttempts.current = 0;
        console.log('✅ WebSocket connected successfully');
        
        // Simulate receiving initial connection message
        const welcomeMessage: WebSocketMessage = {
          type: 'connection_established',
          payload: { userId, timestamp: new Date() },
          timestamp: new Date(),
          userId: 'system'
        };
        setLastMessage(welcomeMessage);
      }, 1000);

    } catch (error) {
      console.error('❌ WebSocket connection failed:', error);
      setConnectionStatus('error');
      scheduleReconnect();
    }
  }, [url, userId]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setConnectionStatus('disconnected');
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (reconnectAttempts.current < maxReconnectAttempts) {
      const delay = Math.pow(2, reconnectAttempts.current) * 1000; // Exponential backoff
      reconnectAttempts.current++;
      
      console.log(`🔄 Scheduling reconnect attempt ${reconnectAttempts.current} in ${delay}ms`);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, delay);
    } else {
      console.error('❌ Max reconnection attempts reached');
      setConnectionStatus('error');
    }
  }, [connect]);

  const sendMessage = useCallback((type: string, payload: any) => {
    if (!isConnected) {
      console.warn('⚠️ Cannot send message: WebSocket not connected');
      return;
    }

    const message: WebSocketMessage = {
      type,
      payload,
      timestamp: new Date(),
      userId
    };

    // Simulate sending message
    console.log('📤 Sending WebSocket message:', message);
    
    // Simulate message echo for demo
    setTimeout(() => {
      const echoMessage: WebSocketMessage = {
        type: 'message_received',
        payload: { originalMessage: message, status: 'delivered' },
        timestamp: new Date(),
        userId: 'system'
      };
      setLastMessage(echoMessage);
    }, 100);
  }, [isConnected, userId]);

  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttempts.current = 0;
    setTimeout(connect, 1000);
  }, [connect, disconnect]);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return {
    isConnected,
    connectionStatus,
    sendMessage,
    lastMessage,
    reconnect
  };
};