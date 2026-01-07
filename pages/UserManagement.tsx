
import React from 'react';
import { Calendar, Trophy, Target } from 'lucide-react';

interface UserRow {
  name: string;
  email: string;
  role: 'UPM Member' | 'Guest';
  joinDate: string;
}

const UserManagement: React.FC = () => {
  const users: UserRow[] = [
    { name: 'Ahmad Razak', email: 'ahmad@upm.edu.my', role: 'UPM Member', joinDate: 'Jan 2024' },
    { name: 'Sarah Lee', email: 'sarah@upm.edu.my', role: 'UPM Member', joinDate: 'Jan 2024' },
    { name: 'Priya Kumar', email: 'priya@upm.edu.my', role: 'UPM Member', joinDate: 'Feb 2024' },
    { name: 'Wei Chen', email: 'wei@upm.edu.my', role: 'UPM Member', joinDate: 'Feb 2024' },
    { name: 'Fatimah Zahra', email: 'fatimah@upm.edu.my', role: 'UPM Member', joinDate: 'Mar 2024' },
    { name: 'John Smith', email: 'john@gmail.com', role: 'Guest', joinDate: 'Mar 2024' },
    { name: 'Emily Davis', email: 'emily@yahoo.com', role: 'Guest', joinDate: 'Apr 2024' },
    { name: 'Michael Brown', email: 'michael@outlook.com', role: 'Guest', joinDate: 'Apr 2024' },
    { name: 'Lisa Wong', email: 'lisa@upm.edu.my', role: 'UPM Member', joinDate: 'May 2024' },
    { name: 'David Tan', email: 'david@gmail.com', role: 'Guest', joinDate: 'May 2024' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-10 tracking-tight">User Management & Logs</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Bookings Today</p>
            <h3 className="text-4xl font-black text-gray-900">24</h3>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-[#B21F24]">
            <Calendar size={28} />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Active Events</p>
            <h3 className="text-4xl font-black text-gray-900">2</h3>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-[#B21F24]">
            <Trophy size={28} />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Most Used Court</p>
            <h3 className="text-4xl font-black text-gray-900">Court 3</h3>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-[#B21F24]">
            <Target size={28} />
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="pb-8">Name</th>
                <th className="pb-8">Email</th>
                <th className="pb-8">Role</th>
                <th className="pb-8">Join Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user, idx) => (
                <tr key={idx} className="group hover:bg-gray-50/30 transition-colors">
                  <td className="py-6">
                    <span className="text-sm font-bold text-gray-800 tracking-tight">{user.name}</span>
                  </td>
                  <td className="py-6">
                    <span className="text-sm font-semibold text-gray-500">{user.email}</span>
                  </td>
                  <td className="py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      user.role === 'UPM Member' 
                        ? 'bg-red-50 text-[#B21F24]' 
                        : 'bg-blue-50 text-blue-500'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-6">
                    <span className="text-sm font-semibold text-gray-500">{user.joinDate}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
