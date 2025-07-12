import React from 'react';
import { Layout } from '../components/Layout/Layout';
import { BarChart3, TrendingUp, Clock, Users } from 'lucide-react';

export const Analytics: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Workflow performance metrics and insights
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
          <p className="text-gray-500">
            Comprehensive analytics and reporting features coming soon.
          </p>
        </div>
      </div>
    </Layout>
  );
};