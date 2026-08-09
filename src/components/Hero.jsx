import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight, Zap, CheckCircle2, TrendingUp, Star,
  Globe, Code2, MousePointer, Activity, BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

/* ─── Floating card data ─── */
const cardLeft = {
  top: {
    label: 'Project Status',
    status: 'Live & Optimised',
    score: 99,
    items: ['React', 'Node.js', 'PostgreSQL'],
  },
  bottom: {
    title: 'Scalable Growth',
    body: 'Future-proof architecture built to grow with your business.',
    badge: 'Engineering',
  },
};

const cardRight = {
  top: {
    title: 'Client Satisfaction',
    stars: 5,
    quote: 'Delivered in 10 days — absolutely stunning.',
    author: 'Marites C.',
  },
  bottom: {
    metrics: [
      { label: 'Projects',   val: '60+' },
      { label: 'Retention',  val: '97%' },
      { label: 'Page Speed', val: 'A+' },
    ],
  },
};

export default function Hero() {
  const [isAuto, setIsAuto]     = useState(true);
  const [mounted, setMounted]   = useState(false);
  const sectionRef = useRef(null);

  // Entrance animation trigger
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useReveal(sectionRef, { threshold: 0.03, staggerDelay: 90 });

  const fadeIn = (delay = 0) => ({
    opacity:   mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                 transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  });

  return (
    <>
      <Helmet>
        <title>Home | Strajec — Digital Solutions for Locals</title>
        <meta
          name="description"
          content="Strajec helps local businesses get online with beautiful, affordable websites. Trusted by small businesses in Caraga and beyond."
        />
      </Helmet>

      <section
        id="home"
        ref={sectionRef}
        className="relative min-h-[96vh] flex flex-col overflow-hidden bg-snow"
      >
        {/* ── Background layers ── */}
        {/* Subtle dot grid */}
        <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />

        {/* Gold ambient glow — bottom right */}
        <div
          className="absolute bottom-0 right-0 w-[700px] h-[700px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 80% 80%, rgba(244,207,49,0.13) 0%, transparent 65%)',
          }}
        />
        {/* Navy ambient glow — top left */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 20% 20%, rgba(1,53,130,0.07) 0%, transparent 65%)',
          }}
        />

        {/* ── Centre content ── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-8">

          {/* ── Headline with inline toggle ── */}
          <div style={fadeIn(120)} className="max-w-4xl text-center mb-7 px-2">
            <h1 className="h1 text-navy">
              Your business{' '}
              {isAuto ? 'deserves a website' : 'needs customers'}
              <br className="hidden sm:block" />{' '}
              that {isAuto ? 'people will love' : 'find you online'}{' '}
              <span className="inline-flex items-center align-middle mx-1">
                <button
                  onClick={() => setIsAuto(!isAuto)}
                  data-cursor="switch"
                  aria-label="Toggle hero mode"
                  className="relative inline-flex w-[4.5rem] h-9 bg-navy hover:bg-navy-light rounded-full p-1 transition-all duration-300 border-2 border-gold/30 items-center shadow-md"
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-transform duration-300 ${
                    isAuto ? 'bg-gold translate-x-7' : 'bg-white translate-x-0'
                  }`}>
                    {isAuto ? (
                      <ArrowRight className="w-3.5 h-3.5 text-navy -rotate-45" />
                    ) : (
                      <Activity className="w-3.5 h-3.5 text-navy" />
                    )}
                  </span>
                </button>
              </span>{' '}
              {isAuto ? '— we build it.' : '— we make it happen.'}
            </h1>
          </div>

          {/* Sub-copy */}
          <div style={fadeIn(220)} className="max-w-2xl text-center mb-10 px-4">
            <p className="body-lg text-[#4A5568]">
              We build fast, professional websites for local businesses — shops, restaurants, clinics, and more. No tech skills needed. You run the business, we run the website.
            </p>
          </div>

          {/* CTAs */}
          <div style={fadeIn(320)} className="flex flex-col sm:flex-row items-center gap-3 mb-16">
            <Link
              to="/contact"
              data-cursor="let's talk"
              className="btn-primary group text-sm px-8 py-3.5"
            >
              Get a free quote
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/projects"
              data-cursor="view"
              className="btn-outline text-sm px-8 py-3.5"
            >
              See websites we made
            </Link>
          </div>

          {/* ── Floating cards — large screens only ── */}
          <div className="hidden xl:block">

            {/* ── LEFT TOP: Website speed card ── */}
            <div
              style={{ ...fadeIn(500), animationDelay: '500ms' }}
              className="absolute top-[18%] left-[4%] w-56 bg-white rounded-2xl border border-[#E5E7EB] shadow-card-hover p-4 animate-float"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="section-index">Website Speed</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              {/* Score ring */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                    <circle
                      cx="20" cy="20" r="16" fill="none"
                      stroke="#F4CF31" strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${(99 / 100) * 100} 100`}
                      pathLength="100"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-display font-black text-[0.7rem] text-navy">99</span>
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-navy">Loads Fast</p>
                  <p className="section-index mt-0.5">Customers won't wait</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {['Mobile-Ready', 'SEO-Friendly', 'Secure'].map(t => (
                  <span key={t} className="px-2 py-0.5 text-[9px] font-mono text-mid-grey bg-off-white border border-[#E5E7EB] rounded-full">{t}</span>
                ))}
              </div>
            </div>

            {/* ── LEFT BOTTOM: Growth card ── */}
            <div
              style={{ ...fadeIn(650), animation: 'float 9s ease-in-out 1.5s infinite' }}
              className="absolute bottom-[18%] left-[4%] w-52 bg-white rounded-2xl border border-[#E5E7EB] shadow-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-gold/15 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-gold-dark" />
                </div>
                <span className="font-display font-bold text-xs text-navy">More Customers</span>
              </div>
              {/* Mini bar chart */}
              <div className="flex items-end gap-1 h-10 mb-2">
                {[40, 60, 45, 80, 65, 90, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-all duration-500"
                    style={{
                      height: `${h}%`,
                      background: i === 6 ? '#013582' : i === 5 ? '#0B4DB5' : '#E5E7EB',
                    }}
                  />
                ))}
              </div>
              <p className="text-[10px] text-mid-grey">Your website works 24/7 to bring in new clients.</p>
            </div>

            {/* ── RIGHT TOP: Review card ── */}
            <div
              style={{ ...fadeIn(600), animation: 'float 8s ease-in-out 0.8s infinite' }}
              className="absolute top-[16%] right-[4%] w-60 bg-white rounded-2xl border border-[#E5E7EB] shadow-card-hover p-4"
            >
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="text-[0.72rem] text-[#3D4451] leading-relaxed mb-3 italic">
                "Ready in 10 days — our customers love it. We get more inquiries now than ever before."
              </blockquote>
              <div className="flex items-center gap-2 pt-2.5 border-t border-[#E5E7EB]">
                <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                  <span className="text-[0.6rem] font-black text-white">MC</span>
                </div>
                <div>
                  <p className="text-[0.7rem] font-bold text-navy leading-none">Marites Calo</p>
                  <p className="section-index mt-0.5">Butuan Coffee Grind</p>
                </div>
              </div>
            </div>

            {/* ── RIGHT BOTTOM: Stats card ── */}
            <div
              style={{ ...fadeIn(750), animation: 'float 10s ease-in-out 2s infinite' }}
              className="absolute bottom-[18%] right-[4%] w-52 bg-navy rounded-2xl shadow-card-hover p-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-gold" />
                <span className="font-mono text-[0.6rem] text-white/50 tracking-widest uppercase">Trusted by businesses</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Websites built',   val: '60+' },
                  { label: 'Happy clients',     val: '97%' },
                  { label: 'Always on time',    val: '✓' },
                ].map(m => (
                  <div key={m.label} className="flex items-center justify-between">
                    <span className="text-white/50 text-[0.7rem]">{m.label}</span>
                    <span className="font-display font-black text-sm text-white">{m.val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-gold" />
                <span className="text-[0.6rem] text-gold font-mono">No hidden fees, ever</span>
              </div>
            </div>

          </div>

          {/* ── Mobile/tablet stat pills ── */}
          <div style={fadeIn(420)} className="xl:hidden flex flex-wrap justify-center gap-3 mb-4">
            {[
              { val: '60+', label: 'Websites built' },
              { val: '97%', label: 'Happy clients' },
              { val: '10d', label: 'Avg. delivery' },
              { val: '₱0',  label: 'Hidden fees' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-2 shadow-subtle">
                <span className="font-display font-black text-sm text-navy">{s.val}</span>
                <span className="section-index">{s.label}</span>
              </div>
            ))}
          </div>

        </div>

      </section>
    </>
  );
}
