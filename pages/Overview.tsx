
import React, { useState, useEffect } from 'react';
import { Court, Activity } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';

const Overview: React.FC = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for courts
    const unsubCourts = onSnapshot(collection(db, 'courts'), (snapshot) => {
      const courtsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Court));
      if (courtsData.length > 0) {
        setCourts(courtsData.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })));
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching courts:", error);
      setLoading(false);
    });

    // Real-time listener for activities
    const q = query(collection(db, 'activityLogs'), orderBy('timestamp', 'desc'), limit(8));
    const unsubActivities = onSnapshot(q, (snapshot) => {
      const activitiesData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        timeAgo: doc.data().timeAgo || 'Just now'
      } as Activity));
      setActivities(activitiesData);
    }, (error) => {
      console.error("Error fetching activities:", error);
    });

    return () => {
      unsubCourts();
      unsubActivities();
    };
  }, []);

  const handleToggleLock = async (courtId: string, currentStatus: string, courtName: string) => {
    const newStatus = currentStatus === 'Available' ? 'Locked' : 'Available';
    
    // Update local state for immediate feedback
    setCourts(prev => prev.map(c => c.id === courtId ? { ...c, status: newStatus as any } : c));

    try {
      // Update Firestore
      const courtRef = doc(db, 'courts', courtId);
      await updateDoc(courtRef, { status: newStatus });

      // Log the activity
      await addDoc(collection(db, 'activityLogs'), {
        userName: 'Admin',
        courtNumber: parseInt(courtName.replace('Court ', '')),
        timestamp: serverTimestamp(),
        timeAgo: 'Just now',
        action: newStatus === 'Locked' ? 'locked' : 'unlocked'
      });
    } catch (error) {
      console.error("Failed to update court status:", error);
      // Revert local state on error
      setCourts(prev => prev.map(c => c.id === courtId ? { ...c, status: currentStatus as any } : c));
    }
  };

  // Fallback data for empty state/demo
  const displayCourts = courts.length > 0 ? courts : [
    { id: '1', name: 'Court 1', status: 'Available' },
    { id: '2', name: 'Court 2', status: 'Available' },
    { id: '3', name: 'Court 3', status: 'Available' },
    { id: '4', name: 'Court 4', status: 'Available' },
    { id: '5', name: 'Court 5', status: 'Available' },
    { id: '6', name: 'Court 6', status: 'Event' },
  ] as Court[];

  const displayActivities = activities.length > 0 ? activities : [
    { id: 'a1', userName: 'Sarah Lee', courtNumber: 2, timeAgo: '2 mins ago' },
    { id: 'a2', userName: 'Ahmad Razak', courtNumber: 4, timeAgo: '5 mins ago' },
    { id: 'a3', userName: 'Priya Kumar', courtNumber: 1, timeAgo: '12 mins ago' },
    { id: 'a4', userName: 'Wei Chen', courtNumber: 5, timeAgo: '18 mins ago' },
    { id: 'a5', userName: 'Fatimah Zahra', courtNumber: 3, timeAgo: '25 mins ago' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B21F24]"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-10 tracking-tight">Court Status Overview</h2>

      <div className="flex gap-10 flex-col xl:flex-row">
        {/* Court Cards Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-fit">
          {displayCourts.map((court) => (
            <div key={court.id} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-xl font-bold text-gray-800 tracking-tight">{court.name}</h3>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  court.status === 'Available' ? 'bg-[#E6F4EA] text-[#1E8E3E]' : 
                  court.status === 'Event' ? 'bg-[#F3E5F5] text-[#9C27B0]' : 
                  'bg-red-50 text-red-600 border border-red-100'
                }`}>
                  {court.status}
                </span>
              </div>
              
              <button
                onClick={() => handleToggleLock(court.id, court.status, court.name)}
                disabled={court.status === 'Event'}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-sm ${
                  court.status === 'Available' 
                    ? 'bg-[#E53935] hover:bg-[#D32F2F] text-white shadow-red-100' 
                    : court.status === 'Locked' 
                      ? 'bg-[#2E7D32] hover:bg-[#1B5E20] text-white shadow-green-100'
                      : 'bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100'
                }`}
              >
                {court.status === 'Available' ? 'Lock Court' : court.status === 'Locked' ? 'Unlock Court' : 'Court in Use (Event)'}
              </button>
            </div>
          ))}
        </div>

        {/* Activity Feed Panel */}
        <div className="w-full xl:w-96 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col h-fit">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">Live Activity Feed</h3>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-8">
            {displayActivities.map((activity) => (
              <div key={activity.id} className="flex justify-between items-start group">
                <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[10px] text-gray-400 border border-gray-100 uppercase">
                     {activity.userName.charAt(0)}
                   </div>
                   <div>
                    <h4 className="text-sm font-bold text-gray-800">{activity.userName}</h4>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">Booked Court {activity.courtNumber}</p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter pt-1">
                  {activity.timeAgo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
