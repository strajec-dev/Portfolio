import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Github, Facebook, Linkedin, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const nav = [
  { name: 'Services', to: '/#services' },
  { name: 'Work', to: '/projects' },
  { name: 'Process', to: '/process' },
  { name: 'Team', to: '/team' },
  { name: 'About', to: '/#about' },
  { name: 'FAQ', to: '/#faq' },
  { name: 'Contact', to: '/contact' },
];

const socials = [
  { Icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61592866436078', label: 'Facebook' },
  { Icon: Instagram, href: 'https://www.instagram.com/strajec.solutions/', label: 'Instagram' },
  { Icon: Github, href: 'https://github.com/strajec-dev', label: 'GitHub' },
  { Icon: Linkedin, href: 'https://www.linkedin.com/in/strajec-undefined-bb0305427/', label: 'LinkedIn' },
];

export default function Footer() {
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-navy-dark text-white">

      {/* Gold top rule */}
      <div className="h-[3px] w-full bg-gold" />

      <div className="container-wide pt-20 pb-10">

        {/* ── Top: wordmark + nav + cta ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-16 pb-16 border-b border-white/8">

          {/* Brand */}
          <div className="space-y-6 max-w-xs">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="relative w-8 h-8">
                <img src="/Straject-logo.png" alt="Strajec" className="absolute inset-0 w-full h-full object-contain group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="font-display font-black text-xl text-white group-hover:text-gold transition-colors">Strajec</span>
            </Link>

            <p className="text-white/45 text-sm leading-relaxed">
              A digital studio crafting exceptional websites and web applications for ambitious brands across the Philippines.
            </p>

            <div className="space-y-2.5">
              {[
                { Icon: MapPin, text: 'Magallanes, Agusan del Norte, Caraga' },
                { Icon: Mail, text: 'strajec.solutions@gmail.com' },
                { Icon: Phone, text: '+63 994 100 6573' },
              ].map(({ Icon, text }, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Icon className="w-3.5 h-3.5 text-gold/60 mt-0.5 flex-shrink-0" />
                  <span className="text-white/40 text-xs">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor={label.toLowerCase()}
                  className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:border-gold/40 hover:text-gold transition-all duration-200"
                  aria-label={label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-mono text-label font-medium text-white/25 tracking-[0.14em] uppercase mb-5">Navigation</p>
            <ul className="space-y-3">
              {nav.slice(0, 4).map((link) => (
                <li key={link.name}>
                  <Link to={link.to} className="text-white/50 text-sm hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-label font-medium text-white/25 tracking-[0.14em] uppercase mb-5 opacity-0 pointer-events-none select-none">_</p>
            <ul className="space-y-3">
              {nav.slice(4).map((link) => (
                <li key={link.name}>
                  <Link to={link.to} className="text-white/50 text-sm hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Strajec. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <span className="text-white/25 text-xs">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2 align-middle" />
              Accepting new clients
            </span>
            <button
              onClick={toTop}
              data-cursor="top"
              className="flex items-center gap-1.5 text-white/40 text-xs hover:text-gold transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" /> Top
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
