// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import MonitoringPage from './pages/MonitoringPage';
import Login from './pages/Login';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <Routes>
      {/* Main dashboard route */}
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path='/monitoring' element={<MonitoringPage />} />
      <Route path='/analytics' element={<AnalyticsPage />} />
    </Routes>
  );
}

export default App;