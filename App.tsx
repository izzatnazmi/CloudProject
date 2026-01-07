
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Overview from './pages/Overview';
import EventRequests from './pages/EventRequests';
import UserManagement from './pages/UserManagement';
import Layout from './components/Layout';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for demo session first
    const demoUser = localStorage.getItem('courtsync_demo_user');
    if (demoUser) {
      setUser(JSON.parse(demoUser));
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Check if user is admin in Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();
          
          if (userData && userData.role === 'admin') {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              role: 'admin'
            });
          } else {
            // Force logout if not admin and not in demo
            if (!localStorage.getItem('courtsync_demo_user')) {
              auth.signOut();
              setUser(null);
            }
          }
        } catch (e) {
          console.error("Firestore error or config missing. Use demo credentials.");
        }
      } else {
        if (!localStorage.getItem('courtsync_demo_user')) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B21F24]"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/" />} />
        
        <Route element={user ? <Layout /> : <Navigate to="/signin" />}>
          <Route path="/" element={<Overview />} />
          <Route path="/events" element={<EventRequests />} />
          <Route path="/users" element={<UserManagement />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
