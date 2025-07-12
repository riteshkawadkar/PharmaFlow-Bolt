import React, { useState } from 'react';
import { ComponentLibraryItem, ComponentCategory } from '../../types/workflow';
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
  Search,
  Filter
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

const componentLibrary: ComponentLibraryItem[] = [
  // Process Nodes
  {
    id: 'start',
    name: 'Start',
    category: 'process',
    icon: 'start',
    description: 'Workflow entry point',
    defaultProperties: { label: 'Start' },
    complianceRequirements: []
  },
  {
    id: 'end',
    name: 'End',
    category: 'process',
    icon: 'end',
    description: 'Workflow completion point',
    defaultProperties: { label: 'End' },
    complianceRequirements: []
  },
  {
    id: 'form',
    name: 'Form Builder',
    category: 'process',
    icon: 'form',
    description: 'Configurable data collection form',
    defaultProperties: { 
      label: 'Data Collection Form',
      fields: [],
      validation: true
    },
    pharmaceuticalType: 'batch_release',
    complianceRequirements: [
      {
        id: 'cfr-part-11-form',
        regulation: '21 CFR Part 11',
        requirement: 'Electronic records must be accurate and reliable',
        mandatory: true
      }
    ],
    estimatedDuration: 15
  },
  {
    id: 'approval',
    name: 'Approval Node',
    category: 'process',
    icon: 'approval',
    description: 'Single or multi-reviewer approval',
    defaultProperties: { 
      label: 'Approval Required',
      approvers: [],
      approvalType: 'single',
      escalation: true
    },
    pharmaceuticalType: 'batch_release',
    complianceRequirements: [
      {
        id: 'cfr-part-11-approval',
        regulation: '21 CFR Part 11',
        requirement: 'Electronic signatures required for approvals',
        mandatory: true
      }
    ],
    estimatedDuration: 60
  },
  {
    id: 'review',
    name: 'Review Stage',
    category: 'process',
    icon: 'review',
    description: 'Document or data review process',
    defaultProperties: { 
      label: 'Review Stage',
      reviewers: [],
      reviewType: 'parallel',
      deadline: 48
    },
    pharmaceuticalType: 'document_control',
    complianceRequirements: [
      {
        id: 'gmp-review',
        regulation: 'EU GMP Annex 11',
        requirement: 'Review process must be documented',
        mandatory: true
      }
    ],
    estimatedDuration: 120
  },
  {
    id: 'decision',
    name: 'Decision Point',
    category: 'process',
    icon: 'decision',
    description: 'Conditional branching logic',
    defaultProperties: { 
      label: 'Decision Point',
      conditions: [],
      defaultPath: 'continue'
    },
    complianceRequirements: [],
    estimatedDuration: 5
  },

  // Integration Nodes
  {
    id: 'api_connector',
    name: 'API Connector',
    category: 'integration',
    icon: 'api_connector',
    description: 'REST/SOAP/GraphQL API integration',
    defaultProperties: { 
      label: 'API Call',
      method: 'GET',
      url: '',
      authentication: 'none',
      timeout: 30
    },
    complianceRequirements: [
      {
        id: 'data-integrity',
        regulation: 'GAMP 5',
        requirement: 'Data integrity must be maintained during transfer',
        mandatory: true
      }
    ],
    estimatedDuration: 10
  },
  {
    id: 'database_query',
    name: 'Database Query',
    category: 'integration',
    icon: 'database_query',
    description: 'Read/write database operations',
    defaultProperties: { 
      label: 'Database Operation',
      operation: 'SELECT',
      table: '',
      conditions: []
    },
    complianceRequirements: [
      {
        id: 'audit-trail-db',
        regulation: '21 CFR Part 11',
        requirement: 'Database changes must be audited',
        mandatory: true
      }
    ],
    estimatedDuration: 5
  },
  {
    id: 'external_system',
    name: 'External System Call',
    category: 'integration',
    icon: 'external_system',
    description: 'ERP/LIMS/MES system integration',
    defaultProperties: { 
      label: 'System Integration',
      system: 'ERP',
      operation: '',
      parameters: {}
    },
    pharmaceuticalType: 'equipment_qualification',
    complianceRequirements: [
      {
        id: 'system-validation',
        regulation: 'GAMP 5',
        requirement: 'External system interfaces must be validated',
        mandatory: true
      }
    ],
    estimatedDuration: 30
  },

  // Communication Nodes
  {
    id: 'email_notifier',
    name: 'Email Notifier',
    category: 'communication',
    icon: 'email_notifier',
    description: 'Send email notifications',
    defaultProperties: { 
      label: 'Send Email',
      recipients: [],
      template: 'default',
      priority: 'normal'
    },
    complianceRequirements: [],
    estimatedDuration: 2
  },
  {
    id: 'sms_alert',
    name: 'SMS Alert',
    category: 'communication',
    icon: 'sms_alert',
    description: 'Send SMS notifications for urgent alerts',
    defaultProperties: { 
      label: 'SMS Alert',
      recipients: [],
      message: '',
      urgency: 'high'
    },
    complianceRequirements: [],
    estimatedDuration: 1
  },

  // Compliance Nodes
  {
    id: 'electronic_signature',
    name: 'Electronic Signature',
    category: 'compliance',
    icon: 'electronic_signature',
    description: '21 CFR Part 11 compliant e-signature',
    defaultProperties: { 
      label: 'Electronic Signature',
      signers: [],
      reason: 'approval',
      biometric: false
    },
    pharmaceuticalType: 'batch_release',
    complianceRequirements: [
      {
        id: 'cfr-part-11-esig',
        regulation: '21 CFR Part 11',
        requirement: 'Electronic signatures must be unique and verifiable',
        mandatory: true
      }
    ],
    estimatedDuration: 5
  },
  {
    id: 'audit_logger',
    name: 'Audit Logger',
    category: 'compliance',
    icon: 'audit_logger',
    description: 'Comprehensive audit trail logging',
    defaultProperties: { 
      label: 'Audit Log',
      events: ['all'],
      retention: 2555, // 7 years in days
      encryption: true
    },
    complianceRequirements: [
      {
        id: 'audit-trail-req',
        regulation: '21 CFR Part 11',
        requirement: 'Audit trails must be comprehensive and tamper-evident',
        mandatory: true
      }
    ],
    estimatedDuration: 1
  },
  {
    id: 'training_verification',
    name: 'Training Verification',
    category: 'compliance',
    icon: 'training_verification',
    description: 'Verify user competency and training',
    defaultProperties: { 
      label: 'Training Check',
      requirements: [],
      validity: 365,
      autoCheck: true
    },
    pharmaceuticalType: 'training_management',
    complianceRequirements: [
      {
        id: 'training-req',
        regulation: 'EU GMP Chapter 2',
        requirement: 'Personnel must be trained and qualified',
        mandatory: true
      }
    ],
    estimatedDuration: 10
  },
  {
    id: 'compliance_checker',
    name: 'Compliance Checker',
    category: 'compliance',
    icon: 'compliance_checker',
    description: 'Automated regulatory compliance validation',
    defaultProperties: { 
      label: 'Compliance Check',
      regulations: ['21 CFR Part 11'],
      severity: 'error',
      autoFix: false
    },
    complianceRequirements: [
      {
        id: 'compliance-validation',
        regulation: 'GAMP 5',
        requirement: 'Automated compliance checks must be validated',
        mandatory: true
      }
    ],
    estimatedDuration: 15
  }
];

interface ComponentLibraryProps {
  onComponentDrag: (component: ComponentLibraryItem) => void;
  searchTerm?: string;
  selectedCategory?: ComponentCategory | 'all';
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  onComponentDrag,
  searchTerm = '',
  selectedCategory = 'all'
}) => {
  const [expandedCategories, setExpandedCategories] = useState<ComponentCategory[]>([
    'process', 'integration', 'communication', 'compliance'
  ]);

  const toggleCategory = (category: ComponentCategory) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredComponents = componentLibrary.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedComponents = filteredComponents.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<ComponentCategory, ComponentLibraryItem[]>);

  const categoryLabels: Record<ComponentCategory, string> = {
    process: 'Process Nodes',
    integration: 'Integration Nodes',
    communication: 'Communication Nodes',
    compliance: 'Compliance Nodes',
    control_flow: 'Control Flow'
  };

  const categoryColors: Record<ComponentCategory, string> = {
    process: 'bg-blue-100 text-blue-800',
    integration: 'bg-green-100 text-green-800',
    communication: 'bg-purple-100 text-purple-800',
    compliance: 'bg-red-100 text-red-800',
    control_flow: 'bg-gray-100 text-gray-800'
  };

  const handleDragStart = (e: React.DragEvent, component: ComponentLibraryItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    e.dataTransfer.effectAllowed = 'copy';
    onComponentDrag(component);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Component Library</h3>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search components..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => {/* Handle search in parent component */}}
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          <button
            className={`px-2 py-1 text-xs rounded-full ${
              selectedCategory === 'all' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {Object.entries(categoryLabels).map(([category, label]) => (
            <button
              key={category}
              className={`px-2 py-1 text-xs rounded-full ${
                selectedCategory === category 
                  ? categoryColors[category as ComponentCategory]
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label.replace(' Nodes', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedComponents).map(([category, components]) => {
          const isExpanded = expandedCategories.includes(category as ComponentCategory);
          
          return (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category as ComponentCategory)}
                className="flex items-center justify-between w-full text-left mb-2"
              >
                <h4 className="text-sm font-medium text-gray-700">
                  {categoryLabels[category as ComponentCategory]}
                </h4>
                <span className="text-xs text-gray-500">
                  {components.length}
                </span>
              </button>

              {isExpanded && (
                <div className="space-y-2">
                  {components.map(component => {
                    const IconComponent = iconMap[component.icon as keyof typeof iconMap];
                    
                    return (
                      <div
                        key={component.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, component)}
                        className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-md ${categoryColors[component.category]} group-hover:scale-110 transition-transform`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-gray-900 truncate">
                              {component.name}
                            </h5>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {component.description}
                            </p>
                            
                            {/* Pharmaceutical Type Badge */}
                            {component.pharmaceuticalType && (
                              <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                                {component.pharmaceuticalType.replace('_', ' ')}
                              </span>
                            )}
                            
                            {/* Compliance Requirements */}
                            {component.complianceRequirements.length > 0 && (
                              <div className="flex items-center mt-2 space-x-1">
                                <Shield className="w-3 h-3 text-red-500" />
                                <span className="text-xs text-red-600">
                                  {component.complianceRequirements.length} compliance req.
                                </span>
                              </div>
                            )}
                            
                            {/* Estimated Duration */}
                            {component.estimatedDuration && (
                              <div className="flex items-center mt-1 space-x-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  ~{component.estimatedDuration}min
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 space-y-1">
          <div>Total Components: {componentLibrary.length}</div>
          <div>Compliance Ready: {componentLibrary.filter(c => c.complianceRequirements.length > 0).length}</div>
        </div>
      </div>
    </div>
  );
};