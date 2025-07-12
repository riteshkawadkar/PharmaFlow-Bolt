import React from 'react';
import { Connection, WorkflowNode } from '../../types/workflow';

interface ConnectionLineProps {
  connection: Connection;
  nodes: WorkflowNode[];
  isSelected: boolean;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  connection,
  nodes,
  isSelected
}) => {
  const sourceNode = nodes.find(n => n.id === connection.sourceNodeId);
  const targetNode = nodes.find(n => n.id === connection.targetNodeId);

  if (!sourceNode || !targetNode) {
    return null;
  }

  // Calculate exact connection points to match the connection circles
  const nodeWidth = 192; // Actual node width (min-w-48 = 192px)
  const nodeHeight = 120; // Approximate node height including padding
  
  // Source point: right edge center (where green circle is)
  const sourceX = sourceNode.position.x + nodeWidth + 12; // +12 for the circle offset
  const sourceY = sourceNode.position.y + nodeHeight / 2;
  
  // Target point: left edge center (where blue circle is)
  const targetX = targetNode.position.x - 12; // -12 for the circle offset
  const targetY = targetNode.position.y + nodeHeight / 2;

  // Create smooth curved path
  const deltaX = targetX - sourceX;
  const controlPointOffset = Math.max(50, Math.abs(deltaX) * 0.5);
  
  const controlPoint1X = sourceX + controlPointOffset;
  const controlPoint1Y = sourceY;
  const controlPoint2X = targetX - controlPointOffset;
  const controlPoint2Y = targetY;

  const pathData = `
    M ${sourceX} ${sourceY}
    C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${targetX} ${targetY}
  `;

  const connectionColor = isSelected ? '#3B82F6' : '#374151';
  const connectionWidth = isSelected ? 3 : 2;

  return (
    <g>
      {/* Selection Indicator (wider invisible path for easier selection) */}
      <path
        d={pathData}
        stroke="transparent"
        strokeWidth="12"
        fill="none"
        className="cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          console.log('Connection clicked:', connection.id);
        }}
      />
      
      {/* Main Connection Path */}
      <path
        d={pathData}
        stroke={connectionColor}
        strokeWidth={connectionWidth}
        fill="none"
        strokeDasharray={connection.type === 'conditional' ? '5,5' : 'none'}
        className="transition-all duration-200 drop-shadow-sm"
        markerEnd={`url(#arrowhead-${connection.id})`}
      />
      
      {/* Arrow Head Definition */}
      <defs>
        <marker
          id={`arrowhead-${connection.id}`}
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill={connectionColor}
            className="drop-shadow-sm"
          />
        </marker>
      </defs>

      {/* Selection Highlight */}
      {isSelected && (
        <path
          d={pathData}
          stroke="#3B82F6"
          strokeWidth={connectionWidth + 2}
          fill="none"
          opacity="0.2"
          className="pointer-events-none"
        />
      )}
    </g>
  );
};