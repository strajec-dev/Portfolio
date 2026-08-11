import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useOutletContext } from 'react-router-dom';
import { getStatus } from './adminConstants';

export default function AdminDashboard() {
  const { token, backendUrl, onUnreadChange } = useOutletContext();
  const [leads, setLeads]       = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    const doFetch = () => fetchAll();
    window.addEventListener('admin-refresh', doFetch);
    fetchAll();
    return () => window.removeEventListener('admin-refresh', doFetch);
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [leadsRes, projectsRes] = await Promise.all([
        fetch(`${backendUrl}/api/contacts/list/`,  { headers: { 'Authorization': `Token ${token}` } }),
        fetch(`${backendUrl}/api/projects/`),
      ]);
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        const list = data.results || data;
        setLeads(list);
        onUnreadChange(list.filter((l) => !l.is_read).length);
      } else {
        setError('Failed to load leads.');
      }
      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data.results || data);
      }
    } catch {
      setError('Connection error. Is the Django server running?');
    } finally {
      setLoading(false);
    }
  };

  const unreadCount   = leads.filter((l) => !l.is_read).length;
  const totalLeads    = leads.length;
  const totalProjects = projects.length;

  return (
    <>
      <Helmet><title>Overview | Strajec Admin</title></Helmet>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm">{error}</div>
      )}

      <div className="space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: 'Unread Leads',    value: unreadCount },
            { label: 'Total Inquiries', value: totalLeads },
            { label: 'Total Projects',  value: totalProjects },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border border-[#E5E7EB] p-6 rounded-2xl shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">{label}</p>
              <p className="text-3xl font-extrabold text-navy mt-2">
                {loading ? <span className="w-8 h-8 inline-block border-2 border-navy border-t-transparent rounded-full animate-spin" /> : value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Inquiries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-navy">Recent Inquiries</h3>
            <a href="/admin/leads" className="text-xs font-semibold text-navy hover:underline">View All</a>
          </div>

          {loading ? (
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
                    <span className={`inline-flex items-center gap-1.5 text-[0.7rem] font-bold px-2.5 py-1 rounded-full ${getStatus(lead.status).chip}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatus(lead.status).dot}`} />
                      {getStatus(lead.status).label}
                    </span>
                    <span className={`text-[0.7rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${lead.is_read ? 'bg-slate-100 text-[#4B5563]' : 'bg-navy/10 text-navy'}`}>
                      {lead.is_read ? 'Read' : 'New'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
