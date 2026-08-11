import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  RefreshCw, Mail, Phone, Calendar, Trash2,
  Eye, EyeOff, Plus, Search, Download, X, MessageSquareReply,
  Send, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { getAuthToken, clearAuth, getAuthUser } from '../../utils/auth';
import AdminSidebar from './AdminSidebar';

const STATUS_OPTIONS = [
  { value: 'new',        label: 'New',        dot: 'bg-[#10B981]', chip: 'bg-[#10B981]/15 text-[#10B981]' },
  { value: 'contacted',  label: 'Contacted',  dot: 'bg-blue-500',   chip: 'bg-blue-50 text-blue-600' },
  { value: 'in_progress', label: 'In Progress', dot: 'bg-amber-500', chip: 'bg-amber-50 text-amber-600' },
  { value: 'closed',     label: 'Closed',     dot: 'bg-slate-400',  chip: 'bg-slate-100 text-[#4B5563]' },
];

const getStatus = (value) => STATUS_OPTIONS.find((s) => s.value === value) || STATUS_OPTIONS[0];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [replyLead, setReplyLead] = useState(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [replySent, setReplySent] = useState(false);

  const navigate = useNavigate();
  const username = getAuthUser() || 'Admin';
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const token = getAuthToken();

  useEffect(() => {
    // Restore system cursor for admin screens
    document.body.style.cursor = 'default';
    const style = document.createElement('style');
    style.innerHTML = 'a, button, input, select, textarea { cursor: auto !important; }';
    document.head.appendChild(style);

    fetchLeads();
    fetchProjects();

    return () => {
      document.body.style.cursor = '';
      document.head.removeChild(style);
    };
  }, []);

  const fetchLeads = async () => {
    setLoadingLeads(true);
    setError('');
    try {
      const response = await fetch(`${backendUrl}/api/contacts/list/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data.results || data);
      } else {
        if (response.status === 401 || response.status === 403) handleLogout();
        else setError('Failed to load leads.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Is the Django server running?');
    } finally {
      setLoadingLeads(false);
    }
  };

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await fetch(`${backendUrl}/api/projects/`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.results || data);
      }
    } catch (err) {
      console.error('Error fetching projects', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/admin/login', { replace: true });
  };

  const toggleReadStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`${backendUrl}/api/contacts/list/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ is_read: !currentStatus }),
      });
      if (response.ok) {
        setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, is_read: !currentStatus } : lead));
        setSelectedLead(prev => prev && prev.id === id ? { ...prev, is_read: !currentStatus } : prev);
      }
    } catch (err) {
      console.error('Error updating read status', err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${backendUrl}/api/contacts/list/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
        setSelectedLead(prev => prev && prev.id === id ? { ...prev, status: newStatus } : prev);
      }
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    try {
      const response = await fetch(`${backendUrl}/api/contacts/list/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` },
      });
      if (response.ok) {
        setLeads(prev => prev.filter(lead => lead.id !== id));
        setSelectedLead(prev => prev && prev.id === id ? null : prev);
      }
    } catch (err) {
      console.error('Error deleting lead', err);
    }
  };

  const exportLeads = async () => {
    setExporting(true);
    setError('');
    try {
      const response = await fetch(`${backendUrl}/api/contacts/export/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting leads', err);
      setError('Failed to export leads.');
    } finally {
      setExporting(false);
    }
  };

  // Derived stats
  const unreadLeadsCount = leads.filter(l => !l.is_read).length;
  const totalLeadsCount = leads.length;
  const totalProjectsCount = projects.length;

  const budgets = [...new Set(leads.map(l => l.budget).filter(Boolean))].sort();
  const statusCounts = STATUS_OPTIONS.reduce(
    (acc, s) => ({ ...acc, [s.value]: leads.filter(l => l.status === s.value).length }),
    {}
  );

  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
    if (readFilter === 'read' && !lead.is_read) return false;
    if (readFilter === 'unread' && lead.is_read) return false;
    if (budgetFilter !== 'all' && lead.budget !== budgetFilter) return false;
    const q = search.trim().toLowerCase();
    if (q) {
      const haystack = [lead.name, lead.email, lead.phone, lead.budget, lead.desc].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setReadFilter('all');
    setBudgetFilter('all');
  };

  const openReply = (lead) => {
    setReplyLead(lead);
    setReplySubject(`Re: Project inquiry — ${lead.name}`);
    setReplyMessage('');
    setReplyError('');
    setReplySent(false);
  };

  const closeReply = () => {
    setReplyLead(null);
    setReplySubject('');
    setReplyMessage('');
    setReplyError('');
    setReplySent(false);
    setSendingReply(false);
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!replySubject.trim() || !replyMessage.trim()) {
      setReplyError('Subject and message are required.');
      return;
    }
    setSendingReply(true);
    setReplyError('');
    try {
      const response = await fetch(`${backendUrl}/api/contacts/reply/${replyLead.id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ subject: replySubject, message: replyMessage }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setReplySent(true);
        setTimeout(() => {
          closeReply();
        }, 2000);
      } else {
        setReplyError(data.detail || 'Failed to send reply.');
      }
    } catch (err) {
      console.error('Error sending reply', err);
      setReplyError('Connection error. Is the Django server running?');
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Strajec</title>
      </Helmet>

      <div className="min-h-screen bg-[#F9FAFB] text-navy flex">

        {/* ── Sidebar ── */}
        <AdminSidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadLeadsCount={unreadLeadsCount}
          username={username}
          onLogout={handleLogout}
        />

        {/* ── Main Content ── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Top Navbar */}
          <header className="h-16 bg-white border-b border-[#E5E7EB] px-6 flex items-center gap-4 sticky top-0 z-30">
            <div className="flex-1">
              <h2 className="text-lg font-bold tracking-tight capitalize text-navy">
                {activeTab === 'dashboard' ? 'Overview' : activeTab}
              </h2>
            </div>
            <button
              onClick={activeTab === 'projects' ? fetchProjects : fetchLeads}
              className="bg-white border border-[#D1D5DB] hover:bg-slate-50 text-navy p-2 rounded-xl transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-navy" />
            </button>
          </header>

          {/* Page Content */}
          <main className="p-6 md:p-8 flex-1 overflow-y-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            {/* ── TAB: OVERVIEW ── */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Unread Leads</p>
                    <p className="text-3xl font-extrabold text-navy mt-2">{unreadLeadsCount}</p>
                  </div>
                  <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Total Inquiries</p>
                    <p className="text-3xl font-extrabold text-navy mt-2">{totalLeadsCount}</p>
                  </div>
                  <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Total Projects</p>
                    <p className="text-3xl font-extrabold text-navy mt-2">{totalProjectsCount}</p>
                  </div>
                </div>

                {/* Recent Inquiries */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-navy">Recent Inquiries</h3>
                    <button onClick={() => setActiveTab('leads')} className="text-xs font-semibold text-navy hover:underline">
                      View All
                    </button>
                  </div>
                  {loadingLeads ? (
                    <div className="w-full h-32 flex items-center justify-center bg-white rounded-2xl border border-[#E5E7EB]">
                      <div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : leads.length === 0 ? (
                    <div className="text-center py-10 bg-white border border-[#E5E7EB] rounded-2xl text-sm text-[#6B7280]">
                      No inquiries yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {leads.slice(0, 3).map((lead) => (
                        <div key={lead.id} className="bg-white border border-[#E5E7EB] p-5 rounded-2xl flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-bold text-navy text-sm">{lead.name}</p>
                            <p className="text-xs text-[#6B7280] mt-0.5 truncate">{lead.email} · Budget: {lead.budget}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`flex items-center gap-1.5 text-[0.65rem] font-bold px-2 py-0.5 rounded-md ${getStatus(lead.status).chip}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${getStatus(lead.status).dot}`} />
                              {getStatus(lead.status).label}
                            </span>
                            <span className={`text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${lead.is_read ? 'bg-slate-100 text-[#4B5563]' : 'bg-navy/10 text-navy'}`}>
                              {lead.is_read ? 'Read' : 'New'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB: LEADS ── */}
            {activeTab === 'leads' && (
              <div className="space-y-6">
                {/* Toolbar: search + export */}
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                  <div className="relative flex-1 md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by name, email, phone, budget…"
                      className="w-full bg-white border border-[#D1D5DB] rounded-xl pl-10 pr-4 py-2.5 text-sm text-navy placeholder:text-[#9CA3AF] focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all"
                    />
                  </div>
                  <button
                    onClick={exportLeads}
                    disabled={exporting || leads.length === 0}
                    className="inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    {exporting ? 'Exporting…' : 'Export CSV'}
                  </button>
                </div>

                {/* Status chips */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      statusFilter === 'all'
                        ? 'bg-navy text-white border-navy'
                        : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:border-navy hover:text-navy'
                    }`}
                  >
                    All <span className="opacity-70">{leads.length}</span>
                  </button>
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setStatusFilter(opt.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                        statusFilter === opt.value
                          ? 'bg-navy text-white border-navy'
                          : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:border-navy hover:text-navy'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                      {opt.label} <span className="opacity-70">{statusCounts[opt.value]}</span>
                    </button>
                  ))}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={readFilter}
                    onChange={(e) => setReadFilter(e.target.value)}
                    className="bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-xs font-semibold text-navy focus:outline-none focus:border-navy cursor-pointer"
                  >
                    <option value="all">All read states</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                  <select
                    value={budgetFilter}
                    onChange={(e) => setBudgetFilter(e.target.value)}
                    className="bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-xs font-semibold text-navy focus:outline-none focus:border-navy cursor-pointer"
                  >
                    <option value="all">All budgets</option>
                    {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {(statusFilter !== 'all' || readFilter !== 'all' || budgetFilter !== 'all' || search) && (
                    <button
                      onClick={clearFilters}
                      className="text-xs font-semibold text-navy hover:underline px-2"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                <p className="text-xs text-[#6B7280]">
                  Showing {filteredLeads.length} of {leads.length} leads
                </p>

                {loadingLeads ? (
                  <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : leads.length === 0 ? (
                  <div className="text-center py-20 bg-white border border-[#E5E7EB] rounded-2xl text-sm text-[#6B7280]">
                    No leads found.
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <div className="text-center py-20 bg-white border border-[#E5E7EB] rounded-2xl text-sm text-[#6B7280]">
                    No leads match your filters.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredLeads.map((lead) => {
                      const status = getStatus(lead.status);
                      return (
                        <div
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className={`bg-white border transition-all duration-200 rounded-2xl p-6 relative overflow-hidden cursor-pointer hover:shadow-md group ${
                            lead.is_read ? 'border-[#E5E7EB]' : 'border-navy shadow-sm'
                          }`}
                        >
                          {!lead.is_read && <div className="absolute top-0 left-0 bottom-0 w-1 bg-navy" />}
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="space-y-3 flex-1">
                              <div className="flex flex-wrap items-center gap-2.5">
                                <h3 className="font-bold text-navy text-lg">{lead.name}</h3>
                                <span className={`flex items-center gap-1.5 text-[0.65rem] font-bold px-2 py-0.5 rounded-md ${status.chip}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                  {status.label}
                                </span>
                                <span className="bg-navy/5 border border-navy/10 text-navy font-semibold text-xs px-2.5 py-0.5 rounded-full">
                                  Budget: {lead.budget}
                                </span>
                                {!lead.is_read && (
                                  <span className="bg-[#10B981]/15 text-[#10B981] font-bold text-[0.7rem] uppercase px-2 py-0.5 rounded-md">New</span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#4B5563] text-sm">
                                <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 hover:text-navy font-medium">
                                  <Mail className="w-4 h-4 text-[#9CA3AF]" />{lead.email}
                                </a>
                                {lead.phone && (
                                  <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 hover:text-navy font-medium">
                                    <Phone className="w-4 h-4 text-[#9CA3AF]" />{lead.phone}
                                  </a>
                                )}
                                <span className="flex items-center gap-2 font-medium">
                                  <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                                  {new Date(lead.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#F3F4F6] text-navy/90 text-sm leading-relaxed whitespace-pre-wrap line-clamp-3">
                                {lead.desc}
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }}
                                className="text-xs font-semibold text-navy hover:underline"
                              >
                                View full details →
                              </button>
                            </div>
                            <div className="flex md:flex-col gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-[#F3F4F6]">
                              <select
                                value={lead.status}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => updateStatus(lead.id, e.target.value)}
                                className="bg-white border border-[#D1D5DB] rounded-xl px-2.5 py-2 text-xs font-bold text-navy focus:outline-none focus:border-navy cursor-pointer"
                              >
                                {STATUS_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleReadStatus(lead.id, lead.is_read); }}
                                className="p-2.5 rounded-xl border flex items-center justify-center transition-colors w-10 h-10 bg-white border-[#E5E7EB] hover:bg-slate-50 text-[#6B7280] hover:text-navy"
                                title={lead.is_read ? 'Mark as unread' : 'Mark as read'}
                              >
                                {lead.is_read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); }}
                                className="bg-white border border-[#FCA5A5] hover:bg-red-50 p-2.5 rounded-xl text-[#EF4444] transition-colors w-10 h-10 flex items-center justify-center"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── LEAD DETAIL MODAL ── */}
            {selectedLead && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm"
                onClick={() => setSelectedLead(null)}
              >
                <div
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 border-b border-[#F3F4F6] flex items-start justify-between gap-4 sticky top-0 bg-white rounded-t-2xl">
                    <div className="min-w-0">
                      <h3 className="font-bold text-navy text-xl">{selectedLead.name}</h3>
                      <p className="text-sm text-[#6B7280] mt-1 truncate">
                        {selectedLead.email}
                        {selectedLead.phone ? ` · ${selectedLead.phone}` : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="p-2 hover:bg-slate-100 rounded-xl text-[#6B7280] transition-colors flex-shrink-0"
                      title="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="text-xs font-semibold text-[#6B7280]">Status</label>
                      <select
                        value={selectedLead.status}
                        onChange={(e) => updateStatus(selectedLead.id, e.target.value)}
                        className="bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-xs font-bold text-navy focus:outline-none focus:border-navy cursor-pointer"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <span className="bg-navy/5 border border-navy/10 text-navy font-semibold text-xs px-2.5 py-1 rounded-full">
                        Budget: {selectedLead.budget}
                      </span>
                      {!selectedLead.is_read && (
                        <span className="bg-[#10B981]/15 text-[#10B981] font-bold text-[0.7rem] uppercase px-2 py-1 rounded-md">New</span>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#6B7280] mb-2">Project Description</p>
                      <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#F3F4F6] text-navy/90 text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedLead.desc}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                      Submitted {new Date(selectedLead.created_at).toLocaleString()}
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-[#F3F4F6] pt-5">
                      <button
                        onClick={() => openReply(selectedLead)}
                        className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
                      >
                        <MessageSquareReply className="w-4 h-4" /> Reply via Email
                      </button>
                      {selectedLead.phone && (
                        <a
                          href={`tel:${selectedLead.phone}`}
                          className="inline-flex items-center gap-2 bg-white border border-[#D1D5DB] hover:bg-slate-50 text-navy text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
                        >
                          <Phone className="w-4 h-4" /> Call
                        </a>
                      )}
                      <button
                        onClick={() => toggleReadStatus(selectedLead.id, selectedLead.is_read)}
                        className="inline-flex items-center gap-2 bg-white border border-[#D1D5DB] hover:bg-slate-50 text-navy text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
                      >
                        {selectedLead.is_read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {selectedLead.is_read ? 'Mark Unread' : 'Mark Read'}
                      </button>
                      <button
                        onClick={() => deleteLead(selectedLead.id)}
                        className="inline-flex items-center gap-2 bg-white border border-[#FCA5A5] hover:bg-red-50 text-[#EF4444] text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── REPLY COMPOSE MODAL ── */}
            {replyLead && (
              <div
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm"
                onClick={() => !sendingReply && closeReply()}
              >
                <div
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <form onSubmit={sendReply}>
                    <div className="p-6 border-b border-[#F3F4F6] flex items-start justify-between gap-4 sticky top-0 bg-white rounded-t-2xl">
                      <div className="min-w-0">
                        <h3 className="font-bold text-navy text-lg flex items-center gap-2">
                          <MessageSquareReply className="w-4 h-4 text-[#9CA3AF]" /> Reply to {replyLead.name}
                        </h3>
                        <p className="text-sm text-[#6B7280] mt-1 truncate">{replyLead.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={closeReply}
                        disabled={sendingReply}
                        className="p-2 hover:bg-slate-100 rounded-xl text-[#6B7280] transition-colors flex-shrink-0 disabled:opacity-50"
                        title="Close"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-[#6B7280] block mb-1.5">Subject</label>
                        <input
                          type="text"
                          value={replySubject}
                          onChange={(e) => setReplySubject(e.target.value)}
                          disabled={sendingReply || replySent}
                          className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all disabled:opacity-60"
                          placeholder="Email subject…"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#6B7280] block mb-1.5">Message</label>
                        <textarea
                          rows={8}
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          disabled={sendingReply || replySent}
                          className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm text-navy resize-none focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all disabled:opacity-60"
                          placeholder={`Hi ${replyLead.name},\n\nThanks for reaching out…`}
                        />
                      </div>

                      {replyError && (
                        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {replyError}
                        </div>
                      )}

                      {replySent && (
                        <div className="flex items-center gap-2 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] p-3 rounded-xl text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4" /> Reply sent to {replyLead.email}.
                        </div>
                      )}
                    </div>

                    <div className="p-6 pt-0 border-t border-[#F3F4F6] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={closeReply}
                        disabled={sendingReply}
                        className="bg-white border border-[#D1D5DB] hover:bg-slate-50 text-navy text-xs font-semibold px-4 py-2.5 rounded-xl transition-all disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={sendingReply || replySent}
                        className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
                      >
                        {sendingReply ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Send Reply
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ── TAB: PROJECTS ── */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#6B7280]">Projects currently shown on your portfolio website</p>
                  <a
                    href={`${backendUrl}/admin/projects/project/add/`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Project
                  </a>
                </div>

                {loadingProjects ? (
                  <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-20 bg-white border border-[#E5E7EB] rounded-2xl text-sm text-[#6B7280]">
                    No projects found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                      <div key={project.id} className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                        <div>
                          {project.image_url ? (
                            <img src={project.image_url} alt={project.title} className="w-full h-40 object-cover border-b border-[#E5E7EB]" />
                          ) : (
                            <div className="w-full h-40 bg-slate-100 flex items-center justify-center border-b border-[#E5E7EB] text-xs text-[#9CA3AF]">
                              No Image Available
                            </div>
                          )}
                          <div className="p-5 space-y-3">
                            <h4 className="font-bold text-navy text-base">{project.title}</h4>
                            <p className="text-xs text-[#6B7280] line-clamp-2">{project.description}</p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {project.tech_stack?.map((tech) => (
                                <span key={tech} className="bg-slate-100 text-[#4B5563] text-[0.65rem] px-2 py-0.5 rounded font-medium">{tech}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="p-5 pt-0 border-t border-[#F3F4F6] mt-4 flex items-center justify-between">
                          <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full ${project.is_featured ? 'bg-gold/25 text-navy' : 'bg-slate-100 text-[#6B7280]'}`}>
                            {project.is_featured ? '★ Featured' : 'Standard'}
                          </span>
                          <a
                            href={`${backendUrl}/admin/projects/project/${project.id}/change/`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-navy hover:underline"
                          >
                            Edit details →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
