import React, { useState, useEffect } from 'react';
import { Settings, Search, Filter, Plus, Edit, Trash2, AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { MasterDataService, Equipment as EquipmentType } from '../../services/masterDataService';

export const Equipment: React.FC = () => {
  const [equipment, setEquipment] = useState<EquipmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true);
      try {
        const masterDataService = MasterDataService.getInstance();
        const filters: any = {};
        
        if (typeFilter !== 'all') filters.type = typeFilter;
        if (statusFilter !== 'all') filters.status = statusFilter;
        
        const data = await masterDataService.getEquipment(filters);
        setEquipment(data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [typeFilter, statusFilter]);

  const filteredEquipment = equipment.filter(eq => 
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEquipmentClick = (eq: EquipmentType) => {
    setSelectedEquipment(eq);
    setShowDetails(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Settings className="w-3 h-3 mr-1" />
            Maintenance
          </span>
        );
      case 'retired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Trash2 className="w-3 h-3 mr-1" />
            Retired
          </span>
        );
      case 'validation':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Validation
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getQualificationBadge = (status: string) => {
    switch (status) {
      case 'qualified':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Qualified
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Expired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="analytical">Analytical</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="packaging">Packaging</option>
                <option value="utility">Utility</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
                <option value="validation">Validation</option>
              </select>
            </div>
          </div>
        </div>

        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="mt-2 text-gray-600">Loading equipment data...</p>
          </div>
        </div>
      ) : filteredEquipment.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No equipment has been added yet'}
          </p>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Plus className="w-4 h-4 mr-2" />
            Add First Equipment
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qualification
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEquipment.map((eq) => (
                  <tr 
                    key={eq.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleEquipmentClick(eq)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-md">
                          <Settings className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{eq.name}</div>
                          <div className="text-sm text-gray-500">{eq.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{eq.type}</div>
                      <div className="text-xs text-gray-500">{eq.model}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{eq.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(eq.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getQualificationBadge(eq.qualificationStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {eq.calibrationDue ? formatDate(eq.calibrationDue) : formatDate(eq.nextQualification)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {eq.calibrationDue ? 'Calibration' : 'Qualification'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEquipmentClick(eq);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Equipment Details Modal */}
      {showDetails && selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Equipment Details</h3>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowDetails(false)}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Basic Information</h4>
                  <div className="bg-gray-50 p-4 rounded-md space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500">Equipment ID</label>
                      <div className="text-sm font-medium">{selectedEquipment.id}</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Name</label>
                      <div className="text-sm font-medium">{selectedEquipment.name}</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Type</label>
                      <div className="text-sm font-medium capitalize">{selectedEquipment.type}</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Status</label>
                      <div>{getStatusBadge(selectedEquipment.status)}</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Location</label>
                      <div className="text-sm font-medium">{selectedEquipment.location}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Manufacturer Details</h4>
                  <div className="bg-gray-50 p-4 rounded-md space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500">Manufacturer</label>
                      <div className="text-sm font-medium">{selectedEquipment.manufacturer}</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Model</label>
                      <div className="text-sm font-medium">{selectedEquipment.model}</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Serial Number</label>
                      <div className="text-sm font-medium">{selectedEquipment.serialNumber}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Qualification Status</h4>
                  <div className="bg-gray-50 p-4 rounded-md space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500">Qualification Status</label>
                      <div>{getQualificationBadge(selectedEquipment.qualificationStatus)}</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Last Qualified</label>
                      <div className="text-sm font-medium">{formatDate(selectedEquipment.lastQualified)}</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Next Qualification</label>
                      <div className="text-sm font-medium">{formatDate(selectedEquipment.nextQualification)}</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Calibration Due</label>
                      <div className="text-sm font-medium">{formatDate(selectedEquipment.calibrationDue)}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Specifications</h4>
                  <div className="bg-gray-50 p-4 rounded-md space-y-3">
                    {Object.entries(selectedEquipment.specifications).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                        <div className="text-sm font-medium">{value as string}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Documentation</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedEquipment.documents.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 border border-gray-200 rounded bg-white">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm text-gray-700">{doc}</span>
                        <button className="ml-auto text-blue-600 hover:text-blue-800 text-xs">View</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowDetails(false)}
              >
                Close
              </button>
              <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Edit Equipment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};