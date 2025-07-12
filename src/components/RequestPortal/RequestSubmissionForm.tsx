import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Save, 
  Send, 
  AlertCircle, 
  CheckCircle,
  Clock,
  User,
  Search,
  Filter,
  Star,
  Grid,
  List
} from 'lucide-react';
import { WorkflowType, FormField, WorkflowRequest } from '../../types';

interface RequestSubmissionFormProps {
  workflowTypes: WorkflowType[];
  onSubmit: (request: Partial<WorkflowRequest>) => void;
  onSave: (request: Partial<WorkflowRequest>) => void;
}

export const RequestSubmissionForm: React.FC<RequestSubmissionFormProps> = ({
  workflowTypes,
  onSubmit,
  onSave
}) => {
  const [selectedWorkflowType, setSelectedWorkflowType] = useState<WorkflowType | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [templateView, setTemplateView] = useState<'grid' | 'list'>('grid');
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>([]);

  // Auto-save functionality
  useEffect(() => {
    if (selectedWorkflowType && Object.keys(formData).length > 0) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(timer);
    }
  }, [formData, selectedWorkflowType]);

  // Filter workflow types based on search and category
  const filteredWorkflowTypes = workflowTypes.filter(type => {
    const matchesSearch = type.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
                         type.description.toLowerCase().includes(templateSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || type.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(workflowTypes.map(t => t.category)));

  const toggleFavorite = (templateId: string) => {
    setFavoriteTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };
  const handleAutoSave = async () => {
    if (!selectedWorkflowType) return;
    
    setIsAutoSaving(true);
    try {
      await onSave({
        type: selectedWorkflowType,
        formData,
        attachments: attachments.map(file => ({
          id: '',
          filename: file.name,
          size: file.size,
          mimeType: file.type,
          uploadedAt: new Date(),
          uploadedBy: 'current-user',
          virusScanned: false,
          url: ''
        })),
        status: 'draft'
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));

    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!selectedWorkflowType) return false;

    const newErrors: Record<string, string> = {};
    
    selectedWorkflowType.formSchema.fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }

      // Additional validation based on field type
      if (formData[field.id] && field.validation) {
        const value = formData[field.id];
        const validation = field.validation;

        if (validation.minLength && value.length < validation.minLength) {
          newErrors[field.id] = `${field.label} must be at least ${validation.minLength} characters`;
        }

        if (validation.maxLength && value.length > validation.maxLength) {
          newErrors[field.id] = `${field.label} must not exceed ${validation.maxLength} characters`;
        }

        if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
          newErrors[field.id] = `${field.label} format is invalid`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const request: Partial<WorkflowRequest> = {
      title: formData.title || `${selectedWorkflowType?.name} Request`,
      description: formData.description || '',
      type: selectedWorkflowType!,
      formData,
      attachments: attachments.map(file => ({
        id: '',
        filename: file.name,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date(),
        uploadedBy: 'current-user',
        virusScanned: false,
        url: ''
      })),
      status: 'submitted',
      priority: formData.priority || 'medium',
      submittedAt: new Date(),
      submittedBy: 'current-user'
    };

    onSubmit(request);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];

    const baseInputClasses = `
      w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      ${error ? 'border-red-300' : 'border-gray-300'}
    `;

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={baseInputClasses}
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={baseInputClasses}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={baseInputClasses}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              checked={value}
              onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={field.id} className="ml-2 text-sm text-gray-700">
              {field.label}
            </label>
          </div>
        );

      default:
        return (
          <input
            type="text"
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Submit New Request
            </h2>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {isAutoSaving && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </div>
            )}
            {lastSaved && !isAutoSaving && (
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Workflow Type Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Workflow Type * ({filteredWorkflowTypes.length} available)
            </label>
            
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setTemplateView('grid')}
                className={`p-2 rounded ${templateView === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTemplateView('list')}
                className={`p-2 rounded ${templateView === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search workflow templates..."
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
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
          </div>

          {/* Template Grid/List */}
          <div className={templateView === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-3'
          }>
            {filteredWorkflowTypes.map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedWorkflowType(type)}
                className={`${
                  templateView === 'grid' 
                    ? 'p-4 border-2 rounded-lg text-left transition-all hover:shadow-md'
                    : 'p-3 border rounded-lg text-left transition-all hover:shadow-sm flex items-center space-x-4'
                } ${
                  selectedWorkflowType?.id === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={templateView === 'grid' ? '' : 'flex-1'}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{type.name}</h3>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(type.id);
                      }}
                      className={`p-1 rounded ${
                        favoriteTemplates.includes(type.id)
                          ? 'text-yellow-500'
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="w-4 h-4" fill={favoriteTemplates.includes(type.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {type.category.replace('_', ' ').toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>~{type.estimatedDuration}h</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredWorkflowTypes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No workflow templates found matching your criteria.</p>
              <p className="text-sm mt-1">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>

        {/* Dynamic Form Fields */}
        {selectedWorkflowType && (
          <div className="space-y-6">
            {selectedWorkflowType.formSchema.fields.map(field => (
              <div key={field.id}>
                <label 
                  htmlFor={field.id}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {renderField(field)}
                
                {errors[field.id] && (
                  <div className="flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600">{errors[field.id]}</span>
                  </div>
                )}
              </div>
            ))}

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop files here, or click to select
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    Select Files
                  </label>
                </div>

                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleAutoSave}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </button>

              <button
                type="submit"
                className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Request
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};