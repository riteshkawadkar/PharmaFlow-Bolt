import React from 'react';
import { Layout } from '../components/Layout/Layout';
import { Database, Settings, Users, Smartphone, Search, Filter, Plus, RefreshCw } from 'lucide-react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Equipment } from '../components/MasterData/Equipment';
import { Applications } from '../components/MasterData/Applications';
import { MasterUsers } from '../components/MasterData/MasterUsers';

export const MasterData: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Data</h1>
          <p className="text-gray-600 mt-1">
            Manage equipment, applications, and user data
          </p>
        </div>

        <Routes>
          <Route path="/" element={<MasterDataHome navigate={navigate} />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/users" element={<MasterUsers />} />
        </Routes>
      </div>
    </Layout>
  );
};

interface MasterDataHomeProps {
  navigate: (path: string) => void;
}

const MasterDataHome: React.FC<MasterDataHomeProps> = ({ navigate }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate('/master-data/equipment')}
        >
          <Settings className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Equipment</h3>
          <p className="text-gray-500 text-sm">
            Manage laboratory and manufacturing equipment
          </p>
          <button className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
            View Equipment
          </button>
        </div>

        <div 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate('/master-data/applications')}
        >
          <Smartphone className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Applications</h3>
          <p className="text-gray-500 text-sm">
            Configure integrated applications and systems
          </p>
          <button className="mt-4 px-4 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors">
            View Applications
          </button>
        </div>

        <div 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate('/master-data/users')}
        >
          <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Users</h3>
          <p className="text-gray-500 text-sm">
            Manage user accounts and permissions
          </p>
          <button className="mt-4 px-4 py-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors">
            View Users
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Updates</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-md">
            <RefreshCw className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Equipment Calibration Updated</p>
              <p className="text-xs text-blue-600">HPLC System 1 (EQ-HPLC-001) calibration due date updated to March 15, 2025</p>
              <p className="text-xs text-blue-500 mt-1">Updated 2 hours ago by Sarah Johnson</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-md">
            <Plus className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">New Product Code Added</p>
              <p className="text-xs text-green-600">Amlodipine 5mg Tablets (AMLO5) added to product database</p>
              <p className="text-xs text-green-500 mt-1">Added 1 day ago by David Smith</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-md">
            <Users className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-purple-800">User Role Updated</p>
              <p className="text-xs text-purple-600">Michael Chen promoted to QC Analyst role with additional permissions</p>
              <p className="text-xs text-purple-500 mt-1">Updated 3 days ago by Admin User</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};