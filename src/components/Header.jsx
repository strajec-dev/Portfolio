import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

const navLinks = [
  { name: 'Home',      to: '/' },
  { name: 'Work',      to: '/projects' },
  { name: 'Process',   to: '/process' },
  { name: 'Team',      to: '/team' },
  { name: 'Contact',   to: '/contact' },
];

export default function Header() {
  const [open,     setOpen]    = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const active = (p) => location.pathname === p;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-snow/90 backdrop-blur-md border-b border-[#E5E7EB] shadow-[0_1px_12px_rgba(0,0,0,0.05)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="Strajec">
            {/* Geometric mark */}
            <div className="relative w-7 h-7 flex-shrink-0">
              <div className="absolute inset-0 bg-navy rounded-md group-hover:rotate-12 transition-transform duration-300" />
              <img src="/Straject-logo.png" alt="Strajec" className="absolute inset-0 w-full h-full object-contain group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight text-navy leading-none">
              Strajec
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className={`nav-link px-3.5 py-2 text-[0.8rem] font-medium transition-colors duration-200 ${
                  active(link.to)
                    ? 'text-navy font-semibold'
                    : 'text-mid-grey hover:text-navy'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/contact"
              data-cursor="start"
              className="btn-primary text-[0.8rem] py-2.5 px-5"
            >
              Start a project
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg text-navy hover:bg-navy/5 transition"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-snow border-t border-[#E5E7EB] shadow-lg mobile-menu-enter">
          <nav className="container-wide py-5 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className={`px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active(link.to)
                    ? 'text-navy bg-navy/5 font-semibold'
                    : 'text-mid-grey hover:text-navy hover:bg-navy/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-1 border-t border-[#E5E7EB]">
              <Link
                to="/contact"
                className="btn-primary w-full justify-center text-sm"
              >
                Start a project <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
