import React, { useState, useEffect } from 'react';
import { Users, Wifi, WifiOff, Circle, Eye, Edit, MessageSquare } from 'lucide-react';
import { useWebSocket } from '../../hooks/useWebSocket';

interface CollaborationUser {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  isActive: boolean;
  lastSeen: Date;
  currentAction?: string;
}

interface CollaborationPanelProps {
  workflowId: string;
  currentUserId: string;
  onUserCursorMove?: (userId: string, position: { x: number; y: number }) => void;
  onUserSelection?: (userId: string, nodeIds: string[]) => void;
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  workflowId,
  currentUserId,
  onUserCursorMove,
  onUserSelection
}) => {
  const [activeUsers, setActiveUsers] = useState<CollaborationUser[]>([]);
  const [showUserList, setShowUserList] = useState(false);
  
  // Mock WebSocket URL - in production this would be real
  const wsUrl = `ws://localhost:8080/workflow/${workflowId}`;
  const { isConnected, connectionStatus, sendMessage, lastMessage } = useWebSocket(wsUrl, currentUserId);

  // Mock active users for demo
  useEffect(() => {
    const mockUsers: CollaborationUser[] = [
      {
        id: 'user-1',
        name: 'Dr. Sarah Johnson',
        color: '#3B82F6',
        isActive: true,
        lastSeen: new Date(),
        currentAction: 'Editing Form Builder'
      },
      {
        id: 'user-2',
        name: 'Mike Chen',
        color: '#10B981',
        isActive: true,
        lastSeen: new Date(Date.now() - 30000),
        currentAction: 'Viewing Canvas'
      },
      {
        id: 'user-3',
        name: 'Lisa Rodriguez',
        color: '#F59E0B',
        isActive: false,
        lastSeen: new Date(Date.now() - 300000),
        currentAction: 'Disconnected'
      }
    ];
    
    setActiveUsers(mockUsers);
  }, []);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      console.log('📨 Collaboration message received:', lastMessage);
      
      switch (lastMessage.type) {
        case 'user_joined':
          // Handle user joining
          break;
        case 'user_left':
          // Handle user leaving
          break;
        case 'cursor_move':
          onUserCursorMove?.(lastMessage.userId, lastMessage.payload.position);
          break;
        case 'node_selection':
          onUserSelection?.(lastMessage.userId, lastMessage.payload.nodeIds);
          break;
      }
    }
  }, [lastMessage, onUserCursorMove, onUserSelection]);

  const handleBroadcastAction = (action: string, data: any) => {
    sendMessage('user_action', {
      action,
      data,
      workflowId,
      timestamp: new Date()
    });
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getConnectionStatusIcon = () => {
    return isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Collaboration</span>
        </div>
        
        <div className={`flex items-center space-x-1 ${getConnectionStatusColor()}`}>
          {getConnectionStatusIcon()}
          <span className="text-xs capitalize">{connectionStatus}</span>
        </div>
      </div>

      {/* Active Users */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {activeUsers.filter(u => u.isActive).length} active users
          </span>
          <button
            onClick={() => setShowUserList(!showUserList)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {showUserList ? 'Hide' : 'Show'} all
          </button>
        </div>

        {/* User Avatars */}
        <div className="flex items-center space-x-1">
          {activeUsers.filter(u => u.isActive).slice(0, 5).map(user => (
            <div
              key={user.id}
              className="relative"
              title={`${user.name} - ${user.currentAction}`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                style={{ backgroundColor: user.color }}
              >
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
                style={{ backgroundColor: user.isActive ? '#10B981' : '#6B7280' }}
              />
            </div>
          ))}
          
          {activeUsers.filter(u => u.isActive).length > 5 && (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
              +{activeUsers.filter(u => u.isActive).length - 5}
            </div>
          )}
        </div>

        {/* Detailed User List */}
        {showUserList && (
          <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
            {activeUsers.map(user => (
              <div key={user.id} className="flex items-center space-x-2 text-xs">
                <Circle
                  className="w-2 h-2"
                  fill={user.isActive ? '#10B981' : '#6B7280'}
                  color={user.isActive ? '#10B981' : '#6B7280'}
                />
                <span className="font-medium text-gray-900">{user.name}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">{user.currentAction}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collaboration Actions */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleBroadcastAction('request_view', { nodeId: 'current' })}
            className="flex items-center justify-center space-x-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
          >
            <Eye className="w-3 h-3" />
            <span>Follow Me</span>
          </button>
          
          <button
            onClick={() => handleBroadcastAction('start_chat', {})}
            className="flex items-center justify-center space-x-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100"
          >
            <MessageSquare className="w-3 h-3" />
            <span>Chat</span>
          </button>
        </div>
      </div>

      {/* Connection Status Details */}
      {connectionStatus !== 'connected' && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <div className="flex items-center space-x-1">
            <Circle className="w-2 h-2 fill-yellow-500 text-yellow-500" />
            <span className="text-yellow-800">
              {connectionStatus === 'connecting' && 'Connecting to collaboration server...'}
              {connectionStatus === 'error' && 'Connection failed. Retrying...'}
              {connectionStatus === 'disconnected' && 'Disconnected from collaboration server'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};