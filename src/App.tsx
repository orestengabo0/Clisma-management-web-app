// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import MonitoringPage from './pages/MonitoringPage';
import Login from './pages/Login';
import AnalyticsPage from './pages/AnalyticsPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import AccountCenterPage from './pages/AccountCenterPage';

function App() {
  return (
    <Routes>
      {/* Main dashboard route */}
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path='/monitoring' element={<MonitoringPage />} />
      <Route path='/analytics' element={<AnalyticsPage />} />
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path='/reports' element={<ReportsPage />} />
      <Route path='/account' element={<AccountCenterPage />} />
    </Routes>
  );
}

export default App;