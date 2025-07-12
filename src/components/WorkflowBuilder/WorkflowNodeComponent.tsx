import React, { useState, useRef, useCallback } from 'react';
import { WorkflowNode } from '../../types/workflow';
import { 
  Play, 
  Square, 
  FileText, 
  CheckCircle, 
  Eye, 
  GitBranch, 
  Clock,
  Database,
  Zap,
  Globe,
  Upload,
  Mail,
  MessageSquare,
  BarChart3,
  FileDown,
  PenTool,
  Shield,
  GraduationCap,
  AlertTriangle,
  MoreVertical,
  Settings,
  Trash2,
  Copy
} from 'lucide-react';

const iconMap = {
  start: Play,
  end: Square,
  form: FileText,
  approval: CheckCircle,
  review: Eye,
  decision: GitBranch,
  timer: Clock,
  api_connector: Zap,
  database_query: Database,
  external_system: Globe,
  file_processor: Upload,
  email_notifier: Mail,
  sms_alert: MessageSquare,
  dashboard_update: BarChart3,
  report_generator: FileDown,
  electronic_signature: PenTool,
  audit_logger: Shield,
  training_verification: GraduationCap,
  compliance_checker: AlertTriangle
};

const nodeColors = {
  start: 'bg-green-100 border-green-300 text-green-800',
  end: 'bg-red-100 border-red-300 text-red-800',
  form: 'bg-blue-100 border-blue-300 text-blue-800',
  approval: 'bg-purple-100 border-purple-300 text-purple-800',
  review: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  decision: 'bg-orange-100 border-orange-300 text-orange-800',
  timer: 'bg-gray-100 border-gray-300 text-gray-800',
  api_connector: 'bg-indigo-100 border-indigo-300 text-indigo-800',
  database_query: 'bg-cyan-100 border-cyan-300 text-cyan-800',
  external_system: 'bg-teal-100 border-teal-300 text-teal-800',
  file_processor: 'bg-pink-100 border-pink-300 text-pink-800',
  email_notifier: 'bg-blue-100 border-blue-300 text-blue-800',
  sms_alert: 'bg-green-100 border-green-300 text-green-800',
  dashboard_update: 'bg-purple-100 border-purple-300 text-purple-800',
  report_generator: 'bg-orange-100 border-orange-300 text-orange-800',
  electronic_signature: 'bg-red-100 border-red-300 text-red-800',
  audit_logger: 'bg-gray-100 border-gray-300 text-gray-800',
  training_verification: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  compliance_checker: 'bg-red-100 border-red-300 text-red-800'
};

interface WorkflowNodeComponentProps {
  node: WorkflowNode;
  isSelected: boolean;
  isReadOnly?: boolean;
  onMove: (position: { x: number; y: number }) => void;
  onSelect: (multiSelect?: boolean) => void;
  onConnectionStart: (handle: string) => void;
  onConnectionEnd: (handle: string) => void;
  onConfigure?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export const WorkflowNodeComponent: React.FC<WorkflowNodeComponentProps> = ({
  node,
  isSelected,
  isReadOnly = false,
  onMove,
  onSelect,
  onConnectionStart,
  onConnectionEnd,
  onConfigure,
  onDelete,
  onDuplicate
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  const IconComponent = iconMap[node.type] || FileText;
  const colorClass = nodeColors[node.type] || 'bg-gray-100 border-gray-300 text-gray-800';

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isReadOnly) return;
    
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y
    });
    
    onSelect(e.ctrlKey || e.metaKey);
  }, [isReadOnly, node.position, onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && !isReadOnly) {
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      };
      onMove(newPosition);
    }
  }, [isDragging, isReadOnly, dragStart, onMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleConnectionPointMouseDown = useCallback((e: React.MouseEvent, handle: string, isOutput: boolean) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isReadOnly) return;
    
    console.log('🔗 Connection point clicked:', { nodeId: node.id, handle, isOutput });
    
    if (isOutput) {
      console.log('Starting connection from:', node.id, handle);
      onConnectionStart(handle);
    } else {
      console.log('Ending connection at:', node.id, handle);
      onConnectionEnd(handle);
    }
  }, [isReadOnly, node.id, onConnectionStart, onConnectionEnd]);

  const hasValidationErrors = node.validation && !node.validation.isValid;
  const hasWarnings = node.validation && node.validation.warnings.length > 0;

  return (
    <div
      ref={nodeRef}
      className={`
        absolute select-none transition-all duration-200
        ${isSelected ? 'z-20' : 'z-10'}
        ${isDragging ? 'scale-105 shadow-xl cursor-grabbing' : 'cursor-move hover:shadow-md'}
      `}
      style={{
        left: node.position.x,
        top: node.position.y,
        transform: isDragging ? 'rotate(1deg)' : 'rotate(0deg)'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Connection Points - Input */}
      {node.type !== 'start' && (
        <div
          className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full cursor-crosshair hover:border-blue-700 hover:bg-blue-50 hover:scale-125 transition-all z-30 flex items-center justify-center"
          onMouseDown={(e) => handleConnectionPointMouseDown(e, 'input', false)}
          title="Input connection point - Click to connect from another node"
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
      )}

      {/* Connection Points - Output */}
      {node.type !== 'end' && (
        <div
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border-2 border-green-500 rounded-full cursor-crosshair hover:border-green-700 hover:bg-green-50 hover:scale-125 transition-all z-30 flex items-center justify-center"
          onMouseDown={(e) => handleConnectionPointMouseDown(e, 'output', true)}
          title="Output connection point - Click to start connection"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      )}

      {/* Node Body */}
      <div
        className={`
          relative min-w-48 p-4 rounded-lg border-2 shadow-sm transition-all bg-white
          ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 border-blue-500' : colorClass}
          ${hasValidationErrors ? 'border-red-500 bg-red-50' : ''}
        `}
      >
        {/* Node Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`p-1 rounded ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`}>
              <IconComponent className="w-4 h-4 flex-shrink-0" />
            </div>
            <span className="font-medium text-sm truncate">{node.data.label}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Validation Status */}
            {hasValidationErrors && (
              <AlertTriangle className="w-4 h-4 text-red-500" title="Validation errors" />
            )}
            {hasWarnings && !hasValidationErrors && (
              <AlertTriangle className="w-4 h-4 text-yellow-500" title="Validation warnings" />
            )}
            
            {/* Compliance Indicator */}
            {node.data.complianceRequirements && node.data.complianceRequirements.length > 0 && (
              <Shield className="w-4 h-4 text-blue-500" title="Compliance requirements" />
            )}
            
            {/* Node Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-32">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('🔧 Configure button clicked for node:', node.id);
                        setShowMenu(false);
                        onConfigure?.();
                        console.log('🔧 onConfigure called');
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configure</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onDuplicate?.();
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Duplicate</span>
                    </button>
                    <hr className="my-1" />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onDelete?.();
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Node Description */}
        {node.data.description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {node.data.description}
          </p>
        )}

        {/* Pharmaceutical Type Badge */}
        {node.data.pharmaceuticalType && (
          <div className="mb-2">
            <span className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              {node.data.pharmaceuticalType.replace('_', ' ')}
            </span>
          </div>
        )}

        {/* Properties Summary */}
        {node.data.properties && Object.keys(node.data.properties).length > 0 && (
          <div className="space-y-1">
            {Object.entries(node.data.properties).slice(0, 2).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-gray-600 capitalize truncate">{key.replace('_', ' ')}:</span>
                <span className="font-medium truncate ml-2 max-w-24">
                  {typeof value === 'object' 
                    ? Array.isArray(value) 
                      ? `[${value.length} items]`
                      : JSON.stringify(value).slice(0, 15) + '...'
                    : String(value).slice(0, 15)
                  }
                </span>
              </div>
            ))}
            {Object.keys(node.data.properties).length > 2 && (
              <div className="text-xs text-gray-500">
                +{Object.keys(node.data.properties).length - 2} more...
              </div>
            )}
          </div>
        )}

        {/* Validation Errors */}
        {hasValidationErrors && (
          <div className="mt-2 p-2 bg-red-100 rounded text-xs">
            <div className="font-medium text-red-800 mb-1">Issues:</div>
            {node.validation!.errors.slice(0, 1).map(error => (
              <div key={error.id} className="text-red-700">
                • {error.message}
              </div>
            ))}
            {node.validation!.errors.length > 1 && (
              <div className="text-red-600">
                +{node.validation!.errors.length - 1} more
              </div>
            )}
          </div>
        )}

        {/* Connection Status */}
        <div className="absolute -bottom-8 left-0 right-0 text-center">
          <div className="text-xs text-gray-400 font-mono bg-white px-2 py-1 rounded border inline-block">
            ID: {node.id.slice(-6)}
          </div>
        </div>
      </div>
    </div>
  );
};