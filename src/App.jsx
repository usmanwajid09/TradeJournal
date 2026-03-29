import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import TradeLogger from './pages/TradeLogger';
import ChartGallery from './pages/ChartGallery';
import Analytics from './pages/Analytics';
import Login from './pages/Login'; // Assume we'll update or keep it
// import 'bootstrap/dist/css/bootstrap.min.css'; // REMOVED Bootstrap

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes wrapped in MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journal" element={<TradeLogger />} />
          <Route path="/gallery" element={<ChartGallery />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<div>Profile Placeholder</div>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
