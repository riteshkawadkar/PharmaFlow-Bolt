import React from 'react';
import { Layout } from '../components/Layout/Layout';
import { Shield, FileText, AlertTriangle } from 'lucide-react';

export const Compliance: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance</h1>
          <p className="text-gray-600 mt-1">
            Regulatory compliance monitoring and reporting
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Compliance Dashboard</h3>
          <p className="text-gray-500">
            21 CFR Part 11, EU GMP, and GAMP 5 compliance monitoring features coming soon.
          </p>
        </div>
      </div>
    </Layout>
  );
};