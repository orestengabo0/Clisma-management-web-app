// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import MonitoringPage from './pages/MonitoringPage';
import Login from './pages/Login';
import AnalyticsPage from './pages/AnalyticsPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import AccountCenterPage from './pages/AccountCenterPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Main dashboard route */}
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path='/monitoring' element={<ProtectedRoute><MonitoringPage /></ProtectedRoute>} />
      <Route path='/analytics' element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
      <Route path='/reports' element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path='/account' element={<ProtectedRoute><AccountCenterPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;