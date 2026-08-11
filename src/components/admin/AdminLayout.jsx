import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { getAuthToken, clearAuth, getAuthUser } from '../../utils/auth';
import AdminSidebar from './AdminSidebar';

const PAGE_TITLES = {
  '/admin/dashboard': 'Overview',
  '/admin/leads':     'Leads',
  '/admin/projects':  'Projects',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen]       = useState(true);
  const [unreadLeadsCount, setUnreadLeadsCount] = useState(0);

  const navigate   = useNavigate();
  const location   = useLocation();
  const username   = getAuthUser() || 'Admin';
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const token      = getAuthToken();

  const pageTitle  = PAGE_TITLES[location.pathname] || 'Admin';

  // Restore system cursor for admin screens
  useEffect(() => {
    document.body.style.cursor = 'default';
    const style = document.createElement('style');
    style.innerHTML = 'a, button, input, select, textarea { cursor: auto !important; }';
    document.head.appendChild(style);
    fetchUnreadCount();
    return () => {
      document.body.style.cursor = '';
      document.head.removeChild(style);
    };
  }, []);

  // Keep unread badge fresh when navigating back from leads
  useEffect(() => {
    fetchUnreadCount();
  }, [location.pathname]);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/contacts/list/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const leads = data.results || data;
        setUnreadLeadsCount(leads.filter((l) => !l.is_read).length);
      } else if (res.status === 401 || res.status === 403) {
        handleLogout();
      }
    } catch (_) {}
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/admin/login', { replace: true });
  };

  const handleRefresh = () => {
    // Broadcast refresh event to the current tab page
    window.dispatchEvent(new CustomEvent('admin-refresh'));
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-navy flex">

      {/* ── Sidebar ── */}
      <AdminSidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        unreadLeadsCount={unreadLeadsCount}
        username={username}
        onLogout={handleLogout}
      />

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] px-6 flex items-center gap-4 sticky top-0 z-30">
          <div className="flex-1">
            <h2 className="text-lg font-bold tracking-tight text-navy">{pageTitle}</h2>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-white border border-[#D1D5DB] hover:bg-slate-50 text-navy p-2 rounded-xl transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-navy" />
          </button>
        </header>

        {/* Tab Page Content */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto">
          <Outlet context={{ token, backendUrl, onUnreadChange: setUnreadLeadsCount }} />
        </main>
      </div>
    </div>
  );
}
