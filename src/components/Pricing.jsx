import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const tiers = [
  {
    name: 'Student',
    price: 'Negotiable',
    sub: 'Let\'s talk about a fair deal',
    description: 'For students and graduates building academic or personal projects.',
    features: ['Up to 3 pages', 'Mobile responsive', 'Basic contact form', 'Flexible payments', 'Mentorship included'],
    cta: 'Inquire now',
    featured: false,
  },
  {
    name: 'Starter',
    price: '₱8K – ₱15K',
    sub: '1-week delivery',
    description: 'For local businesses, portfolios, and landing pages entering the digital space.',
    features: ['1–5 responsive pages', 'Contact forms', 'Social integrations', '1-week delivery', 'Basic SEO'],
    cta: 'Get started',
    featured: false,
  },
  {
    name: 'Business',
    price: '₱20K – ₱40K',
    sub: '2-week delivery',
    description: 'For growing companies needing content management, blogs, or custom CMS integrations.',
    features: ['Up to 10 pages', 'CMS included', 'Full SEO setup', 'Speed optimisation', 'Analytics', '1 month free support'],
    cta: 'Most popular',
    featured: true,
  },
  {
    name: 'Premium',
    price: '₱50K – ₱80K',
    sub: '3–4 week delivery',
    description: 'For enterprise workflows — e-commerce, booking panels, and fully custom systems.',
    features: ['Unlimited pages', 'E-Commerce', 'Booking / scheduling', 'Custom databases', 'Priority support'],
    cta: 'Go premium',
    featured: false,
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

export default function Pricing() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <>
      <Helmet>
        <title>Pricing | Strajec — Digital Studio Philippines</title>
        <meta name="description" content="Transparent pricing from Strajec. Packages from ₱8,000 for starter websites up to ₱80,000 for premium e-commerce solutions." />
      </Helmet>

      <section id="pricing" ref={ref} className="section-block bg-snow">
        <div className="container-wide">

          {/* ── Header ── */}
          <div className="reveal mb-16 pb-8 border-b border-[#E5E7EB]">
            <p className="section-label mb-4">Transparent pricing</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <h2 className="h2 text-navy">Budget estimates</h2>
              <p className="body-sm max-w-xs">
                Fixed packages, no hidden fees,<br />no recurring lock-ins.
              </p>
            </div>
          </div>

          {/* ── Pricing grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {tiers.map((tier, i) => (
              <div
                key={tier.name}
                className={`reveal reveal-delay-${Math.min(i + 1, 4)} relative flex flex-col rounded-2xl p-7 border transition-all duration-300 ${
                  tier.featured
                    ? 'bg-navy text-white border-navy shadow-[0_4px_40px_rgba(1,53,130,0.25)]'
                    : 'bg-white border-[#E5E7EB] hover:border-navy/30 hover:shadow-card-hover'
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-gold text-navy text-[0.65rem] font-bold font-mono uppercase tracking-widest px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <p className={`section-index mb-3 ${tier.featured ? 'text-white/50' : ''}`}>{tier.name}</p>
                  <p className={`font-display font-black text-2xl mb-0.5 ${tier.featured ? 'text-white' : 'text-navy'}`}>
                    {tier.price}
                  </p>
                  <p className={`text-[0.7rem] font-mono ${tier.featured ? 'text-gold' : 'text-gold-dark'} mb-4`}>
                    {tier.sub}
                  </p>
                  <p className={`text-sm leading-relaxed ${tier.featured ? 'text-white/70' : 'text-mid-grey'}`}>
                    {tier.description}
                  </p>
                </div>

                <div className={`h-px mb-6 ${tier.featured ? 'bg-white/10' : 'bg-[#E5E7EB]'}`} />

                <ul className="space-y-2.5 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check
                        className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${tier.featured ? 'text-gold' : 'text-navy'}`}
                        strokeWidth={2.5}
                      />
                      <span className={`text-sm ${tier.featured ? 'text-white/80' : 'text-[#3D4451]'}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  data-cursor="quote"
                  className={`mt-auto block w-full text-center py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                    tier.featured
                      ? 'bg-gold text-navy hover:bg-gold-light'
                      : 'border border-navy/20 text-navy hover:bg-navy hover:text-white'
                  }`}
                >
                  {tier.cta} →
                </Link>
              </div>
            ))}
          </div>

          {/* ── Maintenance note ── */}
          <div className="reveal mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-off-white border border-[#E5E7EB]">
            <div>
              <p className="font-display font-bold text-navy mb-1">Monthly Maintenance Plan</p>
              <p className="body-sm">Updates, backups, security sweeps, and content edits — from <strong className="text-navy">₱1,500/month</strong>.</p>
            </div>
            <Link to="/contact" data-cursor="add-on" className="btn-outline flex-shrink-0 text-sm py-2.5 px-5">
              Learn more <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
