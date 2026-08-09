import React, { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, MessagesSquare, Compass, Code2, Rocket, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const steps = [
  {
    num: '01',
    title: 'Consult',
    body: 'We listen to your objectives, evaluate target users, map required functionalities, and lock down project scope before writing code.',
    icon: MessagesSquare,
    deliverables: ['Custom system blueprint', 'Detailed technical specs', 'Fixed price quote & timeline'],
  },
  {
    num: '02',
    title: 'Design',
    body: 'We design responsive layout grids, select custom typography systems, and construct high-fidelity interactive mockups.',
    icon: Compass,
    deliverables: ['Interactive design prototype', 'Visual design tokens', 'Mobile & tablet UI layouts'],
  },
  {
    num: '03',
    title: 'Build',
    body: 'Clean, production-grade custom engineering using React, Tailwind CSS, and robust backend APIs. Zero bloated templates.',
    icon: Code2,
    deliverables: ['Responsive codebase (GitHub)', 'A+ PageSpeed performance', 'Secure database integrations'],
  },
  {
    num: '04',
    title: 'Launch',
    body: 'Domain name mapping, DNS configurations, SSL certificate routing, and pre-launch quality assurance testing.',
    icon: Rocket,
    deliverables: ['Live domain routing (HTTPS)', 'Automated cloud backups', 'Pre-launch QA review report'],
  },
  {
    num: '05',
    title: 'Support',
    body: 'Ongoing speed checks, visual adjustments, plugin updates, database backups, and monthly content revisions.',
    icon: HeartHandshake,
    deliverables: ['Uptime monitoring setup', 'Monthly security updates', 'Priority technical support'],
  },
];


export default function Process() {
  const ref = useRef(null);
  useReveal(ref, { threshold: 0.05 });

  return (
    <>
      <Helmet>
        <title>Process | Strajec — Digital Studio Philippines</title>
        <meta name="description" content="How Strajec works — from consultation through design, build, launch, and ongoing support." />
      </Helmet>

      <section id="process" ref={ref} className="section-block bg-off-white">
        <div className="container-wide">

          {/* ── Header ── */}
          <div className="reveal grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end mb-16 pb-8 border-b border-[#E5E7EB]">
            <div>
              <p className="section-label mb-4">How we work</p>
              <h2 className="h2 text-navy">Our process</h2>
            </div>
            <p className="body-sm max-w-xs text-right hidden lg:block">
              A transparent, step-by-step methodology<br />to deliver absolute quality.
            </p>
          </div>

          {/* ── Steps timeline ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative">
            {/* Visual connector line for large screens */}
            <div className="hidden lg:block absolute top-[44px] left-[5%] right-[5%] h-0.5 bg-[#E5E7EB] z-0" />

            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.num}
                  className={`reveal reveal-delay-${Math.min(i + 1, 4)} relative z-10 flex flex-col`}
                >
                  {/* Icon step indicator */}
                  <div className="flex lg:flex-col items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full border-2 border-[#E5E7EB] bg-white flex items-center justify-center text-navy shadow-sm group-hover:border-navy transition-all duration-300">
                      <Icon className="w-5 h-5 text-navy" />
                    </div>
                    <span className="font-mono text-xs font-bold text-gold-dark tracking-widest uppercase">
                      Phase {s.num}
                    </span>
                  </div>

                  {/* Card content */}
                  <div className="card flex-1 flex flex-col p-6 bg-white">
                    <h3 className="font-display font-black text-lg text-navy mb-2">
                      {s.title}
                    </h3>
                    <p className="body-sm text-[0.78rem] leading-relaxed mb-6 flex-1">
                      {s.body}
                    </p>

                    {/* Deliverables panel */}
                    <div className="mt-auto bg-off-white/80 border border-[#E5E7EB] rounded-xl p-4 text-left">
                      <p className="font-mono text-[0.62rem] font-bold text-mid-grey tracking-wider uppercase mb-2">
                        Deliverables:
                      </p>
                      <ul className="space-y-1.5">
                        {s.deliverables.map((item) => (
                          <li key={item} className="flex items-start gap-1.5 text-[0.7rem] text-navy font-medium leading-tight">
                            <CheckCircle2 className="w-3.5 h-3.5 text-gold-dark shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── CTA ── */}
          <div className="reveal mt-16 pt-10 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <p className="font-display font-bold text-xl text-navy">
              Ready to begin?
            </p>
            <Link to="/contact" data-cursor="start" className="btn-primary">
              Start a project <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
