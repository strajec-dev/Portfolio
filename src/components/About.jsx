import React, { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

const values = [
  {
    num: '01',
    title: 'Fair Pricing',
    body: 'We don\'t have office rent or corporate overhead to pay, so we keep our prices friendly and affordable for local shops.',
  },
  {
    num: '02',
    title: 'Hungry to Learn',
    body: 'Every website we build is a chance to sharpen our skills, write clean code, and prove what fresh IT graduates can deliver.',
  },
  {
    num: '03',
    title: 'Zero Catch',
    body: 'You own the website, the domain, and the hosting. We set it up under your name so you keep full control forever.',
  },
  {
    num: '04',
    title: 'Local & Friendly',
    body: 'We live in Caraga. No complex tech jargon — just a group of friends working hard to build something you\'ll be proud to show.',
  },
];

const stats = [
  { value: '97%',  label: 'Client retention' },
  { value: '100%', label: 'On-time delivery' },
  { value: 'A+',   label: 'Avg. PageSpeed score' },
  { value: '15+',  label: 'Years combined exp.' },
];



export default function About() {
  const ref = useRef(null);
  useReveal(ref);

  return (
      <section id="about" ref={ref} className="section-block bg-snow">
        <div className="container-wide">

          {/* ── Header ── */}
          <div className="reveal grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end mb-20 pb-8 border-b border-[#E5E7EB]">
            <div>
              <p className="section-label mb-4">About Strajec</p>
              <h2 className="h2 text-navy">
                No fancy studio.<br />
                Just code, coffee, and a goal.
              </h2>
            </div>
            <Link to="/team" data-cursor="team" className="btn-outline self-end whitespace-nowrap">
              Meet the friends <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* ── Story + Stats ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
            {/* Story */}
            <div className="reveal reveal-left reveal-delay-1 space-y-6">
              <p className="text-[1.125rem] text-[#1E2A3B] leading-[1.8] font-light">
                <strong className="font-bold text-navy">Strajec</strong> isn’t a corporate agency. We are simply a group of close friends and fresh <strong className="font-bold text-navy">BSIT (Information Technology)</strong> graduates based in Caraga, Philippines. 
              </p>
              <p className="body-lg">
                With no fancy office or studio space, we gather around a table in one of our houses, boot up our laptops, and build websites together. Our goal is to gain hands-on experience, learn new technologies every day, and help local businesses get online without the heavy agency tag.
              </p>
              <p className="body-lg">
                Every website we take on is our chance to write clean code, study best design practices, and prove our capabilities. By working with us, you get a modern, affordable website, and you help a team of local graduates kickstart their careers in tech.
              </p>
            </div>

            {/* Stats */}
            <div className="reveal reveal-right reveal-delay-2 grid grid-cols-2 gap-px bg-[#E5E7EB] border border-[#E5E7EB] rounded-2xl overflow-hidden">
              {stats.map((s) => (
                <div key={s.label} className="bg-snow p-8 flex flex-col justify-between">
                  <span className="font-display font-black text-4xl text-navy mb-2">{s.value}</span>
                  <span className="section-index">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Values ── */}
          <div className="reveal reveal-delay-2">
            <p className="section-label mb-10">Our principles</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {values.map((v, i) => (
                <div key={v.num} className={`reveal reveal-delay-${i + 1}`}>
                  <div className="flex items-start gap-5">
                    <span className="section-index pt-0.5 flex-shrink-0">{v.num}</span>
                    <div>
                      <div className="gold-rule mb-3" />
                      <h3 className="font-display font-bold text-lg text-navy mb-2">{v.title}</h3>
                      <p className="body-sm">{v.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
  );
}
