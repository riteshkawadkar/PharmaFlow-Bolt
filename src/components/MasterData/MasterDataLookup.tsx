import React, { useState, useEffect, useCallback } from 'react';
import { Search, Database, Loader, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { MasterDataService, Equipment, Application, MasterDataUser, ProductCode } from '../../services/masterDataService';

interface MasterDataLookupProps {
  type: 'equipment' | 'application' | 'user' | 'product_code' | 'batch_number';
  value: string;
  onChange: (value: string, data?: any) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const MasterDataLookup: React.FC<MasterDataLookupProps> = ({
  type,
  value,
  onChange,
  placeholder,
  required = false,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'valid' | 'invalid' | 'pending' | null>(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [selectedData, setSelectedData] = useState<any>(null);

  const masterDataService = MasterDataService.getInstance();

  const validateAndSearch = useCallback(async (searchValue: string) => {
    if (!searchValue || searchValue.length < 2) {
      setSuggestions([]);
      setValidationStatus(null);
      setValidationMessage('');
      return;
    }

    setIsLoading(true);
    setValidationStatus('pending');

    try {
      let results: any[] = [];
      let isValid = false;
      let message = '';
      let data = null;

      switch (type) {
        case 'equipment':
          const equipment = await masterDataService.getEquipment();
          results = equipment.filter(eq => 
            eq.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            eq.id.toLowerCase().includes(searchValue.toLowerCase())
          );
          const exactEquipment = results.find(eq => eq.id === searchValue || eq.name === searchValue);
          if (exactEquipment) {
            isValid = true;
            message = `Equipment found: ${exactEquipment.name}`;
            data = exactEquipment;
          }
          break;

        case 'application':
          const applications = await masterDataService.getApplications();
          results = applications.filter(app => 
            app.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            app.id.toLowerCase().includes(searchValue.toLowerCase())
          );
          const exactApp = results.find(app => app.id === searchValue || app.name === searchValue);
          if (exactApp) {
            isValid = true;
            message = `Application found: ${exactApp.name}`;
            data = exactApp;
          }
          break;

        case 'user':
          const users = await masterDataService.getUsers();
          results = users.filter(user => 
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.employeeId.toLowerCase().includes(searchValue.toLowerCase())
          );
          const exactUser = results.find(user => 
            user.employeeId === searchValue || 
            user.email === searchValue ||
            `${user.firstName} ${user.lastName}` === searchValue
          );
          if (exactUser) {
            isValid = true;
            message = `User found: ${exactUser.firstName} ${exactUser.lastName}`;
            data = exactUser;
          }
          break;

        case 'product_code':
          const products = await masterDataService.getProductCodes(searchValue);
          results = products;
          const exactProduct = results.find(prod => prod.code === searchValue);
          if (exactProduct) {
            isValid = true;
            message = `Product found: ${exactProduct.name}`;
            data = exactProduct;
          }
          break;

        case 'batch_number':
          const validation = await masterDataService.validateBatchNumber(searchValue);
          isValid = validation.isValid;
          message = validation.message;
          data = validation.data;
          results = data ? [data] : [];
          break;
      }

      setSuggestions(results.slice(0, 10)); // Limit to 10 suggestions
      setValidationStatus(isValid ? 'valid' : 'invalid');
      setValidationMessage(message || (results.length > 0 ? 'Select from suggestions' : 'No matches found'));
      setSelectedData(data);

      if (isValid && data) {
        onChange(searchValue, data);
      }

    } catch (error) {
      console.error('Master data lookup error:', error);
      setValidationStatus('invalid');
      setValidationMessage('Error fetching data');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [type, onChange, masterDataService]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      validateAndSearch(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, validateAndSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
    
    if (!newValue) {
      setSuggestions([]);
      setValidationStatus(null);
      setValidationMessage('');
      setSelectedData(null);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    let displayValue = '';
    
    switch (type) {
      case 'equipment':
        displayValue = suggestion.id;
        break;
      case 'application':
        displayValue = suggestion.id;
        break;
      case 'user':
        displayValue = suggestion.employeeId;
        break;
      case 'product_code':
        displayValue = suggestion.code;
        break;
      case 'batch_number':
        displayValue = suggestion.batchNumber;
        break;
    }

    onChange(displayValue, suggestion);
    setShowSuggestions(false);
    setValidationStatus('valid');
    setSelectedData(suggestion);
  };

  const getValidationIcon = () => {
    switch (validationStatus) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'invalid':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Database className="w-4 h-4 text-gray-400" />;
    }
  };

  const renderSuggestion = (suggestion: any) => {
    switch (type) {
      case 'equipment':
        return (
          <div>
            <div className="font-medium">{suggestion.name}</div>
            <div className="text-xs text-gray-500">{suggestion.id} • {suggestion.location}</div>
          </div>
        );
      case 'application':
        return (
          <div>
            <div className="font-medium">{suggestion.name}</div>
            <div className="text-xs text-gray-500">{suggestion.vendor} • {suggestion.version}</div>
          </div>
        );
      case 'user':
        return (
          <div>
            <div className="font-medium">{suggestion.firstName} {suggestion.lastName}</div>
            <div className="text-xs text-gray-500">{suggestion.employeeId} • {suggestion.department}</div>
          </div>
        );
      case 'product_code':
        return (
          <div>
            <div className="font-medium">{suggestion.code}</div>
            <div className="text-xs text-gray-500">{suggestion.name}</div>
          </div>
        );
      case 'batch_number':
        return (
          <div>
            <div className="font-medium">{suggestion.batchNumber}</div>
            <div className="text-xs text-gray-500">{suggestion.productCode} • {suggestion.status}</div>
          </div>
        );
      default:
        return <div>{JSON.stringify(suggestion)}</div>;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder || `Search ${type.replace('_', ' ')}...`}
          required={required}
          className={`
            w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${validationStatus === 'valid' ? 'border-green-300' : ''}
            ${validationStatus === 'invalid' ? 'border-red-300' : ''}
            ${validationStatus === 'pending' ? 'border-blue-300' : ''}
            ${!validationStatus ? 'border-gray-300' : ''}
          `}
        />
        
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <Loader className="w-4 h-4 text-blue-500 animate-spin" />
          ) : (
            getValidationIcon()
          )}
        </div>
      </div>

      {/* Validation Message */}
      {validationMessage && (
        <div className={`mt-1 text-xs ${
          validationStatus === 'valid' ? 'text-green-600' : 
          validationStatus === 'invalid' ? 'text-red-600' : 
          'text-blue-600'
        }`}>
          {validationMessage}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
            >
              {renderSuggestion(suggestion)}
            </button>
          ))}
        </div>
      )}

      {/* Selected Data Preview */}
      {selectedData && validationStatus === 'valid' && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span className="text-green-800 font-medium">Validated</span>
          </div>
          {type === 'equipment' && (
            <div className="mt-1 text-green-700">
              {selectedData.name} • {selectedData.status} • {selectedData.location}
            </div>
          )}
          {type === 'batch_number' && (
            <div className="mt-1 text-green-700">
              Product: {selectedData.productCode} • Status: {selectedData.status}
            </div>
          )}
        </div>
      )}
    </div>
  );
};