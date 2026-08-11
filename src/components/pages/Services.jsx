import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Monitor, ShoppingBag, Code2, CalendarRange,
  Sparkles, Settings, GraduationCap, ArrowRight,
  CheckCircle2, Clock, Tag, Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useReveal';

const services = [
  {
    num: '01',
    title: 'Business & E-Commerce Websites',
    description: 'Perfect for local shops, cafes, and retailers wanting a professional presence or to sell products online.',
    icon: Monitor,
    delivery: '7–21 days',
    features: [
      'Mobile-ready design & local SEO',
      'Google Maps & contact form setup',
      'GCash, PayMaya & Card payments',
      'Product inventory management'
    ],
    target: 'Restaurants, Retail Shops, Clinics, Clothing Brands'
  },
  {
    num: '02',
    title: 'Booking & Scheduling Systems',
    description: 'Let customers book appointments or reserve tables directly from your website 24/7.',
    icon: CalendarRange,
    delivery: '10–14 days',
    features: [
      'Interactive online booking calendar',
      'Automated email/SMS confirmation reminders',
      'Staff schedule management panel',
      'Optional downpayment collection integration'
    ],
    target: 'Barbershops, Salons, Pet Grooming, Hotels, Tutors'
  },
  {
    num: '03',
    title: 'Landing Pages',
    description: 'A single-page website tailored to promote one specific product, event, or special local promotion.',
    icon: Sparkles,
    delivery: '3–5 days',
    features: [
      'High-converting call-to-action layout',
      'Lead capture form with Google Sheet sync',
      'Facebook Pixel & Analytics integration',
      'Ultra-fast page load speeds'
    ],
    target: 'Real estate agents, Event organizers, Product launches'
  },
  {
    num: '04',
    title: 'Website Maintenance',
    description: 'Keep your website secure, fast, and up-to-date while you focus on running your business.',
    icon: Settings,
    delivery: 'Monthly support',
    features: [
      'Regular backups of your site files',
      'Security checks & hacker prevention',
      'Monthly text/image content updates',
      '24/7 site uptime monitoring'
    ],
    target: 'Busy business owners who do not want to manage tech'
  },
  {
    num: '05',
    title: 'Academic & Capstone Projects',
    description: 'Need a working system for your thesis or capstone? We build fully functional web systems with clean code.',
    icon: GraduationCap,
    delivery: 'Depends on scope',
    features: [
      'Custom database and login system',
      'Complete, bug-free project walkthrough',
      'Full deployment assistance',
      'Student-friendly terms'
    ],
    target: 'BSIT, BSCS, and College students in Caraga'
  },
  {
    num: '06',
    title: 'Hardware & IoT (Arduino)',
    description: 'Custom hardware prototypes and smart automation solutions using Arduino and microcontrollers.',
    icon: Cpu,
    delivery: 'Depends on scope',
    features: [
      'Custom circuit design & wiring',
      'Arduino programming & sensors',
      'Hardware-software integration',
      'Prototyping and testing'
    ],
    target: 'Inventors, students, and businesses needing automation'
  },
];

export default function Services() {
  const ref = useRef(null);
  useReveal(ref, { threshold: 0.04 });

  return (
      <section id="services" ref={ref} className="section-block bg-off-white">
        <div className="container-wide">

          {/* ── Header ── */}
          <div className="reveal mb-16 pb-10 border-b border-[#E5E7EB]">
            <p className="section-label mb-4">How we help you</p>
            <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
              <div>
                <h2 className="h2 text-navy max-w-lg mb-4">Our services & packages</h2>
                <p className="body-lg text-navy/80 font-medium">Simple packages. Built for local businesses.</p>
              </div>
              <p className="body-sm max-w-sm lg:text-right text-[#4A5568] leading-relaxed">
                From stunning websites to custom Arduino hardware projects, we handle the tech so you can focus on running your business.
              </p>
            </div>
          </div>

          {/* ── Services Cards Layout ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.num}
                  className={`reveal reveal-scale reveal-delay-${Math.min(i + 1, 4)} group bg-white rounded-3xl border border-[#E5E7EB] hover:border-gold/60 p-8 transition-all duration-300 hover:shadow-card-hover flex flex-col justify-between relative`}
                >
                  <div>
                    {/* Header: Icon + Pricing Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-navy/5 group-hover:bg-gold/15 flex items-center justify-center transition-colors duration-300">
                        <Icon className="w-5 h-5 text-navy" strokeWidth={1.8} />
                      </div>
                      
                      {/* Cost and Time Info */}
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs font-mono font-bold text-mid-grey bg-off-white px-3.5 py-1.5 rounded-full border border-[#E5E7EB]">
                          <Clock className="w-3.5 h-3.5 text-mid-grey" />
                          {svc.delivery}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-black text-2xl text-navy mb-2 group-hover:text-navy-light transition-colors duration-200">
                      {svc.title}
                    </h3>

                    {/* Target Audience Badge */}
                    <p className="text-xs text-mid-grey mb-5">
                      <span className="font-bold text-navy">Best for:</span> {svc.target}
                    </p>

                    {/* Description */}
                    <p className="body-sm text-[0.85rem] leading-relaxed text-[#4A5568] mb-6">
                      {svc.description}
                    </p>

                    {/* Features list */}
                    <div className="border-t border-[#F0F0EE] pt-6 mb-8">
                      <p className="font-mono text-[0.65rem] font-bold text-mid-grey tracking-wider uppercase mb-3.5">
                        What you get:
                      </p>
                      <ul className="space-y-2.5">
                        {svc.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2.5 text-[0.8rem] text-navy/95 font-medium leading-tight">
                            <CheckCircle2 className="w-4.5 h-4.5 text-gold-dark flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Link */}
                  <Link
                    to="/contact"
                    data-cursor="get quote"
                    className="btn-outline w-full justify-center group-hover:bg-gold group-hover:text-navy group-hover:border-gold transition-all duration-300 py-3"
                  >
                    <span>Get started on this package</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  {/* Subtle index mark */}
                  <span className="absolute bottom-6 right-8 font-mono text-[4rem] font-black text-[#E5E7EB]/20 leading-none select-none group-hover:text-gold/10 transition-colors duration-300 pointer-events-none">
                    {svc.num}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── Custom/Other projects CTA ── */}
          <div className="reveal mt-16 pt-12 border-t border-[#E5E7EB] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-bold text-xl text-navy mb-1.5">
                Need a custom web application or system?
              </h3>
              <p className="body-sm text-[#4A5568]">We also build custom system portals, enrollment platforms, and API databases. Let's discuss your custom project.</p>
            </div>
            <Link to="/contact" data-cursor="talk" className="btn-primary flex-shrink-0">
              Discuss custom project <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>
  );
}
