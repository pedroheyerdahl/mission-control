'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('mission-control-auth');
    if (auth === 'true') {
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>, password: string) => {
    e.preventDefault();
    if (password === 'lobster') {
      localStorage.setItem('mission-control-auth', 'true');
      setAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mission-control-auth');
    setAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <img src="/lobster.png" alt="The Lobster" className="w-20 h-20 rounded-full mx-auto mb-4" />
            <h1 className="text-2xl font-bold">The Lobster's Mission Control</h1>
            <p className="text-slate-400 mt-2">Enter password to access</p>
          </div>
          
          <form onSubmit={(e) => handleLogin(e, (e.currentTarget.elements as any).password.value)} className="space-y-4">
            <input
              name="password"
              type="password"
              placeholder="Enter password..."
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-center"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-medium transition"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 text-slate-400 hover:text-white text-sm z-50"
      >
        Logout
      </button>
    </>
  );
}
