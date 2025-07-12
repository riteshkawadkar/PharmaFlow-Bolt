import React, { useRef, useEffect, useState, useCallback } from 'react';
import { WorkflowNode, Connection, CanvasState } from '../../types/workflow';
import { WorkflowNodeComponent } from './WorkflowNodeComponent';
import { ConnectionLine } from './ConnectionLine';
import { ZoomIn, ZoomOut, Maximize, Save, Play, Users, AlertCircle } from 'lucide-react';

interface CanvasProps {
  nodes: WorkflowNode[];
  connections: Connection[];
  canvasState: CanvasState;
  onNodeMove: (nodeId: string, position: { x: number; y: number }) => void;
  onNodeSelect: (nodeId: string, multiSelect?: boolean) => void;
  onConnectionCreate: (connection: Omit<Connection, 'id'>) => void;
  onCanvasStateChange: (state: Partial<CanvasState>) => void;
  onSave: () => void;
  onExecute: () => void;
  onNodeAdd: (node: WorkflowNode) => void;
  onNodeConfigure: (nodeId: string) => void;
  onNodeDelete: (nodeId: string) => void;
  onNodeDuplicate: (nodeId: string) => void;
  isReadOnly?: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({
  nodes,
  connections,
  canvasState,
  onNodeMove,
  onNodeSelect,
  onConnectionCreate,
  onCanvasStateChange,
  onSave,
  onExecute,
  onNodeAdd,
  onNodeConfigure,
  onNodeDelete,
  onNodeDuplicate,
  isReadOnly = false
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  // Use useRef for connection state to persist across renders
  const connectionStartRef = useRef<{ nodeId: string; handle: string } | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (!isReadOnly && nodes.length > 0) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(timer);
    }
  }, [nodes, connections, isReadOnly]);

  const handleAutoSave = async () => {
    setIsAutoSaving(true);
    try {
      await onSave();
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  // Handle canvas panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current && !canvasState.isConnecting) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      
      // Clear selections when clicking on empty canvas
      onCanvasStateChange({
        selectedNodes: [],
        selectedConnections: []
      });
    }
  }, [canvasState.isConnecting, onCanvasStateChange]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && !canvasState.isConnecting) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      onCanvasStateChange({
        pan: {
          x: canvasState.pan.x + deltaX,
          y: canvasState.pan.y + deltaY
        }
      });
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, dragStart, canvasState.pan, canvasState.isConnecting, onCanvasStateChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // Don't clear connection state on mouse up - only on ESC or successful connection
  }, [isConnecting, onCanvasStateChange]);

  // Handle zoom
  const handleZoom = useCallback((delta: number) => {
    const newZoom = Math.max(0.1, Math.min(3, canvasState.zoom + delta));
    onCanvasStateChange({ zoom: newZoom });
  }, [canvasState.zoom, onCanvasStateChange]);

  // Handle wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      handleZoom(delta);
    }
  }, [handleZoom]);

  // Handle drop from component library
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const componentData = JSON.parse(e.dataTransfer.getData('application/json'));
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      
      if (canvasRect) {
        const position = {
          x: (e.clientX - canvasRect.left - canvasState.pan.x) / canvasState.zoom,
          y: (e.clientY - canvasRect.top - canvasState.pan.y) / canvasState.zoom
        };

        const newNode: WorkflowNode = {
          id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: componentData.id as any,
          position,
          data: {
            label: componentData.name,
            description: componentData.description,
            properties: { ...componentData.defaultProperties },
            pharmaceuticalType: componentData.pharmaceuticalType,
            complianceRequirements: componentData.complianceRequirements || []
          },
          connections: []
        };

        onNodeAdd(newNode);
      }
    } catch (error) {
      console.error('Error handling component drop:', error);
    }
  }, [canvasState, onNodeAdd]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  // Handle connection start
  const handleConnectionStart = useCallback((nodeId: string, handle: string) => {
    console.log('🔗 Starting connection from:', nodeId, handle);
    console.log('🔗 Ref before setting:', connectionStartRef.current);
    connectionStartRef.current = { nodeId, handle };
    console.log('🔗 Ref after setting:', connectionStartRef.current);
    setIsConnecting(true);
    onCanvasStateChange({
      isConnecting: true,
      connectionStart: { nodeId, handle }
    });
    console.log('✅ Connection state set in ref:', connectionStartRef.current);
    alert(`🔗 Starting connection from: ${nodeId}`);
  }, [onCanvasStateChange]);

  // Handle connection end
  const handleConnectionEnd = useCallback((nodeId: string, handle: string) => {
    console.log('🔗 Ending connection at:', nodeId, handle);
    console.log('🔗 Ref at start of handleConnectionEnd:', connectionStartRef.current);
    console.log('🔗 isConnecting state:', isConnecting);
    console.log('🔗 Current connection start state:', connectionStartRef.current);
    
    if (connectionStartRef.current && connectionStartRef.current.nodeId !== nodeId) {
      const newConnection = {
        sourceNodeId: connectionStartRef.current.nodeId,
        targetNodeId: nodeId,
        sourceHandle: connectionStartRef.current.handle,
        targetHandle: handle,
        type: 'sequence' as const
      };
      
      console.log('🔗 Creating connection:', newConnection);
      alert(`✅ Connected: ${connectionStartRef.current.nodeId} → ${nodeId}`);
      onConnectionCreate(newConnection);
      
      // Clear connection state after successful connection
      connectionStartRef.current = null;
      setIsConnecting(false);
      onCanvasStateChange({
        isConnecting: false,
        connectionStart: undefined
      });
    } else if (connectionStartRef.current && connectionStartRef.current.nodeId === nodeId) {
      alert('❌ Cannot connect node to itself');
      // Clear connection state
      connectionStartRef.current = null;
      setIsConnecting(false);
      onCanvasStateChange({
        isConnecting: false,
        connectionStart: undefined
      });
    } else {
      console.log('❌ No connection start found, ref value:', connectionStartRef.current);
      console.log('❌ isConnecting state was:', isConnecting);
      alert('❌ No GREEN circle selected - click a GREEN output circle first');
    }
  }, [onConnectionCreate, onCanvasStateChange]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            onSave();
            setLastSaved(new Date());
            break;
          case '=':
          case '+':
            e.preventDefault();
            handleZoom(0.1);
            break;
          case '-':
            e.preventDefault();
            handleZoom(-0.1);
            break;
          case '0':
            e.preventDefault();
            onCanvasStateChange({ zoom: 1, pan: { x: 0, y: 0 } });
            break;
        }
      }
      
      // Delete selected nodes
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (canvasState.selectedNodes.length > 0) {
          canvasState.selectedNodes.forEach(nodeId => {
            onNodeDelete(nodeId);
          });
        }
      }
      
      // Escape to cancel connection
      if (e.key === 'Escape') {
        if (isConnecting) {
          console.log('🔗 Canceling connection via ESC key');
          connectionStartRef.current = null;
          setIsConnecting(false);
          onCanvasStateChange({
            isConnecting: false,
            connectionStart: undefined
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleZoom, onSave, onCanvasStateChange, canvasState.selectedNodes, onNodeDelete, isConnecting]);

  const canvasStyle = {
    transform: `scale(${canvasState.zoom}) translate(${canvasState.pan.x}px, ${canvasState.pan.y}px)`,
    transformOrigin: '0 0'
  };

  return (
    <div className="relative w-full h-full bg-gray-50 overflow-hidden">
      {/* Canvas Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-white rounded-lg shadow-lg p-2">
        <button
          onClick={() => handleZoom(0.1)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="Zoom In (Ctrl/Cmd + +)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => handleZoom(-0.1)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="Zoom Out (Ctrl/Cmd + -)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onCanvasStateChange({ zoom: 1, pan: { x: 0, y: 0 } })}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="Fit to Screen (Ctrl/Cmd + 0)"
        >
          <Maximize className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-gray-300" />
        
        <span className="text-sm text-gray-500 px-2">
          {Math.round(canvasState.zoom * 100)}%
        </span>
      </div>

      {/* Action Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-white rounded-lg shadow-lg p-2">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>1 user</span>
        </div>
        
        <div className="w-px h-6 bg-gray-300" />
        
        {isAutoSaving && (
          <span className="text-xs text-blue-600 flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span>Saving...</span>
          </span>
        )}
        
        {lastSaved && !isAutoSaving && (
          <span className="text-xs text-green-600">
            Saved {lastSaved.toLocaleTimeString()}
          </span>
        )}
        
        <button
          onClick={() => {
            onSave();
            setLastSaved(new Date());
          }}
          className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="Save (Ctrl/Cmd + S)"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
        
        <button
          onClick={onExecute}
          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
          title="Test Workflow"
        >
          <Play className="w-4 h-4" />
          <span>Test</span>
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: `${20 * canvasState.zoom}px ${20 * canvasState.zoom}px`,
            backgroundPosition: `${canvasState.pan.x}px ${canvasState.pan.y}px`
          }}
        />

        {/* Drop Zone Indicator */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border-2 border-dashed border-transparent hover:border-blue-300 transition-colors" />
        </div>

        {/* Workflow Content */}
        <div style={canvasStyle} className="relative">
          {/* Connections */}
          <svg 
            className="absolute inset-0 pointer-events-none overflow-visible" 
            style={{ zIndex: 1 }}
            width="5000"
            height="5000"
            viewBox="0 0 5000 5000"
          >
            {connections.map(connection => (
              <ConnectionLine
                key={connection.id}
                connection={connection}
                nodes={nodes}
                isSelected={canvasState.selectedConnections.includes(connection.id)}
              />
            ))}
          </svg>

          {/* Nodes */}
          <div className="relative" style={{ zIndex: 2 }}>
            {nodes.map(node => (
              <WorkflowNodeComponent
                key={node.id}
                node={node}
                isSelected={canvasState.selectedNodes.includes(node.id)}
                isReadOnly={isReadOnly}
                onMove={(position) => onNodeMove(node.id, position)}
                onSelect={(multiSelect) => onNodeSelect(node.id, multiSelect)}
                onConnectionStart={(handle) => handleConnectionStart(node.id, handle)}
                onConnectionEnd={(handle) => handleConnectionEnd(node.id, handle)}
                onConfigure={() => onNodeConfigure(node.id)}
                onDelete={() => onNodeDelete(node.id)}
                onDuplicate={() => onNodeDuplicate(node.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Canvas Info */}
      <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3">
        <div className="text-xs text-gray-500 space-y-1">
          <div>Nodes: {nodes.length}</div>
          <div>Connections: {connections.length}</div>
          <div>Zoom: {Math.round(canvasState.zoom * 100)}%</div>
          <div>Position: {Math.round(canvasState.pan.x)}, {Math.round(canvasState.pan.y)}</div>
        </div>
      </div>

      {/* Connection Mode Indicator */}
      {isConnecting && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <div>
              <div className="text-sm font-medium">Connection Mode Active</div>
              <div className="text-xs opacity-90">Click on a target node's input (blue circle) to connect, or press ESC to cancel</div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {nodes.length <= 2 && (
        <div className="absolute bottom-4 right-4 z-10 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-sm">
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-2">🚀 Getting Started:</div>
            <ul className="space-y-1 text-xs">
              <li>• Drag components from the left panel to canvas</li>
              <li>• Click green circles (→) to start connections</li>
              <li>• Click blue circles (←) to complete connections</li>
              <li>• Select nodes to configure properties</li>
              <li>• Use mouse wheel + Ctrl to zoom</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};