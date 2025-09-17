// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import MonitoringPage from './pages/MonitoringPage';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      {/* Main dashboard route */}
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path='/monitoring' element={<MonitoringPage />} />
    </Routes>
  );
}

export default App;