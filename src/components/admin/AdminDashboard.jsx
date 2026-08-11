import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useOutletContext } from 'react-router-dom';
import { getStatus } from './adminConstants';
import { Eye, Users, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { token, backendUrl, onUnreadChange } = useOutletContext();
  const [leads, setLeads]             = useState([]);
  const [projects, setProjects]       = useState([]);
  const [analytics, setAnalytics]     = useState({ realtimeUsers: 0, totalViews: 0, totalUsers: 0, chartData: [] });
  const [loading, setLoading]         = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [error, setError]             = useState('');

  useEffect(() => {
    const doFetch = () => {
      fetchAll();
      fetchAnalytics();
    };
    window.addEventListener('admin-refresh', doFetch);
    fetchAll();
    fetchAnalytics();
    return () => window.removeEventListener('admin-refresh', doFetch);
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [leadsRes, projectsRes] = await Promise.all([
        fetch(`${backendUrl}/api/contacts/list/`, { headers: { 'Authorization': `Token ${token}` } }),
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

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch(`${backendUrl}/api/analytics/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Error fetching analytics', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const unreadCount   = leads.filter((l) => !l.is_read).length;
  const totalLeads    = leads.length;
  const totalProjects = projects.length;

  // Custom SVG Chart rendering helpers
  const chartPoints = analytics.chartData || [];
  const maxVal = Math.max(...chartPoints.map(p => Math.max(p.Visitors, p.Pageviews, 10)), 10);
  const width = 600;
  const height = 180;
  const padding = 30;

  const pointsX = (index) => padding + (index / Math.max(chartPoints.length - 1, 1)) * (width - padding * 2);
  const pointsY = (val) => height - padding - (val / maxVal) * (height - padding * 2);

  // Generate SVG path points
  const visitorsPath = chartPoints.map((p, idx) => `${pointsX(idx)},${pointsY(p.Visitors)}`).join(' L ');
  const pageviewsPath = chartPoints.map((p, idx) => `${pointsX(idx)},${pointsY(p.Pageviews)}`).join(' L ');

  return (
    <>
      <Helmet><title>Overview | Strajec Admin</title></Helmet>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm">{error}</div>
      )}

      <div className="space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Unread Leads</p>
            <p className="text-3xl font-extrabold text-navy mt-2">
              {loading ? <span className="w-8 h-8 inline-block border-2 border-navy border-t-transparent rounded-full animate-spin" /> : unreadCount}
            </p>
            <div className="absolute right-4 bottom-4 w-8 h-8 bg-navy/5 text-navy rounded-full flex items-center justify-center font-bold text-xs">!</div>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Total Inquiries</p>
            <p className="text-3xl font-extrabold text-navy mt-2">
              {loading ? <span className="w-8 h-8 inline-block border-2 border-navy border-t-transparent rounded-full animate-spin" /> : totalLeads}
            </p>
            <div className="absolute right-4 bottom-4 w-8 h-8 bg-navy/5 text-navy rounded-full flex items-center justify-center font-bold text-xs">💬</div>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Real-Time Active</p>
            <p className="text-3xl font-extrabold text-emerald-500 mt-2 flex items-center gap-2">
              {loadingAnalytics ? <span className="w-8 h-8 inline-block border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /> : analytics.realtimeUsers}
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            </p>
            <Users className="absolute right-4 bottom-4 w-5 h-5 text-emerald-500/20" />
          </div>

          <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">30-Day Views</p>
            <p className="text-3xl font-extrabold text-navy mt-2">
              {loadingAnalytics ? <span className="w-8 h-8 inline-block border-2 border-navy border-t-transparent rounded-full animate-spin" /> : analytics.totalViews}
            </p>
            <Eye className="absolute right-4 bottom-4 w-5 h-5 text-navy/20" />
          </div>
        </div>

        {/* Analytics Section with SVG Custom Chart */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-navy flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gold" />
                Traffic & Audience overview
              </h3>
              <p className="text-xs text-[#6B7280]">Daily page views and unique visitors (Last 30 Days)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-navy">
                <span className="w-3 h-1.5 bg-[#013582] rounded" /> Pageviews
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-gold">
                <span className="w-3 h-1.5 bg-[#F4CF31] rounded" /> Visitors
              </div>
            </div>
          </div>

          {loadingAnalytics ? (
            <div className="h-[200px] w-full flex items-center justify-center bg-slate-50/50 rounded-xl">
              <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <div className="min-w-[600px] h-[190px]">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible select-none">
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                    const y = height - padding - ratio * (height - padding * 2);
                    return (
                      <g key={i}>
                        <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#F3F4F6" strokeWidth={1} />
                        <text x={padding - 8} y={y + 3} textAnchor="end" className="text-[9px] fill-[#9CA3AF] font-mono">
                          {Math.round(ratio * maxVal)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Dates X axis */}
                  {chartPoints.map((p, idx) => {
                    // Render date labels for start, mid-point, and end to keep it clean
                    const showLabel = idx === 0 || idx === Math.round(chartPoints.length / 2) || idx === chartPoints.length - 1;
                    if (!showLabel) return null;
                    return (
                      <text key={idx} x={pointsX(idx)} y={height - 8} textAnchor="middle" className="text-[10px] fill-[#9CA3AF] font-mono">
                        {p.date}
                      </text>
                    );
                  })}

                  {/* Lines */}
                  {chartPoints.length > 1 && (
                    <>
                      {/* Pageviews Line */}
                      <path d={`M ${pageviewsPath}`} fill="none" stroke="#013582" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                      {/* Visitors Line */}
                      <path d={`M ${visitorsPath}`} fill="none" stroke="#F4CF31" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    </>
                  )}

                  {/* Data Circles (Latest Point Only for hover emphasis) */}
                  {chartPoints.length > 0 && (
                    <g>
                      <circle cx={pointsX(chartPoints.length - 1)} cy={pointsY(chartPoints[chartPoints.length - 1].Pageviews)} r={4} fill="#013582" stroke="#FFF" strokeWidth={1.5} />
                      <circle cx={pointsX(chartPoints.length - 1)} cy={pointsY(chartPoints[chartPoints.length - 1].Visitors)} r={4} fill="#F4CF31" stroke="#FFF" strokeWidth={1.5} />
                    </g>
                  )}
                </svg>
              </div>
            </div>
          )}
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
