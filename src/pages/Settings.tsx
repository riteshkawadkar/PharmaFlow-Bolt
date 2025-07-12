import React from 'react';
import { Layout } from '../components/Layout/Layout';
import { Settings as SettingsIcon, User, Bell, Lock } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            System configuration and user preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <User className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>
            </div>
            <p className="text-gray-500 text-sm">
              Manage your personal information and preferences
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <Bell className="w-6 h-6 text-yellow-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            </div>
            <p className="text-gray-500 text-sm">
              Configure email and push notification preferences
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Security</h3>
            </div>
            <p className="text-gray-500 text-sm">
              Password, two-factor authentication, and security settings
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <SettingsIcon className="w-6 h-6 text-gray-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">System</h3>
            </div>
            <p className="text-gray-500 text-sm">
              System-wide configuration and administrative settings
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};