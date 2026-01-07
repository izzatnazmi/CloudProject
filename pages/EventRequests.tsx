
import React, { useState, useEffect } from 'react';
import { EventRequest } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, doc, updateDoc, writeBatch } from 'firebase/firestore';

const EventRequests: React.FC = () => {
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'eventRequests'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reqData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventRequest));
      setRequests(reqData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching requests:", err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleApprove = async (request: EventRequest) => {
    try {
      const batch = writeBatch(db);
      
      // 1. Update request status
      const requestRef = doc(db, 'eventRequests', request.id);
      batch.update(requestRef, { status: 'approved' });

      // 2. Lock requested courts (optional: change to 'Event' status)
      // Note: This logic assumes 'courts' collection uses the court name or a mapping exists.
      // For this demo, we'll just update the request status.
      
      await batch.commit();
      setRequests(prev => prev.filter(r => r.id !== request.id));
    } catch (error) {
      console.error("Failed to approve request:", error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      const requestRef = doc(db, 'eventRequests', requestId);
      await updateDoc(requestRef, { status: 'declined' });
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (error) {
      console.error("Failed to decline request:", error);
    }
  };

  const mockRequests: EventRequest[] = [
    { id: 'req1', requesterName: 'Ahmad Bin Razak', eventName: 'Inter-College Badminton Tournament', dateTime: '15 Jan 2026, 09:00 AM', courtsRequested: ['Court 1', 'Court 2', 'Court 3'], status: 'pending' },
    { id: 'req2', requesterName: 'Sarah J. Lee', eventName: 'Faculty of Engineering Friendly', dateTime: '20 Jan 2026, 02:00 PM', courtsRequested: ['Court 4', 'Court 5'], status: 'pending' },
    { id: 'req3', requesterName: 'Wei Chen', eventName: 'Varsity Training Session', dateTime: '25 Jan 2026, 08:30 AM', courtsRequested: ['Court 1', 'Court 2'], status: 'pending' },
  ];

  const displayRequests = requests.length > 0 ? requests : mockRequests;

  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B21F24]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 animate-in fade-in duration-500">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-10 tracking-tight">Pending Event Requests</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-b-2 border-gray-50">
              <th className="pb-8 pl-4">Requester Name</th>
              <th className="pb-8">Event Name</th>
              <th className="pb-8">Date / Time</th>
              <th className="pb-8">Courts Requested</th>
              <th className="pb-8 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayRequests.map((req) => (
              <tr key={req.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="py-8 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#B21F24] font-bold text-xs uppercase">
                      {req.requesterName.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-gray-800">{req.requesterName}</span>
                  </div>
                </td>
                <td className="py-8">
                  <span className="text-sm font-semibold text-gray-700">{req.eventName}</span>
                </td>
                <td className="py-8">
                  <span className="text-sm font-medium text-gray-500">{req.dateTime}</span>
                </td>
                <td className="py-8">
                  <div className="flex flex-wrap gap-1.5">
                    {req.courtsRequested.map(c => (
                      <span key={c} className="bg-gray-100 px-2 py-0.5 rounded-md text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                        {c.replace('Court ', 'C')}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-8 pr-4">
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => handleApprove(req)}
                      className="px-5 py-2.5 bg-[#1E8E3E] text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-[#137333] transition-all shadow-md shadow-green-100 active:scale-95"
                    >
                      Approve & Lock
                    </button>
                    <button
                      onClick={() => handleDecline(req.id)}
                      className="px-5 py-2.5 bg-[#D32F2F] text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-[#B71C1C] transition-all shadow-md shadow-red-100 active:scale-95"
                    >
                      Decline
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {displayRequests.length === 0 && (
          <div className="py-32 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="text-2xl">🎉</span>
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No pending requests</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRequests;
