import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar open={sidebarOpen} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 flex justify-end bg-[#192e32]/30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="min-w-0 flex-1">
        <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} />
        <div className="mx-auto max-w-[1440px] px-5 pt-7 pb-[50px] md:px-[30px] md:pt-[41px] md:pb-16 min-[1100px]:px-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
