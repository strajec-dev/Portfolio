import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LogOut, LayoutDashboard, Inbox, FolderKanban,
  ChevronRight, ChevronLeft
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', label: 'Overview',  icon: LayoutDashboard },
  { to: '/admin/leads',     label: 'Leads',      icon: Inbox,           badge: true },
  { to: '/admin/projects',  label: 'Projects',   icon: FolderKanban },
];

export default function AdminSidebar({ isOpen, setIsOpen, unreadLeadsCount, username, onLogout }) {
  return (
    <aside
      className={`bg-white border-r border-[#E5E7EB] fixed inset-y-0 left-0 z-50 transform ${
        isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'
      } transition-all duration-200 ease-in-out md:static md:translate-x-0 ${
        isOpen ? 'md:w-64' : 'md:w-20 md:px-2'
      } flex flex-col justify-between overflow-x-hidden`}
    >
      {/* ── Top: Brand + Nav ── */}
      <div className="flex-1">

        {/* Brand Header */}
        <div
          className={`h-16 border-b border-[#E5E7EB] flex items-center justify-between ${
            isOpen ? 'px-6' : 'px-2 justify-center gap-1'
          }`}
        >
          {isOpen ? (
            <>
              <span className="font-display font-bold text-lg tracking-tight whitespace-nowrap">
                Strajec Studio
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-[#6B7280] hover:text-navy transition-colors"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <div
                className="w-9 h-9 bg-navy/5 text-navy font-bold rounded-xl flex items-center justify-center text-base"
                title="Strajec"
              >
                <img src="/Straject-logo.png" alt="Strajec Logo" className="w-6 h-6 object-contain" />
              </div>
              <button
                onClick={() => setIsOpen(true)}
                className="p-1 hover:bg-slate-100 rounded-lg text-[#6B7280] hover:text-navy transition-colors"
                title="Expand Sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Nav Menu */}
        <nav className={`p-4 space-y-2 ${isOpen ? '' : 'flex flex-col items-center'}`}>
          {navItems.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              className={({ isActive }) =>
                `flex items-center rounded-xl text-sm font-semibold transition-all duration-150 relative ${
                  isOpen ? 'w-full px-4 py-3' : 'w-12 h-12 justify-center'
                } ${
                  isActive
                    ? 'bg-navy/5 text-navy'
                    : 'text-[#4B5563] hover:bg-slate-50 hover:text-navy'
                }`
              }
            >
              <div className={`flex items-center ${isOpen ? 'gap-3 flex-1' : 'justify-center'}`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span className="whitespace-nowrap">{label}</span>}
              </div>
              {badge && unreadLeadsCount > 0 && (
                <span
                  className={`bg-navy text-white rounded-full font-bold ${
                    isOpen
                      ? 'text-[0.7rem] px-2 py-0.5'
                      : 'absolute top-1.5 right-1.5 w-4 h-4 text-[0.55rem] flex items-center justify-center'
                  }`}
                >
                  {unreadLeadsCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ── Bottom: User + Logout ── */}
      <div
        className={`p-4 border-t border-[#E5E7EB] bg-slate-50/50 flex flex-col items-center ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        {isOpen ? (
          <div className="flex items-center justify-between w-full">
            <div className="min-w-0">
              <p className="text-xs text-[#6B7280]">Logged in as</p>
              <p className="text-sm font-bold text-navy truncate">{username}</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-[#EF4444] hover:bg-red-50 rounded-xl transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            className="w-12 h-12 flex items-center justify-center text-[#EF4444] hover:bg-red-50 rounded-xl transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
}
