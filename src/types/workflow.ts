// Workflow Builder Types

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
  connections: Connection[];
  validation?: ValidationResult;
}

export interface Connection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandle?: string;
  targetHandle?: string;
  type: ConnectionType;
}

export interface NodeData {
  label: string;
  description?: string;
  properties: Record<string, any>;
  pharmaceuticalType?: PharmaceuticalNodeType;
  complianceRequirements?: ComplianceRequirement[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  id: string;
  message: string;
  severity: 'error' | 'warning';
  field?: string;
}

export interface ValidationWarning {
  id: string;
  message: string;
  suggestion?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: WorkflowCategory;
  nodes: WorkflowNode[];
  connections: Connection[];
  version: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  complianceLevel: ComplianceLevel;
}

export interface ComponentLibraryItem {
  id: string;
  name: string;
  category: ComponentCategory;
  icon: string;
  description: string;
  defaultProperties: Record<string, any>;
  pharmaceuticalType?: PharmaceuticalNodeType;
  complianceRequirements: ComplianceRequirement[];
  estimatedDuration?: number;
}

export type NodeType = 
  | 'start'
  | 'end'
  | 'form'
  | 'approval'
  | 'review'
  | 'decision'
  | 'timer'
  | 'api_connector'
  | 'database_query'
  | 'external_system'
  | 'file_processor'
  | 'email_notifier'
  | 'sms_alert'
  | 'dashboard_update'
  | 'report_generator'
  | 'electronic_signature'
  | 'audit_logger'
  | 'training_verification'
  | 'compliance_checker';

export type ConnectionType = 
  | 'sequence'
  | 'conditional'
  | 'parallel'
  | 'data_flow';

export type ComponentCategory = 
  | 'process'
  | 'integration'
  | 'communication'
  | 'compliance'
  | 'control_flow';

export type PharmaceuticalNodeType =
  | 'batch_release'
  | 'equipment_qualification'
  | 'document_control'
  | 'training_management'
  | 'deviation_handling'
  | 'change_control'
  | 'supplier_qualification'
  | 'risk_assessment';

export type ComplianceLevel = 
  | 'basic'
  | 'gmp'
  | 'cfr_part_11'
  | 'gamp_5'
  | 'iso_13485';

export interface CanvasState {
  zoom: number;
  pan: { x: number; y: number };
  selectedNodes: string[];
  selectedConnections: string[];
  isConnecting: boolean;
  connectionStart?: { nodeId: string; handle: string };
}

export interface CollaborationState {
  activeUsers: CollaborationUser[];
  cursors: Record<string, CursorPosition>;
  selections: Record<string, string[]>;
  locks: Record<string, string>; // nodeId -> userId
}

export interface CollaborationUser {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  isActive: boolean;
  lastSeen: Date;
}

export interface CursorPosition {
  x: number;
  y: number;
  userId: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  currentNodeId?: string;
  startedAt: Date;
  completedAt?: Date;
  executedBy: string;
  context: Record<string, any>;
  history: ExecutionStep[];
}

export interface ExecutionStep {
  id: string;
  nodeId: string;
  status: StepStatus;
  startedAt: Date;
  completedAt?: Date;
  input?: any;
  output?: any;
  error?: string;
  duration?: number;
}

export type ExecutionStatus = 
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'paused';

export type StepStatus = 
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped';