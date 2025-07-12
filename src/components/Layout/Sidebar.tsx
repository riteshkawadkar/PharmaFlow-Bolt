import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  GitBranch, 
  BarChart3, 
  Settings, 
  Users, 
  Database,
  Shield,
  Smartphone
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  currentPath?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/dashboard'
  },
  {
    id: 'requests',
    label: 'My Requests',
    icon: FileText,
    path: '/requests',
    badge: '3'
  },
  {
    id: 'workflows',
    label: 'Workflow Builder',
    icon: GitBranch,
    path: '/workflows'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics'
  },
  {
    id: 'master-data',
    label: 'Master Data',
    icon: Database,
    path: '/master-data',
    children: [
      { id: 'equipment', label: 'Equipment', icon: Settings, path: '/master-data/equipment' },
      { id: 'applications', label: 'Applications', icon: Smartphone, path: '/master-data/applications' },
      { id: 'users', label: 'Users', icon: Users, path: '/master-data/users' }
    ]
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: Shield,
    path: '/compliance'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings'
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentPath = '/dashboard' }) => {
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['master-data']);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Update currentPath from router
  const actualCurrentPath = location.pathname;

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isActive = actualCurrentPath === item.path || actualCurrentPath.startsWith(item.path + '/');
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <button
          onClick={() => hasChildren ? toggleExpanded(item.id) : navigate(item.path)}
          className={`
            w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors
            ${level > 0 ? 'ml-4' : ''}
            ${isActive 
              ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }
          `}
        >
          <div className="flex items-center space-x-3">
            <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
            <span>{item.label}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {item.badge && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
        </button>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
      lg:translate-x-0 lg:static lg:inset-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map(item => renderNavItem(item))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>Version 1.0.0</p>
            <p>© 2025 PharmaFlow</p>
          </div>
        </div>
      </div>
    </aside>
  );
};