import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} />

      {sidebarOpen && (
        <div
          className="drawer-backdrop"
          style={{ background: 'rgba(25,46,50,.28)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="main-content">
        <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} />
        <div className="page-wrap">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
