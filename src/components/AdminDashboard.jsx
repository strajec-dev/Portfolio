import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  LogOut, RefreshCw, Mail, Phone, Calendar, Trash2, CheckCircle, 
  Eye, EyeOff, LayoutDashboard, Inbox, FolderKanban, X, Plus, ChevronRight, ChevronLeft
} from 'lucide-react';
import { getAuthToken, clearAuth, getAuthUser } from '../utils/auth';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, leads, projects
  const [leads, setLeads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const username = getAuthUser() || 'Admin';
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const token = getAuthToken();

  useEffect(() => {
    // Restore system cursor for admin screens
    document.body.style.cursor = 'default';
    
    // Also restore system cursor for interactive elements
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
        setLeads(leads.map(lead => lead.id === id ? { ...lead, is_read: !currentStatus } : lead));
      }
    } catch (err) {
      console.error('Error updating read status', err);
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
        setLeads(leads.filter(lead => lead.id !== id));
      }
    } catch (err) {
      console.error('Error deleting lead', err);
    }
  };

  // Dashboard Stats
  const unreadLeadsCount = leads.filter(l => !l.is_read).length;
  const totalLeadsCount = leads.length;
  const totalProjectsCount = projects.length;

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Strajec</title>
      </Helmet>

      <div className="min-h-screen bg-[#F9FAFB] text-navy flex">
        
        {/* ── Sidebar Navigation ── */}
        <aside className={`bg-white border-r border-[#E5E7EB] fixed inset-y-0 left-0 z-50 transform ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'
        } transition-all duration-200 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? 'md:w-64' : 'md:w-20 md:px-2'
        } flex flex-col justify-between overflow-x-hidden`}>
          
          <div className="flex-1">
            {/* Header / Brand */}
            <div className={`h-16 border-b border-[#E5E7EB] flex items-center justify-between ${
              sidebarOpen ? 'px-6' : 'px-2 justify-center gap-1'
            }`}>
              {sidebarOpen ? (
                <>
                  <span className="font-display font-bold text-lg tracking-tight whitespace-nowrap">Strajec Studio</span>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg text-[#6B7280] hover:text-navy transition-colors" title="Collapse Sidebar">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="w-9 h-9 bg-navy/5 text-navy font-bold rounded-xl flex items-center justify-center text-base" title="Strajec">
                    S
                  </div>
                  <button onClick={() => setSidebarOpen(true)} className="p-1 hover:bg-slate-100 rounded-lg text-[#6B7280] hover:text-navy transition-colors" title="Expand Sidebar">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Nav Menu */}
            <nav className={`p-4 space-y-2 ${sidebarOpen ? '' : 'flex flex-col items-center'}`}>
              <button
                onClick={() => setActiveTab('dashboard')}
                title="Dashboard Overview"
                className={`flex items-center rounded-xl text-sm font-semibold transition-all duration-150 ${
                  sidebarOpen 
                    ? 'w-full gap-3 px-4 py-3' 
                    : 'w-12 h-12 justify-center'
                } ${
                  activeTab === 'dashboard'
                    ? 'bg-navy/5 text-navy'
                    : 'text-[#4B5563] hover:bg-slate-50 hover:text-navy'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="whitespace-nowrap">Overview</span>}
              </button>

              <button
                onClick={() => setActiveTab('leads')}
                title="Lead Submissions"
                className={`flex items-center rounded-xl text-sm font-semibold transition-all duration-150 relative ${
                  sidebarOpen 
                    ? 'w-full justify-between px-4 py-3' 
                    : 'w-12 h-12 justify-center'
                } ${
                  activeTab === 'leads'
                    ? 'bg-navy/5 text-navy'
                    : 'text-[#4B5563] hover:bg-slate-50 hover:text-navy'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Inbox className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="whitespace-nowrap">Leads</span>}
                </div>
                {unreadLeadsCount > 0 && (
                  <span className={`bg-navy text-white rounded-full font-bold ${
                    sidebarOpen 
                      ? 'text-[0.7rem] px-2 py-0.5' 
                      : 'absolute top-1.5 right-1.5 w-4 h-4 text-[0.55rem] flex items-center justify-center'
                  }`}>
                    {unreadLeadsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                title="Manage Projects"
                className={`flex items-center rounded-xl text-sm font-semibold transition-all duration-150 ${
                  sidebarOpen 
                    ? 'w-full gap-3 px-4 py-3' 
                    : 'w-12 h-12 justify-center'
                } ${
                  activeTab === 'projects'
                    ? 'bg-navy/5 text-navy'
                    : 'text-[#4B5563] hover:bg-slate-50 hover:text-navy'
                }`}
              >
                <FolderKanban className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="whitespace-nowrap">Projects</span>}
              </button>
            </nav>
          </div>

          {/* User Account / Logout */}
          <div className={`p-4 border-t border-[#E5E7EB] bg-slate-50/50 flex flex-col items-center ${
            sidebarOpen ? 'w-64' : 'w-20'
          }`}>
            {sidebarOpen ? (
              <div className="flex items-center justify-between w-full">
                <div className="min-w-0">
                  <p className="text-xs text-[#6B7280]">Logged in as</p>
                  <p className="text-sm font-bold text-navy truncate">{username}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#EF4444] hover:bg-red-50 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="w-12 h-12 flex items-center justify-center text-[#EF4444] hover:bg-red-50 rounded-xl transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </aside>

        {/* ── Main content area ── */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Navbar */}
          <header className="h-16 bg-white border-b border-[#E5E7EB] px-6 flex items-center gap-4 sticky top-0 z-30">
            <div className="flex-1">
              <h2 className="text-lg font-bold tracking-tight capitalize text-navy">{activeTab === 'dashboard' ? 'Overview' : activeTab}</h2>
            </div>
            <div>
              <button

                onClick={activeTab === 'projects' ? fetchProjects : fetchLeads}
                className="bg-white border border-[#D1D5DB] hover:bg-slate-50 text-navy p-2 rounded-xl transition-colors"
                title="Refresh Page"
              >
                <RefreshCw className="w-4 h-4 text-navy" />
              </button>
            </div>
          </header>

          {/* Core Content Views */}
          <main className="p-6 md:p-8 flex-1 overflow-y-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            {/* TAB: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Metrics */}
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

                {/* Recent Submissions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-navy">Recent Inquiries</h3>
                    <button onClick={() => setActiveTab('leads')} className="text-xs font-semibold text-navy hover:underline">View All</button>
                  </div>

                  {loadingLeads ? (
                    <div className="w-full h-32 flex items-center justify-center bg-white rounded-2xl border border-[#E5E7EB]"><div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin" /></div>
                  ) : leads.length === 0 ? (
                    <div className="text-center py-10 bg-white border border-[#E5E7EB] rounded-2xl text-sm text-[#6B7280]">No inquiries yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {leads.slice(0, 3).map((lead) => (
                        <div key={lead.id} className="bg-white border border-[#E5E7EB] p-5 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-navy text-sm">{lead.name}</p>
                            <p className="text-xs text-[#6B7280] mt-0.5">{lead.email} · Budget: {lead.budget}</p>
                          </div>
                          <span className={`text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${lead.is_read ? 'bg-slate-100 text-[#4B5563]' : 'bg-navy/10 text-navy'}`}>
                            {lead.is_read ? 'Read' : 'New'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: LEADS LIST */}
            {activeTab === 'leads' && (
              <div className="space-y-6">
                {loadingLeads ? (
                  <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" /></div>
                ) : leads.length === 0 ? (
                  <div className="text-center py-20 bg-white border border-[#E5E7EB] rounded-2xl text-sm text-[#6B7280]">No leads found.</div>
                ) : (
                  <div className="space-y-4">
                    {leads.map((lead) => (
                      <div key={lead.id} className={`bg-white border transition-all duration-200 rounded-2xl p-6 relative overflow-hidden ${lead.is_read ? 'border-[#E5E7EB]' : 'border-navy shadow-sm'}`}>
                        {!lead.is_read && <div className="absolute top-0 left-0 bottom-0 w-1 bg-navy" />}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="space-y-3 flex-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <h3 className="font-bold text-navy text-lg">{lead.name}</h3>
                              <span className="bg-navy/5 border border-navy/10 text-navy font-semibold text-xs px-2.5 py-0.5 rounded-full">Budget: {lead.budget}</span>
                              {!lead.is_read && <span className="bg-[#10B981]/15 text-[#10B981] font-bold text-[0.7rem] uppercase px-2 py-0.5 rounded-md">New</span>}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#4B5563] text-sm">
                              <a href={`mailto:${lead.email}`} className="flex items-center gap-2 hover:text-navy font-medium"><Mail className="w-4 h-4 text-[#9CA3AF]" />{lead.email}</a>
                              {lead.phone && <a href={`tel:${lead.phone}`} className="flex items-center gap-2 hover:text-navy font-medium"><Phone className="w-4 h-4 text-[#9CA3AF]" />{lead.phone}</a>}
                              <span className="flex items-center gap-2 font-medium"><Calendar className="w-4 h-4 text-[#9CA3AF]" />{new Date(lead.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#F3F4F6] text-navy/90 text-sm leading-relaxed whitespace-pre-wrap">{lead.desc}</div>
                          </div>
                          <div className="flex md:flex-col gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-[#F3F4F6]">
                            <button onClick={() => toggleReadStatus(lead.id, lead.is_read)} className="p-2.5 rounded-xl border flex items-center justify-center transition-colors w-10 h-10 bg-white border-[#E5E7EB] hover:bg-slate-50 text-[#6B7280] hover:text-navy">
                              {lead.is_read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button onClick={() => deleteLead(lead.id)} className="bg-white border border-[#FCA5A5] hover:bg-red-50 p-2.5 rounded-xl text-[#EF4444] transition-colors w-10 h-10 flex items-center justify-center">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: PROJECTS LIST */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#6B7280]">Projects currently shown on your portfolio website</p>
                  <a href={`${backendUrl}/admin/projects/project/add/`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm">
                    <Plus className="w-4 h-4" /> Add Project
                  </a>
                </div>

                {loadingProjects ? (
                  <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" /></div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-20 bg-white border border-[#E5E7EB] rounded-2xl text-sm text-[#6B7280]">No projects found.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                      <div key={project.id} className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                        <div>
                          {project.image_url ? (
                            <img src={project.image_url} alt={project.title} className="w-full h-40 object-cover border-b border-[#E5E7EB]" />
                          ) : (
                            <div className="w-full h-40 bg-slate-100 flex items-center justify-center border-b border-[#E5E7EB] text-xs text-[#9CA3AF]">No Image Available</div>
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
                          <a href={`${backendUrl}/admin/projects/project/${project.id}/change/`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-navy hover:underline">
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
