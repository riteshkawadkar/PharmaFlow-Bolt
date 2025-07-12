// Core Types for PharmaFlow Platform

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  organizationId: string;
  isActive: boolean;
  lastLogin?: Date;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface WorkflowRequest {
  id: string;
  title: string;
  description: string;
  type: WorkflowType;
  status: RequestStatus;
  priority: Priority;
  submittedBy: string;
  submittedAt: Date;
  assignedTo?: string;
  dueDate?: Date;
  completedAt?: Date;
  attachments: Attachment[];
  formData: Record<string, any>;
  auditTrail: AuditEvent[];
}

export interface WorkflowType {
  id: string;
  name: string;
  category: WorkflowCategory;
  description: string;
  formSchema: FormSchema;
  approvalRequired: boolean;
  estimatedDuration: number; // in hours
  complianceRequirements: ComplianceRequirement[];
}

export interface FormSchema {
  fields: FormField[];
  validation: ValidationRule[];
  layout: LayoutConfig;
}

export interface FormField {
  id: string;
  name: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: FieldValidation;
  pharmaceuticalType?: PharmaceuticalFieldType;
}

export interface Attachment {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string;
  virusScanned: boolean;
  url: string;
}

export interface AuditEvent {
  id: string;
  timestamp: Date;
  userId: string;
  action: AuditAction;
  objectType: string;
  objectId: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
  ipAddress: string;
  userAgent: string;
}

export type RequestStatus = 
  | 'draft' 
  | 'submitted' 
  | 'in_review' 
  | 'approved' 
  | 'rejected' 
  | 'completed' 
  | 'cancelled';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type WorkflowCategory = 
  | 'quality_control'
  | 'regulatory_affairs'
  | 'manufacturing'
  | 'research_development'
  | 'clinical_trials'
  | 'supply_chain'
  | 'equipment_management'
  | 'document_control';

export type FieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'datetime'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'signature'
  | 'pharmaceutical';

export type PharmaceuticalFieldType =
  | 'batch_lot_number'
  | 'equipment_id'
  | 'product_code'
  | 'regulatory_reference'
  | 'training_record'
  | 'risk_assessment';

export type AuditAction = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'submit'
  | 'assign';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  customValidator?: string;
}

export interface LayoutConfig {
  columns: number;
  sections: LayoutSection[];
}

export interface LayoutSection {
  title: string;
  fields: string[];
  collapsible?: boolean;
}

export interface ComplianceRequirement {
  id: string;
  regulation: string; // e.g., "21 CFR Part 11", "EU GMP Annex 11"
  requirement: string;
  mandatory: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
}

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  overdueRequests: number;
  averageCompletionTime: number;
  complianceScore: number;
}