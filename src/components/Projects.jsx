import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, ArrowRight } from 'lucide-react';
import o2MackDriveImg   from '../projects/O2MackDrive.png';
import etoileSauvageImg from "../projects/L'Étoile Sauvage.png";
import magCareImg       from '../projects/MagCare.png';
import laUnionImg       from '../projects/launion.png';
import fbsImg           from '../projects/fbs.png';

const categories = [
  { id: 'all',       name: 'All' },
  { id: 'websites',  name: 'Websites' },
  { id: 'webapps',   name: 'Web Apps' },
  { id: 'ecommerce', name: 'E-Commerce' },
];

const projects = [
  {
    id: 1,
    title: 'O2MackDrive',
    category: 'websites',
    desc: 'A clean car trading platform for Metro Manila — real inventory, trade-in services, and a no-pressure browsing experience.',
    tech: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://o2mackdrive-branding-gamma.vercel.app/',
    image: o2MackDriveImg,
  },
  {
    id: 2,
    title: "L'Étoile Sauvage",
    category: 'websites',
    desc: 'French-inspired fine dining — seasonal menus, ambiance photography, and reservation details.',
    tech: ['React', 'Node.js', 'Framer Motion'],
    liveUrl: 'https://restaurant-760u.onrender.com/',
    image: etoileSauvageImg,
  },
  {
    id: 3,
    title: 'MagCare',
    category: 'webapps',
    desc: 'Clinic appointment scheduling — patients book, reschedule, and manage visits with real-time availability.',
    tech: ['React', 'Node.js', 'Tailwind CSS'],
    liveUrl: 'https://clinic-appointment-pearl.vercel.app/',
    image: magCareImg,
  },
  {
    id: 4,
    title: 'La Union SHS Portal',
    category: 'webapps',
    desc: 'Document request management system for students and staff — submission, tracking, and pickup scheduling.',
    tech: ['React', 'Vite', 'Tailwind CSS'],
    liveUrl: 'https://mars-launion.vercel.app/',
    image: laUnionImg,
  },
  {
    id: 5,
    title: 'Flight Booking Platform',
    category: 'webapps',
    desc: 'Smart flight booking simulation with multi-step wizard, seat maps, ML-powered pricing, and QR boarding passes.',
    tech: ['Django', 'Python', 'PostgreSQL'],
    liveUrl: 'https://flight-booking-django.vercel.app/login',
    image: fbsImg,
  },
];

function useReveal(ref) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 80);
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
}

export default function Projects() {
  const [active, setActive] = useState('all');
  const ref = useRef(null);
  useReveal(ref);

  const filtered = active === 'all' ? projects : projects.filter(p => p.category === active);

  return (
    <>
      <Helmet>
        <title>Work | Strajec — Digital Studio Philippines</title>
        <meta name="description" content="Selected projects by Strajec — websites, web apps, and e-commerce stores built in Caraga, Philippines." />
      </Helmet>

      <section id="projects" ref={ref} className="section-block bg-snow">
        <div className="container-wide">

          {/* ── Header ── */}
          <div className="reveal grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end mb-12 pb-8 border-b border-[#E5E7EB]">
            <div>
              <p className="section-label mb-4">Selected work</p>
              <h2 className="h2 text-navy">Projects</h2>
            </div>
            {/* Filter */}
            <div className="flex items-center gap-1 bg-off-white border border-[#E5E7EB] rounded-full p-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-[0.75rem] font-semibold transition-all duration-200 ${
                    active === cat.id
                      ? 'bg-navy text-white shadow-sm'
                      : 'text-mid-grey hover:text-navy'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* ── Project grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <div
                key={project.id}
                className={`reveal reveal-delay-${Math.min(i + 1, 4)} card group flex flex-col overflow-hidden`}
              >
                {/* Screenshot */}
                <div className="relative aspect-[16/10] overflow-hidden bg-off-white">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-500 ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center font-display font-black text-4xl text-navy/10">
                      {project.title[0]}
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-navy/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="open"
                      className="flex items-center gap-2 bg-white text-navy text-xs font-bold px-5 py-2.5 rounded-full hover:bg-gold transition-colors duration-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View live
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-display font-bold text-base text-navy leading-tight">{project.title}</h3>
                    <span className="section-index flex-shrink-0 pt-0.5">{project.category}</span>
                  </div>
                  <p className="body-sm mb-5 flex-1">{project.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span key={t} className="px-2.5 py-1 text-[10px] font-mono text-mid-grey bg-off-white border border-[#E5E7EB] rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
