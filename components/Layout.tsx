
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Overview';
      case '/events': return 'Event Requests';
      case '/users': return 'User Management';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header/Title Bar - Match the dark grey bar at the top of the design screenshots */}
        <div className="bg-[#444444] text-white/80 py-2 px-6 flex items-center justify-between shadow-sm">
          <span className="text-sm font-medium">{getPageTitle()}</span>
        </div>

        <main className="p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
