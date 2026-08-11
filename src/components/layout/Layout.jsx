import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { MessageSquare, X } from 'lucide-react';


export default function Layout() {
  const [showBadge, setShowBadge] = useState(true);
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
    } else if (pathname === '/') {
      // Do not force scroll to top on other pages if clicking hash, but go to top on plain home page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [hash, pathname]);


  return (
    <div className="relative min-h-screen bg-snow font-sans text-ink overflow-x-hidden">
      <Header />

      <main className="w-full">
        <Outlet />
      </main>
      <Footer />

      {/* ── Floating CTA bubble ── */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-2.5 z-50 select-none">
        {showBadge && (
          <div className="flex items-center gap-2 bg-white text-navy/70 text-[0.65rem] font-mono font-medium tracking-wide px-3 py-2 rounded-full shadow-card border border-[#E5E7EB]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available now
            <button
              onClick={() => setShowBadge(false)}
              className="ml-1 text-mid-grey hover:text-navy transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <Link
          to="/contact"
          data-cursor="let's talk"
          className="w-13 h-13 w-[52px] h-[52px] bg-navy text-white rounded-full flex items-center justify-center hover:-translate-y-1 hover:bg-navy-light shadow-card transition-all duration-300"
          aria-label="Start a project"
        >
          <MessageSquare className="w-5 h-5" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
