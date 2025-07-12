import React, { useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { RequestSubmissionForm } from '../components/RequestPortal/RequestSubmissionForm';
import { RequestTrackingDashboard } from '../components/RequestPortal/RequestTrackingDashboard';
import { WorkflowType, WorkflowRequest } from '../types';
import { Plus, List } from 'lucide-react';

// Mock data for demonstration
const mockWorkflowTypes: WorkflowType[] = [
  {
    id: 'qc-batch-release',
    name: 'QC Batch Release',
    category: 'quality_control',
    description: 'Quality control testing and batch release approval workflow',
    estimatedDuration: 24,
    approvalRequired: true,
    complianceRequirements: [
      {
        id: 'cfr-part-11',
        regulation: '21 CFR Part 11',
        requirement: 'Electronic signatures required for batch release',
        mandatory: true
      }
    ],
    formSchema: {
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
          id: 'batch_number',
          name: 'batch_number',
          type: 'pharmaceutical',
          pharmaceuticalType: 'batch_lot_number',
          label: 'Batch/Lot Number',
          required: true,
          placeholder: 'Enter batch number'
        },
        {
          id: 'product_code',
          name: 'product_code',
          type: 'pharmaceutical',
          pharmaceuticalType: 'product_code',
          label: 'Product Code',
          required: true,
          placeholder: 'Enter product code'
        },
        {
          id: 'test_type',
          name: 'test_type',
          type: 'select',
          label: 'Test Type',
          required: true,
          options: [
            { value: 'identity', label: 'Identity Testing' },
            { value: 'purity', label: 'Purity Testing' },
            { value: 'potency', label: 'Potency Testing' },
            { value: 'stability', label: 'Stability Testing' }
          ]
        },
        {
          id: 'priority',
          name: 'priority',
          type: 'select',
          label: 'Priority',
          required: true,
          options: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'urgent', label: 'Urgent' }
          ]
        },
        {
          id: 'description',
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: false,
          placeholder: 'Provide additional details about the request'
        }
      ],
      validation: [],
      layout: {
        columns: 2,
        sections: [
          {
            title: 'Basic Information',
            fields: ['title', 'description']
          },
          {
            title: 'Product Details',
            fields: ['batch_number', 'product_code']
          },
          {
            title: 'Testing Requirements',
            fields: ['test_type', 'priority']
          }
        ]
      }
    }
  },
  {
    id: 'equipment-qualification',
    name: 'Equipment Qualification',
    category: 'equipment_management',
    description: 'Equipment installation, operational, and performance qualification',
    estimatedDuration: 72,
    approvalRequired: true,
    complianceRequirements: [
      {
        id: 'gmp-annex-15',
        regulation: 'EU GMP Annex 15',
        requirement: 'Qualification documentation required',
        mandatory: true
      }
    ],
    formSchema: {
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
          id: 'equipment_id',
          name: 'equipment_id',
          type: 'pharmaceutical',
          pharmaceuticalType: 'equipment_id',
          label: 'Equipment ID',
          required: true,
          placeholder: 'Enter equipment ID'
        },
        {
          id: 'qualification_type',
          name: 'qualification_type',
          type: 'select',
          label: 'Qualification Type',
          required: true,
          options: [
            { value: 'iq', label: 'Installation Qualification (IQ)' },
            { value: 'oq', label: 'Operational Qualification (OQ)' },
            { value: 'pq', label: 'Performance Qualification (PQ)' },
            { value: 'requalification', label: 'Re-qualification' }
          ]
        },
        {
          id: 'scheduled_date',
          name: 'scheduled_date',
          type: 'date',
          label: 'Scheduled Date',
          required: true
        },
        {
          id: 'priority',
          name: 'priority',
          type: 'select',
          label: 'Priority',
          required: true,
          options: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'urgent', label: 'Urgent' }
          ]
        },
        {
          id: 'description',
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: false,
          placeholder: 'Provide additional details about the qualification'
        }
      ],
      validation: [],
      layout: {
        columns: 2,
        sections: [
          {
            title: 'Basic Information',
            fields: ['title', 'description']
          },
          {
            title: 'Equipment Details',
            fields: ['equipment_id', 'qualification_type']
          },
          {
            title: 'Scheduling',
            fields: ['scheduled_date', 'priority']
          }
        ]
      }
    }
  },
  {
    id: 'document-review',
    name: 'Document Review & Approval',
    category: 'document_control',
    description: 'Standard Operating Procedure and document review workflow',
    estimatedDuration: 48,
    approvalRequired: true,
    complianceRequirements: [
      {
        id: 'cfr-part-11',
        regulation: '21 CFR Part 11',
        requirement: 'Electronic signatures required for document approval',
        mandatory: true
      }
    ],
    formSchema: {
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
          id: 'document_type',
          name: 'document_type',
          type: 'select',
          label: 'Document Type',
          required: true,
          options: [
            { value: 'sop', label: 'Standard Operating Procedure (SOP)' },
            { value: 'protocol', label: 'Protocol' },
            { value: 'report', label: 'Report' },
            { value: 'specification', label: 'Specification' },
            { value: 'manual', label: 'Manual' }
          ]
        },
        {
          id: 'document_number',
          name: 'document_number',
          type: 'text',
          label: 'Document Number',
          required: true,
          placeholder: 'Enter document number'
        },
        {
          id: 'version',
          name: 'version',
          type: 'text',
          label: 'Version',
          required: true,
          placeholder: 'e.g., 1.0, 2.1'
        },
        {
          id: 'review_type',
          name: 'review_type',
          type: 'select',
          label: 'Review Type',
          required: true,
          options: [
            { value: 'new', label: 'New Document' },
            { value: 'revision', label: 'Revision' },
            { value: 'periodic', label: 'Periodic Review' },
            { value: 'retirement', label: 'Retirement' }
          ]
        },
        {
          id: 'priority',
          name: 'priority',
          type: 'select',
          label: 'Priority',
          required: true,
          options: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'urgent', label: 'Urgent' }
          ]
        },
        {
          id: 'description',
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: false,
          placeholder: 'Provide details about the document and review requirements'
        }
      ],
      validation: [],
      layout: {
        columns: 2,
        sections: [
          {
            title: 'Basic Information',
            fields: ['title', 'description']
          },
          {
            title: 'Document Details',
            fields: ['document_type', 'document_number', 'version']
          },
          {
            title: 'Review Information',
            fields: ['review_type', 'priority']
          }
        ]
      }
    }
  }
];

const mockRequests: WorkflowRequest[] = [
  {
    id: 'REQ-2025-001',
    title: 'QC Batch Release - Aspirin 325mg',
    description: 'Quality control testing and batch release for Aspirin 325mg tablets',
    type: mockWorkflowTypes[0],
    status: 'in_review',
    priority: 'high',
    submittedBy: 'current-user',
    submittedAt: new Date('2025-01-15T09:30:00'),
    assignedTo: 'qc-manager',
    dueDate: new Date('2025-01-17T17:00:00'),
    attachments: [],
    formData: {
      title: 'QC Batch Release - Aspirin 325mg',
      batch_number: 'ASP-2025-001',
      product_code: 'ASP325',
      test_type: 'potency',
      priority: 'high',
      description: 'Urgent batch release required for customer shipment'
    },
    auditTrail: [
      {
        id: 'audit-001',
        timestamp: new Date('2025-01-15T09:30:00'),
        userId: 'current-user',
        action: 'create',
        objectType: 'request',
        objectId: 'REQ-2025-001',
        newValue: { status: 'submitted' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...'
      }
    ]
  },
  {
    id: 'REQ-2025-002',
    title: 'Equipment Qualification - HPLC System',
    description: 'Performance qualification for new HPLC system',
    type: mockWorkflowTypes[1],
    status: 'submitted',
    priority: 'medium',
    submittedBy: 'current-user',
    submittedAt: new Date('2025-01-14T14:15:00'),
    dueDate: new Date('2025-01-20T17:00:00'),
    attachments: [],
    formData: {
      title: 'Equipment Qualification - HPLC System',
      equipment_id: 'HPLC-001',
      qualification_type: 'pq',
      scheduled_date: '2025-01-18',
      priority: 'medium',
      description: 'Performance qualification for newly installed HPLC system'
    },
    auditTrail: []
  },
  {
    id: 'REQ-2025-003',
    title: 'SOP Review - Cleaning Validation',
    description: 'Annual review of cleaning validation SOP',
    type: mockWorkflowTypes[2],
    status: 'completed',
    priority: 'low',
    submittedBy: 'current-user',
    submittedAt: new Date('2025-01-10T11:00:00'),
    completedAt: new Date('2025-01-13T16:30:00'),
    attachments: [],
    formData: {
      title: 'SOP Review - Cleaning Validation',
      document_type: 'sop',
      document_number: 'SOP-QA-015',
      version: '3.0',
      review_type: 'periodic',
      priority: 'low',
      description: 'Annual periodic review of cleaning validation procedures'
    },
    auditTrail: []
  }
];

export const RequestPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('track');
  const [requests, setRequests] = useState<WorkflowRequest[]>(mockRequests);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  const handleSubmitRequest = (request: Partial<WorkflowRequest>) => {
    const newRequest: WorkflowRequest = {
      id: `REQ-2025-${String(requests.length + 1).padStart(3, '0')}`,
      title: request.title || 'Untitled Request',
      description: request.description || '',
      type: request.type!,
      status: 'submitted',
      priority: request.priority || 'medium',
      submittedBy: 'current-user',
      submittedAt: new Date(),
      attachments: request.attachments || [],
      formData: request.formData || {},
      auditTrail: [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date(),
          userId: 'current-user',
          action: 'create',
          objectType: 'request',
          objectId: `REQ-2025-${String(requests.length + 1).padStart(3, '0')}`,
          newValue: { status: 'submitted' },
          ipAddress: '192.168.1.100',
          userAgent: navigator.userAgent
        }
      ]
    };

    setRequests(prev => [newRequest, ...prev]);
    setActiveTab('track');
    
    // Show success notification (in real app, use toast/notification system)
    alert(`Request ${newRequest.id} submitted successfully!`);
  };

  const handleSaveRequest = (request: Partial<WorkflowRequest>) => {
    // In real app, this would save to backend
    console.log('Saving draft request:', request);
  };

  const handleRequestClick = (request: WorkflowRequest) => {
    // In real app, this would navigate to request details page
    console.log('Opening request details:', request.id);
    alert(`Opening details for request ${request.id}`);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    // In real app, this would generate and download the report
    console.log(`Exporting requests as ${format}`);
    alert(`Exporting requests as ${format.toUpperCase()}...`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Request Portal</h1>
            <p className="text-gray-600 mt-1">
              Submit new workflow requests and track existing ones
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('track')}
              className={`
                flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${activeTab === 'track'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <List className="w-4 h-4 mr-2" />
              Track Requests
            </button>
            <button
              onClick={() => setActiveTab('submit')}
              className={`
                flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${activeTab === 'submit'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Plus className="w-4 h-4 mr-2" />
              Submit Request
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'track' && (
          <RequestTrackingDashboard
            requests={requests}
            onRequestClick={handleRequestClick}
            onExport={handleExport}
            realTimeUpdates={realTimeUpdates}
            onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
            notificationsEnabled={notificationsEnabled}
          />
        )}

        {activeTab === 'submit' && (
          <RequestSubmissionForm
            workflowTypes={mockWorkflowTypes}
            onSubmit={handleSubmitRequest}
            onSave={handleSaveRequest}
          />
        )}
      </div>
    </Layout>
  );
};