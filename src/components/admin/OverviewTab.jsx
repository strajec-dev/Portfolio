import React from 'react';
import { STATUS_OPTIONS } from './adminConstants';

export default function OverviewTab({ leads, projects, loadingLeads, setActiveTab }) {
  const unreadLeadsCount = leads.filter((l) => !l.is_read).length;
  const totalLeadsCount = leads.length;
  const totalProjectsCount = projects.length;

  return (
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
                  <span className={`text-[0.7rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${!lead.is_read ? 'bg-navy/10 text-navy' : 'bg-gray-100 text-gray-400'}`}>
                    {lead.is_read ? 'Read' : 'Unread'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
