import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useOutletContext } from 'react-router-dom';
import { Eye, Users, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { token, backendUrl, onUnreadChange } = useOutletContext();
  const [leads, setLeads]             = useState([]);
  const [projects, setProjects]       = useState([]);
  const [analytics, setAnalytics]     = useState({ realtimeUsers: 0, totalViews: 0, totalUsers: 0, chartData: [] });
  const [period, setPeriod]           = useState('monthly'); // 'weekly', 'monthly', 'yearly'
  const [loading, setLoading]         = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [error, setError]             = useState('');

  useEffect(() => {
    const doFetch = () => {
      fetchAll();
      fetchAnalytics(period);
    };
    window.addEventListener('admin-refresh', doFetch);
    fetchAll();
    fetchAnalytics(period);
    return () => window.removeEventListener('admin-refresh', doFetch);
  }, [period]);

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

  const fetchAnalytics = async (selectedPeriod) => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch(`${backendUrl}/api/analytics/?period=${selectedPeriod}`, {
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

  // Dynamically load Chart.js and render the line chart
  const canvasRef = React.useRef(null);
  const chartInstanceRef = React.useRef(null);
  const [chartScriptLoaded, setChartScriptLoaded] = useState(false);

  useEffect(() => {
    if (window.Chart) {
      setChartScriptLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.async = true;
    script.onload = () => setChartScriptLoaded(true);
    document.head.appendChild(script);
    return () => {
      // Keep script loaded globally for tab switches
    };
  }, []);

  useEffect(() => {
    if (!chartScriptLoaded || !canvasRef.current || !analytics.chartData) return;

    // Destroy existing chart instance before recreation
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = analytics.chartData.map(p => p.date);
    const pageviews = analytics.chartData.map(p => p.Pageviews);
    const visitors = analytics.chartData.map(p => p.Visitors);

    const ctx = canvasRef.current.getContext('2d');
    
    // Create subtle gradient fills
    const pageviewGrad = ctx.createLinearGradient(0, 0, 0, 200);
    pageviewGrad.addColorStop(0, 'rgba(1, 53, 130, 0.15)');
    pageviewGrad.addColorStop(1, 'rgba(1, 53, 130, 0.0)');

    const visitorGrad = ctx.createLinearGradient(0, 0, 0, 200);
    visitorGrad.addColorStop(0, 'rgba(244, 207, 49, 0.15)');
    visitorGrad.addColorStop(1, 'rgba(244, 207, 49, 0.0)');

    chartInstanceRef.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Pageviews',
            data: pageviews,
            borderColor: '#013582',
            backgroundColor: pageviewGrad,
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointRadius: period === 'yearly' ? 3 : 1.5,
            pointHoverRadius: 6,
            pointBackgroundColor: '#013582',
          },
          {
            label: 'Visitors',
            data: visitors,
            borderColor: '#F4CF31',
            backgroundColor: visitorGrad,
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointRadius: period === 'yearly' ? 3 : 1.5,
            pointHoverRadius: 6,
            pointBackgroundColor: '#F4CF31',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // We use our custom legend to match the design aesthetics
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            padding: 10,
            cornerRadius: 12,
            backgroundColor: '#0F172A',
            titleColor: '#F8FAFC',
            bodyColor: '#E2E8F0',
            borderColor: '#334155',
            borderWidth: 1,
            titleFont: { weight: 'bold', size: 11 },
            bodyFont: { size: 11 }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#9CA3AF',
              font: { size: 9, family: 'monospace' },
              maxTicksLimit: period === 'weekly' ? 7 : 12
            }
          },
          y: {
            grid: { color: '#F3F4F6' },
            border: { dash: [4, 4] },
            ticks: {
              color: '#9CA3AF',
              font: { size: 9, family: 'monospace' },
              precision: 0
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartScriptLoaded, analytics.chartData, period]);

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-navy flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gold" />
                Traffic & Audience overview
              </h3>
              <p className="text-xs text-[#6B7280]">
                {period === 'weekly' && 'Daily page views and unique visitors (Last 7 Days)'}
                {period === 'monthly' && 'Daily page views and unique visitors (Last 30 Days)'}
                {period === 'yearly' && 'Monthly page views and unique visitors (Last 12 Months)'}
              </p>
            </div>
            
            {/* Filter segments */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="bg-[#F3F4F6] p-0.5 rounded-xl inline-flex">
                {[
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'yearly', label: 'Yearly' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPeriod(opt.value)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      period === opt.value
                        ? 'bg-white text-navy shadow-sm'
                        : 'text-[#6B7280] hover:text-navy'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
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
          </div>

          {loadingAnalytics ? (
            <div className="h-[220px] w-full flex items-center justify-center bg-slate-50/50 rounded-xl">
              <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="relative w-full h-[220px]">
              <canvas ref={canvasRef} />
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
                    <span className={`text-[0.7rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${lead.is_read ? 'bg-gray-100 text-gray-400' : 'bg-navy/10 text-navy'}`}>
                      {lead.is_read ? 'Read' : 'Unread'}
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
