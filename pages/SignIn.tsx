
import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError("Google Auth requires valid Firebase keys. Try the demo login.");
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // DEMO BYPASS for the project demo
    if (email === 'admin@upm.edu.my' && password === 'admin123') {
      const mockUser = {
        uid: 'demo-admin-id',
        email: 'admin@upm.edu.my',
        displayName: 'Demo Administrator',
        role: 'admin'
      };
      localStorage.setItem('courtsync_demo_user', JSON.stringify(mockUser));
      window.location.reload();
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Invalid email or password. Use demo: admin@upm.edu.my / admin123');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAF9] px-4 font-['Inter']">
      {/* Top Banner */}
      <div className="fixed top-0 w-full bg-[#444444] py-2 px-6 text-white/70 text-sm font-medium">
        Sign In
      </div>

      <div className="w-full max-w-md text-center">
        {/* App Logo/Icon */}
        <div className="bg-[#B21F24] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-200">
          <LogIn className="text-white" size={36} />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">CourtSync Admin</h1>
        <p className="text-gray-500 mb-10 font-medium">Badminton Court Management System</p>

        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200 p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8 text-left">
            <h2 className="text-xl font-bold text-gray-800">Administrator Access</h2>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-5 mb-6">
            <div className="text-left">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@upm.edu.my"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B21F24]/10 focus:border-[#B21F24] transition-all"
                required
              />
            </div>

            <div className="text-left">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B21F24]/10 focus:border-[#B21F24] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-semibold text-left border border-red-100 flex gap-2 items-center">
                <ShieldAlert size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-[#B21F24] text-white font-bold rounded-xl hover:bg-[#8e191d] transition-all transform active:scale-[0.98] shadow-lg shadow-red-200/50"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">OR</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3.5 border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all border-2"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>

          <p className="mt-8 text-xs text-gray-400 font-bold uppercase tracking-wide">
            Restricted to authorized UPM staff only
          </p>
        </div>

        <p className="text-gray-400 text-sm font-semibold tracking-wide">University Putra Malaysia (UPM)</p>
      </div>
    </div>
  );
};

export default SignIn;
