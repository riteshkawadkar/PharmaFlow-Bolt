import { WorkflowTemplate, WorkflowNode, Connection } from '../types/workflow';
import { v4 as uuidv4 } from 'uuid';

// Simple Linear Workflow Template
export const simpleWorkflowTemplate: WorkflowTemplate = {
  id: 'template-simple-linear',
  name: 'Simple Linear Workflow',
  description: 'Basic sequential workflow with start, form, approval, and end',
  category: 'quality_control',
  version: '1.0',
  createdBy: 'system',
  createdAt: new Date(),
  updatedAt: new Date(),
  isPublished: true,
  complianceLevel: 'basic',
  nodes: [
    {
      id: 'start-simple',
      type: 'start',
      position: { x: 100, y: 200 },
      data: {
        label: 'Start Process',
        description: 'Begin the workflow process',
        properties: {
          triggerType: 'manual',
          autoStart: false
        }
      },
      connections: []
    },
    {
      id: 'form-simple',
      type: 'form',
      position: { x: 350, y: 200 },
      data: {
        label: 'Data Collection',
        description: 'Collect required information',
        properties: {
          template: 'basic_form',
          validation: true,
          autoSave: true,
          fields: [
            {
              id: 'title',
              name: 'title',
              type: 'text',
              label: 'Request Title',
              required: true,
              placeholder: 'Enter request title'
            },
            {
              id: 'description',
              name: 'description',
              type: 'textarea',
              label: 'Description',
              required: false,
              placeholder: 'Enter description'
            }
          ]
        }
      },
      connections: []
    },
    {
      id: 'approval-simple',
      type: 'approval',
      position: { x: 600, y: 200 },
      data: {
        label: 'Manager Approval',
        description: 'Requires manager approval',
        properties: {
          approvalType: 'single',
          deadline: 24,
          escalation: true,
          escalationTime: 48
        }
      },
      connections: []
    },
    {
      id: 'end-simple',
      type: 'end',
      position: { x: 850, y: 200 },
      data: {
        label: 'Process Complete',
        description: 'Workflow completed successfully',
        properties: {
          completionAction: 'notify',
          archiveData: true
        }
      },
      connections: []
    }
  ],
  connections: [
    {
      id: 'conn-1',
      sourceNodeId: 'start-simple',
      targetNodeId: 'form-simple',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    },
    {
      id: 'conn-2',
      sourceNodeId: 'form-simple',
      targetNodeId: 'approval-simple',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    },
    {
      id: 'conn-3',
      sourceNodeId: 'approval-simple',
      targetNodeId: 'end-simple',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    }
  ]
};

// Parallel Workflow Template
export const parallelWorkflowTemplate: WorkflowTemplate = {
  id: 'template-parallel',
  name: 'Parallel Review Workflow',
  description: 'Multiple parallel reviews that converge to final approval',
  category: 'document_control',
  version: '1.0',
  createdBy: 'system',
  createdAt: new Date(),
  updatedAt: new Date(),
  isPublished: true,
  complianceLevel: 'gmp',
  nodes: [
    {
      id: 'start-parallel',
      type: 'start',
      position: { x: 100, y: 300 },
      data: {
        label: 'Start Review Process',
        description: 'Begin parallel review workflow',
        properties: {
          triggerType: 'manual',
          autoStart: false
        }
      },
      connections: []
    },
    {
      id: 'form-parallel',
      type: 'form',
      position: { x: 300, y: 300 },
      data: {
        label: 'Document Submission',
        description: 'Submit document for review',
        properties: {
          template: 'document_review',
          validation: true,
          attachments: true,
          fields: [
            {
              id: 'document_title',
              name: 'document_title',
              type: 'text',
              label: 'Document Title',
              required: true
            },
            {
              id: 'document_type',
              name: 'document_type',
              type: 'select',
              label: 'Document Type',
              required: true,
              options: [
                { value: 'sop', label: 'Standard Operating Procedure' },
                { value: 'protocol', label: 'Protocol' },
                { value: 'report', label: 'Report' }
              ]
            }
          ]
        }
      },
      connections: []
    },
    {
      id: 'review-technical',
      type: 'review',
      position: { x: 550, y: 150 },
      data: {
        label: 'Technical Review',
        description: 'Technical expert review',
        properties: {
          reviewType: 'technical',
          deadline: 72,
          requireComments: true
        }
      },
      connections: []
    },
    {
      id: 'review-quality',
      type: 'review',
      position: { x: 550, y: 300 },
      data: {
        label: 'Quality Review',
        description: 'Quality assurance review',
        properties: {
          reviewType: 'quality',
          deadline: 72,
          requireComments: true
        }
      },
      connections: []
    },
    {
      id: 'review-regulatory',
      type: 'review',
      position: { x: 550, y: 450 },
      data: {
        label: 'Regulatory Review',
        description: 'Regulatory compliance review',
        properties: {
          reviewType: 'regulatory',
          deadline: 72,
          requireComments: true
        }
      },
      connections: []
    },
    {
      id: 'approval-final',
      type: 'approval',
      position: { x: 800, y: 300 },
      data: {
        label: 'Final Approval',
        description: 'Final approval after all reviews',
        properties: {
          approvalType: 'single',
          deadline: 24,
          escalation: true
        }
      },
      connections: []
    },
    {
      id: 'end-parallel',
      type: 'end',
      position: { x: 1050, y: 300 },
      data: {
        label: 'Review Complete',
        description: 'Document review completed',
        properties: {
          completionAction: 'publish',
          archiveData: true
        }
      },
      connections: []
    }
  ],
  connections: [
    {
      id: 'conn-p1',
      sourceNodeId: 'start-parallel',
      targetNodeId: 'form-parallel',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    },
    {
      id: 'conn-p2',
      sourceNodeId: 'form-parallel',
      targetNodeId: 'review-technical',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'parallel'
    },
    {
      id: 'conn-p3',
      sourceNodeId: 'form-parallel',
      targetNodeId: 'review-quality',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'parallel'
    },
    {
      id: 'conn-p4',
      sourceNodeId: 'form-parallel',
      targetNodeId: 'review-regulatory',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'parallel'
    },
    {
      id: 'conn-p5',
      sourceNodeId: 'review-technical',
      targetNodeId: 'approval-final',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    },
    {
      id: 'conn-p6',
      sourceNodeId: 'review-quality',
      targetNodeId: 'approval-final',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    },
    {
      id: 'conn-p7',
      sourceNodeId: 'review-regulatory',
      targetNodeId: 'approval-final',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    },
    {
      id: 'conn-p8',
      sourceNodeId: 'approval-final',
      targetNodeId: 'end-parallel',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    }
  ]
};

// Conditional Workflow Template
export const conditionalWorkflowTemplate: WorkflowTemplate = {
  id: 'template-conditional',
  name: 'Conditional Decision Workflow',
  description: 'Workflow with conditional branching based on risk assessment',
  category: 'risk_assessment',
  version: '1.0',
  createdBy: 'system',
  createdAt: new Date(),
  updatedAt: new Date(),
  isPublished: true,
  complianceLevel: 'gmp',
  nodes: [
    {
      id: 'start-conditional',
      type: 'start',
      position: { x: 100, y: 300 },
      data: {
        label: 'Start Risk Assessment',
        description: 'Begin risk assessment workflow',
        properties: {
          triggerType: 'manual',
          autoStart: false
        }
      },
      connections: []
    },
    {
      id: 'form-risk',
      type: 'form',
      position: { x: 300, y: 300 },
      data: {
        label: 'Risk Assessment Form',
        description: 'Evaluate risk level',
        properties: {
          template: 'risk_assessment',
          validation: true,
          fields: [
            {
              id: 'risk_category',
              name: 'risk_category',
              type: 'select',
              label: 'Risk Category',
              required: true,
              options: [
                { value: 'low', label: 'Low Risk' },
                { value: 'medium', label: 'Medium Risk' },
                { value: 'high', label: 'High Risk' },
                { value: 'critical', label: 'Critical Risk' }
              ]
            },
            {
              id: 'impact_score',
              name: 'impact_score',
              type: 'number',
              label: 'Impact Score (1-10)',
              required: true
            }
          ]
        }
      },
      connections: []
    },
    {
      id: 'decision-risk',
      type: 'decision',
      position: { x: 550, y: 300 },
      data: {
        label: 'Risk Level Decision',
        description: 'Route based on risk level',
        properties: {
          logicType: 'if_then_else',
          conditions: [
            {
              field: 'risk_category',
              operator: 'equals',
              value: 'low',
              path: 'low_risk'
            },
            {
              field: 'risk_category',
              operator: 'in',
              value: ['medium', 'high'],
              path: 'high_risk'
            },
            {
              field: 'risk_category',
              operator: 'equals',
              value: 'critical',
              path: 'critical_risk'
            }
          ],
          defaultPath: 'high_risk'
        }
      },
      connections: []
    },
    {
      id: 'approval-low',
      type: 'approval',
      position: { x: 800, y: 150 },
      data: {
        label: 'Supervisor Approval',
        description: 'Low risk - supervisor approval only',
        properties: {
          approvalType: 'single',
          deadline: 24,
          escalation: false
        }
      },
      connections: []
    },
    {
      id: 'approval-high',
      type: 'approval',
      position: { x: 800, y: 300 },
      data: {
        label: 'Management Approval',
        description: 'High risk - management approval required',
        properties: {
          approvalType: 'multiple',
          deadline: 48,
          escalation: true,
          escalationTime: 72
        }
      },
      connections: []
    },
    {
      id: 'approval-critical',
      type: 'approval',
      position: { x: 800, y: 450 },
      data: {
        label: 'Executive Approval',
        description: 'Critical risk - executive approval required',
        properties: {
          approvalType: 'unanimous',
          deadline: 12,
          escalation: true,
          escalationTime: 24
        }
      },
      connections: []
    },
    {
      id: 'end-conditional',
      type: 'end',
      position: { x: 1050, y: 300 },
      data: {
        label: 'Risk Assessment Complete',
        description: 'Risk assessment workflow completed',
        properties: {
          completionAction: 'notify',
          archiveData: true
        }
      },
      connections: []
    }
  ],
  connections: [
    {
      id: 'conn-c1',
      sourceNodeId: 'start-conditional',
      targetNodeId: 'form-risk',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    },
    {
      id: 'conn-c2',
      sourceNodeId: 'form-risk',
      targetNodeId: 'decision-risk',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    },
    {
      id: 'conn-c3',
      sourceNodeId: 'decision-risk',
      targetNodeId: 'approval-low',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'conditional'
    },
    {
      id: 'conn-c4',
      sourceNodeId: 'decision-risk',
      targetNodeId: 'approval-high',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'conditional'
    },
    {
      id: 'conn-c5',
      sourceNodeId: 'decision-risk',
      targetNodeId: 'approval-critical',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'conditional'
    },
    {
      id: 'conn-c6',
      sourceNodeId: 'approval-low',
      targetNodeId: 'end-conditional',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    },
    {
      id: 'conn-c7',
      sourceNodeId: 'approval-high',
      targetNodeId: 'end-conditional',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    },
    {
      id: 'conn-c8',
      sourceNodeId: 'approval-critical',
      targetNodeId: 'end-conditional',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    }
  ]
};

// Loop Workflow Template
export const loopWorkflowTemplate: WorkflowTemplate = {
  id: 'template-loop',
  name: 'Loop Workflow with Retry Logic',
  description: 'Workflow with loop for iterative testing and retry logic',
  category: 'quality_control',
  version: '1.0',
  createdBy: 'system',
  createdAt: new Date(),
  updatedAt: new Date(),
  isPublished: true,
  complianceLevel: 'cfr_part_11',
  nodes: [
    {
      id: 'start-loop',
      type: 'start',
      position: { x: 100, y: 300 },
      data: {
        label: 'Start Testing Process',
        description: 'Begin iterative testing workflow',
        properties: {
          triggerType: 'manual',
          autoStart: false
        }
      },
      connections: []
    },
    {
      id: 'form-test-setup',
      type: 'form',
      position: { x: 300, y: 300 },
      data: {
        label: 'Test Setup',
        description: 'Configure test parameters',
        properties: {
          template: 'test_setup',
          validation: true,
          fields: [
            {
              id: 'test_type',
              name: 'test_type',
              type: 'select',
              label: 'Test Type',
              required: true,
              options: [
                { value: 'potency', label: 'Potency Test' },
                { value: 'purity', label: 'Purity Test' },
                { value: 'stability', label: 'Stability Test' }
              ]
            },
            {
              id: 'max_iterations',
              name: 'max_iterations',
              type: 'number',
              label: 'Maximum Test Iterations',
              required: true
            }
          ]
        }
      },
      connections: []
    },
    {
      id: 'external-test',
      type: 'external_system',
      position: { x: 550, y: 300 },
      data: {
        label: 'Execute Test',
        description: 'Run test on external system',
        properties: {
          system: 'LIMS',
          operation: 'run_test',
          timeout: 300,
          retryAttempts: 3
        }
      },
      connections: []
    },
    {
      id: 'decision-test-result',
      type: 'decision',
      position: { x: 800, y: 300 },
      data: {
        label: 'Test Result Check',
        description: 'Check if test passed or needs retry',
        properties: {
          logicType: 'if_then_else',
          conditions: [
            {
              field: 'test_result',
              operator: 'equals',
              value: 'pass',
              path: 'test_passed'
            },
            {
              field: 'iteration_count',
              operator: 'less_than',
              value: 'max_iterations',
              path: 'retry_test'
            }
          ],
          defaultPath: 'test_failed'
        }
      },
      connections: []
    },
    {
      id: 'timer-retry-delay',
      type: 'timer',
      position: { x: 550, y: 150 },
      data: {
        label: 'Retry Delay',
        description: 'Wait before retrying test',
        properties: {
          delayType: 'fixed',
          delayMinutes: 30,
          businessHoursOnly: false
        }
      },
      connections: []
    },
    {
      id: 'approval-test-passed',
      type: 'approval',
      position: { x: 1050, y: 200 },
      data: {
        label: 'Test Results Approval',
        description: 'Approve successful test results',
        properties: {
          approvalType: 'single',
          deadline: 24,
          escalation: false
        }
      },
      connections: []
    },
    {
      id: 'form-failure-analysis',
      type: 'form',
      position: { x: 1050, y: 400 },
      data: {
        label: 'Failure Analysis',
        description: 'Document test failure reasons',
        properties: {
          template: 'failure_analysis',
          validation: true,
          fields: [
            {
              id: 'failure_reason',
              name: 'failure_reason',
              type: 'textarea',
              label: 'Failure Reason',
              required: true
            },
            {
              id: 'corrective_action',
              name: 'corrective_action',
              type: 'textarea',
              label: 'Corrective Action',
              required: true
            }
          ]
        }
      },
      connections: []
    },
    {
      id: 'end-success',
      type: 'end',
      position: { x: 1300, y: 200 },
      data: {
        label: 'Test Successful',
        description: 'Testing completed successfully',
        properties: {
          completionAction: 'notify',
          archiveData: true
        }
      },
      connections: []
    },
    {
      id: 'end-failure',
      type: 'end',
      position: { x: 1300, y: 400 },
      data: {
        label: 'Test Failed',
        description: 'Testing failed after maximum retries',
        properties: {
          completionAction: 'escalate',
          archiveData: true
        }
      },
      connections: []
    }
  ],
  connections: [
    {
      id: 'conn-l1',
      sourceNodeId: 'start-loop',
      targetNodeId: 'form-test-setup',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    },
    {
      id: 'conn-l2',
      sourceNodeId: 'form-test-setup',
      targetNodeId: 'external-test',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    },
    {
      id: 'conn-l3',
      sourceNodeId: 'external-test',
      targetNodeId: 'decision-test-result',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    },
    {
      id: 'conn-l4',
      sourceNodeId: 'decision-test-result',
      targetNodeId: 'timer-retry-delay',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'conditional'
    },
    {
      id: 'conn-l5',
      sourceNodeId: 'timer-retry-delay',
      targetNodeId: 'external-test',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    },
    {
      id: 'conn-l6',
      sourceNodeId: 'decision-test-result',
      targetNodeId: 'approval-test-passed',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'conditional'
    },
    {
      id: 'conn-l7',
      sourceNodeId: 'decision-test-result',
      targetNodeId: 'form-failure-analysis',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'conditional'
    },
    {
      id: 'conn-l8',
      sourceNodeId: 'approval-test-passed',
      targetNodeId: 'end-success',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    },
    {
      id: 'conn-l9',
      sourceNodeId: 'form-failure-analysis',
      targetNodeId: 'end-failure',
      sourceHandle: 'output',
      targetHandle: 'input',
      type: 'sequence'
    }
  ]
};

// Export all templates
export const workflowTemplates = [
  simpleWorkflowTemplate,
  parallelWorkflowTemplate,
  conditionalWorkflowTemplate,
  loopWorkflowTemplate
];

export default workflowTemplates;