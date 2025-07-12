import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  Calendar,
  ChevronRight,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { WorkflowRequest, RequestStatus } from '../../types';

const statusConfig = {
  draft: { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Draft' },
  submitted: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Submitted' },
  in_review: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'In Review' },
  approved: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100', label: 'Approved' },
  rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', label: 'Rejected' },
  completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Completed' },
  cancelled: { icon: XCircle, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Cancelled' }
};

const priorityConfig = {
  low: { color: 'text-gray-500', bg: 'bg-gray-100', label: 'Low' },
  medium: { color: 'text-blue-500', bg: 'bg-blue-100', label: 'Medium' },
  high: { color: 'text-orange-500', bg: 'bg-orange-100', label: 'High' },
  urgent: { color: 'text-red-500', bg: 'bg-red-100', label: 'Urgent' }
};

interface MobileRequestViewProps {
  requests: WorkflowRequest[];
  onRequestClick: (request: WorkflowRequest) => void;
  notificationsEnabled?: boolean;
  onToggleNotifications?: () => void;
}

export const MobileRequestView: React.FC<MobileRequestViewProps> = ({
  requests,
  onRequestClick,
  notificationsEnabled = true,
  onToggleNotifications
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    return {
      total: requests.length,
      pending: requests.filter(r => ['submitted', 'in_review'].includes(r.status)).length,
      completed: requests.filter(r => r.status === 'completed').length,
      overdue: requests.filter(r => r.dueDate && new Date(r.dueDate) < new Date() && !['completed', 'cancelled'].includes(r.status)).length
    };
  };

  const stats = getStatusStats();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const isOverdue = (request: WorkflowRequest) => {
    return request.dueDate && 
           new Date(request.dueDate) < new Date() && 
           !['completed', 'cancelled'].includes(request.status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-gray-900">My Requests</h1>
            <div className="flex items-center space-x-2">
              {onToggleNotifications && (
                <button
                  onClick={onToggleNotifications}
                  className={`p-2 rounded-full ${
                    notificationsEnabled 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-full bg-gray-100 text-gray-600"
              >
                {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-semibold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded">
              <div className="text-lg font-semibold text-yellow-600">{stats.pending}</div>
              <div className="text-xs text-yellow-600">Pending</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="text-lg font-semibold text-green-600">{stats.completed}</div>
              <div className="text-xs text-green-600">Done</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="text-lg font-semibold text-red-600">{stats.overdue}</div>
              <div className="text-xs text-red-600">Overdue</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 text-xs rounded-full ${
                    statusFilter === 'all' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                >
                  All
                </button>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status as RequestStatus)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      statusFilter === status 
                        ? `${config.bg} ${config.color}` 
                        : 'bg-white text-gray-600 border border-gray-300'
                    }`}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Request List */}
      <div className="px-4 py-2 space-y-3">
        {filteredRequests.map((request) => {
          const StatusIcon = statusConfig[request.status].icon;
          const isRequestOverdue = isOverdue(request);
          
          return (
            <div
              key={request.id}
              onClick={() => onRequestClick(request)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 active:bg-gray-50"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {request.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    ID: {request.id}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
              </div>

              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center">
                  <StatusIcon className={`w-3 h-3 mr-1 ${statusConfig[request.status].color}`} />
                  <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[request.status].bg} ${statusConfig[request.status].color}`}>
                    {statusConfig[request.status].label}
                  </span>
                </div>
                
                <span className={`text-xs px-2 py-1 rounded-full ${priorityConfig[request.priority].bg} ${priorityConfig[request.priority].color}`}>
                  {priorityConfig[request.priority].label}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>Submitted {formatDate(request.submittedAt)}</span>
                </div>
                
                {request.dueDate && (
                  <div className={`flex items-center ${isRequestOverdue ? 'text-red-600' : ''}`}>
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Due {formatDate(request.dueDate)}</span>
                    {isRequestOverdue && (
                      <AlertTriangle className="w-3 h-3 ml-1" />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'You haven\'t submitted any requests yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};