import React from 'react';
import { WorkflowNode, Connection, ValidationResult, ValidationError, ValidationWarning } from '../../types/workflow';
import { AlertTriangle, CheckCircle, AlertCircle, Shield } from 'lucide-react';

interface ValidationEngineProps {
  nodes: WorkflowNode[];
  connections: Connection[];
  onValidationUpdate: (nodeId: string, validation: ValidationResult) => void;
}

export const ValidationEngine: React.FC<ValidationEngineProps> = ({
  nodes,
  connections,
  onValidationUpdate
}) => {
  const [validationResults, setValidationResults] = React.useState<Record<string, ValidationResult>>({});

  // Real-time validation
  React.useEffect(() => {
    const validateWorkflow = () => {
      const results: Record<string, ValidationResult> = {};

      nodes.forEach(node => {
        const validation = validateNode(node, nodes, connections);
        results[node.id] = validation;
        onValidationUpdate(node.id, validation);
      });

      setValidationResults(results);
    };

    validateWorkflow();
  }, [nodes, connections, onValidationUpdate]);

  const validateNode = (node: WorkflowNode, allNodes: WorkflowNode[], allConnections: Connection[]): ValidationResult => {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Basic node validation
    if (!node.data.label || node.data.label.trim() === '') {
      errors.push({
        id: `${node.id}-no-label`,
        message: 'Node must have a label',
        severity: 'error'
      });
    }

    // Connection validation
    const incomingConnections = allConnections.filter(conn => conn.targetNodeId === node.id);
    const outgoingConnections = allConnections.filter(conn => conn.sourceNodeId === node.id);

    // Start nodes should have no incoming connections
    if (node.type === 'start' && incomingConnections.length > 0) {
      errors.push({
        id: `${node.id}-start-incoming`,
        message: 'Start nodes cannot have incoming connections',
        severity: 'error'
      });
    }

    // End nodes should have no outgoing connections
    if (node.type === 'end' && outgoingConnections.length > 0) {
      errors.push({
        id: `${node.id}-end-outgoing`,
        message: 'End nodes cannot have outgoing connections',
        severity: 'error'
      });
    }

    // Most nodes should have at least one connection
    if (node.type !== 'start' && incomingConnections.length === 0) {
      warnings.push({
        id: `${node.id}-no-incoming`,
        message: 'Node has no incoming connections',
        suggestion: 'Connect this node to the workflow flow'
      });
    }

    if (node.type !== 'end' && outgoingConnections.length === 0) {
      warnings.push({
        id: `${node.id}-no-outgoing`,
        message: 'Node has no outgoing connections',
        suggestion: 'Connect this node to continue the workflow'
      });
    }

    // Node-specific validation
    switch (node.type) {
      case 'form':
        validateFormNode(node, errors, warnings);
        break;
      case 'approval':
        validateApprovalNode(node, errors, warnings);
        break;
      case 'decision':
        validateDecisionNode(node, errors, warnings);
        break;
      case 'api_connector':
        validateApiConnectorNode(node, errors, warnings);
        break;
      case 'electronic_signature':
        validateElectronicSignatureNode(node, errors, warnings);
        break;
    }

    // Compliance validation
    if (node.data.complianceRequirements && node.data.complianceRequirements.length > 0) {
      node.data.complianceRequirements.forEach(req => {
        if (req.mandatory) {
          // Check if compliance requirement is properly configured
          if (!isComplianceRequirementMet(node, req)) {
            errors.push({
              id: `${node.id}-compliance-${req.id}`,
              message: `Compliance requirement not met: ${req.regulation}`,
              severity: 'error'
            });
          }
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const validateFormNode = (node: WorkflowNode, errors: ValidationError[], warnings: ValidationWarning[]) => {
    const fields = node.data.properties?.fields || [];
    
    if (fields.length === 0) {
      warnings.push({
        id: `${node.id}-no-fields`,
        message: 'Form has no fields defined',
        suggestion: 'Add form fields to collect data'
      });
    }

    // Check for duplicate field names
    const fieldNames = fields.map((field: any) => field.name).filter(Boolean);
    const duplicates = fieldNames.filter((name: string, index: number) => fieldNames.indexOf(name) !== index);
    
    if (duplicates.length > 0) {
      errors.push({
        id: `${node.id}-duplicate-fields`,
        message: `Duplicate field names: ${duplicates.join(', ')}`,
        severity: 'error'
      });
    }

    // Validate pharmaceutical fields
    fields.forEach((field: any, index: number) => {
      if (field.type === 'pharmaceutical' && !field.pharmaceuticalType) {
        errors.push({
          id: `${node.id}-pharma-field-${index}`,
          message: `Pharmaceutical field "${field.label}" must specify a pharmaceutical type`,
          severity: 'error'
        });
      }
    });
  };

  const validateApprovalNode = (node: WorkflowNode, errors: ValidationError[], warnings: ValidationWarning[]) => {
    const approvers = node.data.properties?.approvers || [];
    const approvalType = node.data.properties?.approvalType;

    if (approvers.length === 0) {
      errors.push({
        id: `${node.id}-no-approvers`,
        message: 'Approval node must have at least one approver',
        severity: 'error'
      });
    }

    if (approvalType === 'multiple' && approvers.length < 2) {
      warnings.push({
        id: `${node.id}-multiple-approvers`,
        message: 'Multiple approval type should have more than one approver',
        suggestion: 'Add additional approvers or change to single approval'
      });
    }

    const deadline = node.data.properties?.deadline;
    if (!deadline || deadline <= 0) {
      warnings.push({
        id: `${node.id}-no-deadline`,
        message: 'Approval node should have a deadline',
        suggestion: 'Set a reasonable deadline for approvals'
      });
    }
  };

  const validateDecisionNode = (node: WorkflowNode, errors: ValidationError[], warnings: ValidationWarning[]) => {
    const conditions = node.data.properties?.conditions || [];

    if (conditions.length === 0) {
      errors.push({
        id: `${node.id}-no-conditions`,
        message: 'Decision node must have at least one condition',
        severity: 'error'
      });
    }

    conditions.forEach((condition: any, index: number) => {
      if (!condition.field || !condition.operator || condition.value === undefined) {
        errors.push({
          id: `${node.id}-invalid-condition-${index}`,
          message: `Condition ${index + 1} is incomplete`,
          severity: 'error'
        });
      }
    });
  };

  const validateApiConnectorNode = (node: WorkflowNode, errors: ValidationError[], warnings: ValidationWarning[]) => {
    const url = node.data.properties?.url;
    const method = node.data.properties?.method;

    if (!url || !url.trim()) {
      errors.push({
        id: `${node.id}-no-url`,
        message: 'API Connector must have a URL',
        severity: 'error'
      });
    } else if (!isValidUrl(url)) {
      errors.push({
        id: `${node.id}-invalid-url`,
        message: 'API Connector URL is not valid',
        severity: 'error'
      });
    }

    if (!method) {
      errors.push({
        id: `${node.id}-no-method`,
        message: 'API Connector must specify HTTP method',
        severity: 'error'
      });
    }

    const timeout = node.data.properties?.timeout;
    if (timeout && timeout > 300) {
      warnings.push({
        id: `${node.id}-long-timeout`,
        message: 'API timeout is very long (>5 minutes)',
        suggestion: 'Consider reducing timeout for better user experience'
      });
    }
  };

  const validateElectronicSignatureNode = (node: WorkflowNode, errors: ValidationError[], warnings: ValidationWarning[]) => {
    const signers = node.data.properties?.signers || [];
    const reason = node.data.properties?.reason;

    if (signers.length === 0) {
      errors.push({
        id: `${node.id}-no-signers`,
        message: 'Electronic Signature node must have at least one signer',
        severity: 'error'
      });
    }

    if (!reason || !reason.trim()) {
      warnings.push({
        id: `${node.id}-no-reason`,
        message: 'Electronic Signature should specify a reason',
        suggestion: 'Add a reason for the signature requirement'
      });
    }
  };

  const isComplianceRequirementMet = (node: WorkflowNode, requirement: any): boolean => {
    // Basic compliance check - in real implementation, this would be more sophisticated
    switch (requirement.regulation) {
      case '21 CFR Part 11':
        // Check for electronic signature or audit trail
        return node.type === 'electronic_signature' || 
               node.type === 'audit_logger' ||
               node.data.properties?.electronicSignature === true;
      
      case 'EU GMP Annex 11':
        // Check for validation and documentation
        return node.data.properties?.validation === true ||
               node.data.properties?.documentation === true;
      
      default:
        return true; // Assume met if we don't have specific rules
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getOverallValidationStatus = () => {
    const allResults = Object.values(validationResults);
    const totalErrors = allResults.reduce((sum, result) => sum + result.errors.length, 0);
    const totalWarnings = allResults.reduce((sum, result) => sum + result.warnings.length, 0);
    const validNodes = allResults.filter(result => result.isValid).length;

    return {
      totalNodes: nodes.length,
      validNodes,
      totalErrors,
      totalWarnings,
      isWorkflowValid: totalErrors === 0
    };
  };

  const status = getOverallValidationStatus();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Workflow Validation</h3>
        <div className="flex items-center space-x-2">
          {status.isWorkflowValid ? (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs">Valid</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs">Issues Found</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 text-xs">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{status.totalNodes}</div>
          <div className="text-gray-500">Total Nodes</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">{status.validNodes}</div>
          <div className="text-gray-500">Valid Nodes</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-red-600">{status.totalErrors}</div>
          <div className="text-gray-500">Errors</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-yellow-600">{status.totalWarnings}</div>
          <div className="text-gray-500">Warnings</div>
        </div>
      </div>

      {(status.totalErrors > 0 || status.totalWarnings > 0) && (
        <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
          {Object.entries(validationResults).map(([nodeId, result]) => {
            const node = nodes.find(n => n.id === nodeId);
            if (!node || (result.errors.length === 0 && result.warnings.length === 0)) return null;

            return (
              <div key={nodeId} className="text-xs">
                <div className="font-medium text-gray-700">{node.data.label}</div>
                {result.errors.map(error => (
                  <div key={error.id} className="flex items-center space-x-1 text-red-600 ml-2">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{error.message}</span>
                  </div>
                ))}
                {result.warnings.map(warning => (
                  <div key={warning.id} className="flex items-center space-x-1 text-yellow-600 ml-2">
                    <AlertCircle className="w-3 h-3" />
                    <span>{warning.message}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};