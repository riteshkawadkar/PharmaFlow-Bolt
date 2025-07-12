import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { WorkflowBuilder } from './pages/WorkflowBuilder';
import { RequestPortal } from './pages/RequestPortal';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { MasterData } from './pages/MasterData';
import { Compliance } from './pages/Compliance';
import { Settings } from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/requests" element={<RequestPortal />} />
        <Route path="/workflows" element={<WorkflowBuilder />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/master-data/*" element={<MasterData />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;