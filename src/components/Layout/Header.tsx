import React from 'react';
import { Bell, User, Settings, LogOut, Menu } from 'lucide-react';

interface HeaderProps {
  user?: {
    firstName: string;
    lastName: string;
    role: string;
  };
  onMenuToggle?: () => void;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, 
  onMenuToggle, 
  notificationCount = 0 
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PF</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PharmaFlow</h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Workflow Automation Platform
              </p>
            </div>
          </div>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <Settings className="w-5 h-5" />
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {user ? `${user.firstName} ${user.lastName}` : 'User Name'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role || 'Role'}
              </p>
            </div>
            
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              </button>
            </div>

            {/* Logout */}
            <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};