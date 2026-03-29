import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="layout-shell">
      <Sidebar />
      <div className="layout-content">
        <Topbar />
        <main className="main-viewport">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
