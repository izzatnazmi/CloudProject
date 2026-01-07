
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, LogOut } from 'lucide-react';
import { auth } from '../firebase';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem('courtsync_demo_user');
    try {
      await auth.signOut();
    } catch (e) {
      // Ignore errors if Firebase isn't configured
    }
    window.location.reload();
  };

  const navItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Event Requests', path: '/events', icon: Calendar },
    { name: 'User Management', path: '/users', icon: Users },
  ];

  return (
    <div className="w-64 bg-[#B21F24] min-h-screen flex flex-col text-white">
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">CourtSync Admin</h1>
        <p className="text-xs text-red-200 mt-1 uppercase tracking-wider font-medium opacity-80">UPM Badminton System</p>
      </div>

      <nav className="flex-1 mt-10 px-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/10 text-white font-medium shadow-sm' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
