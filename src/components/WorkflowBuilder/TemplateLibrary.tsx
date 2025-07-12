import React, { useState } from 'react';
import { WorkflowTemplate } from '../../types/workflow';
import { workflowTemplates } from '../../data/workflowTemplates';
import { 
  FileText, 
  GitBranch, 
  Shuffle, 
  RotateCcw, 
  Play, 
  Eye, 
  Download,
  Search,
  Filter,
  Clock,
  Users,
  Shield
} from 'lucide-react';

const templateIcons = {
  'template-simple-linear': FileText,
  'template-parallel': GitBranch,
  'template-conditional': Shuffle,
  'template-loop': RotateCcw
};

const categoryColors = {
  quality_control: 'bg-blue-100 text-blue-800',
  document_control: 'bg-green-100 text-green-800',
  risk_assessment: 'bg-orange-100 text-orange-800',
  equipment_management: 'bg-purple-100 text-purple-800'
};

const complianceColors = {
  basic: 'bg-gray-100 text-gray-800',
  gmp: 'bg-yellow-100 text-yellow-800',
  cfr_part_11: 'bg-red-100 text-red-800',
  gamp_5: 'bg-purple-100 text-purple-800',
  iso_13485: 'bg-blue-100 text-blue-800'
};

interface TemplateLibraryProps {
  onTemplateSelect: (template: WorkflowTemplate) => void;
  onTemplatePreview: (template: WorkflowTemplate) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  onTemplateSelect,
  onTemplatePreview,
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCompliance, setSelectedCompliance] = useState<string>('all');

  const filteredTemplates = workflowTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesCompliance = selectedCompliance === 'all' || template.complianceLevel === selectedCompliance;
    
    return matchesSearch && matchesCategory && matchesCompliance;
  });

  const categories = Array.from(new Set(workflowTemplates.map(t => t.category)));
  const complianceLevels = Array.from(new Set(workflowTemplates.map(t => t.complianceLevel)));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Workflow Templates</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>

            {/* Compliance Filter */}
            <select
              value={selectedCompliance}
              onChange={(e) => setSelectedCompliance(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Compliance</option>
              {complianceLevels.map(level => (
                <option key={level} value={level}>
                  {level.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => {
              const IconComponent = templateIcons[template.id as keyof typeof templateIcons] || FileText;
              
              return (
                <div
                  key={template.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Template Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Template Details */}
                  <div className="p-4 space-y-3">
                    {/* Category and Compliance */}
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${categoryColors[template.category] || 'bg-gray-100 text-gray-800'}`}>
                        {template.category.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${complianceColors[template.complianceLevel] || 'bg-gray-100 text-gray-800'}`}>
                        {template.complianceLevel.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>{template.nodes.length} nodes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{template.connections.length} connections</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        v{template.version}
                      </div>
                    </div>

                    {/* Workflow Type Indicators */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {template.id.includes('parallel') && (
                        <div className="flex items-center space-x-1">
                          <GitBranch className="w-3 h-3" />
                          <span>Parallel</span>
                        </div>
                      )}
                      {template.id.includes('conditional') && (
                        <div className="flex items-center space-x-1">
                          <Shuffle className="w-3 h-3" />
                          <span>Conditional</span>
                        </div>
                      )}
                      {template.id.includes('loop') && (
                        <div className="flex items-center space-x-1">
                          <RotateCcw className="w-3 h-3" />
                          <span>Loop</span>
                        </div>
                      )}
                      {template.complianceLevel !== 'basic' && (
                        <div className="flex items-center space-x-1">
                          <Shield className="w-3 h-3" />
                          <span>Compliance</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 border-t border-gray-100 flex space-x-2">
                    <button
                      onClick={() => onTemplatePreview(template)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => {
                        onTemplateSelect(template);
                        onClose();
                      }}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4" />
                      <span>Use Template</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500">
                Try adjusting your search or filters to find the templates you're looking for.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing {filteredTemplates.length} of {workflowTemplates.length} templates
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Simple</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Parallel</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Conditional</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Loop</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};