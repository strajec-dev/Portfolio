import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { setAuth, isAuthenticated } from '../../utils/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Restore system cursor for admin screens
    document.body.style.cursor = 'default';
    
    // Also restore system cursor for interactive elements
    const style = document.createElement('style');
    style.innerHTML = 'a, button, input, select, textarea { cursor: auto !important; }';
    document.head.appendChild(style);

    if (isAuthenticated()) {
      navigate('/admin/dashboard', { replace: true });
    }

    return () => {
      document.body.style.cursor = '';
      document.head.removeChild(style);
    };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${backendUrl}/api-token-auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuth(data.token, username);
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(data.non_field_errors?.[0] || 'Invalid username or password.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to connect to the backend server. Make sure it is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Strajec</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] text-navy px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold tracking-tight text-navy">Strajec Studio</h1>
            <p className="mt-2 text-sm text-[#6B7280]">Sign in to your administration dashboard</p>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Username field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4B5563] mb-2">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-[#9CA3AF]" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl pl-10 pr-4 py-3 text-navy text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4B5563] mb-2">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[#9CA3AF]" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl pl-10 pr-4 py-3 text-navy text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-navy hover:bg-navy-light text-white font-semibold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed group shadow-sm"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
