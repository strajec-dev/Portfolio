import React, { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const reviews = [
  {
    name: 'Marites Calo',
    business: 'Butuan Coffee Grind',
    text: 'Strajec built our online ordering portal in under two weeks. Mobile orders increased by 40% immediately. They explain technical terms in plain English — working with them was effortless.',
    initials: 'MC',
  },
  {
    name: 'Engr. Junel Coro',
    business: 'Caraga Logistical Solutions',
    text: 'An extremely professional team. They configured our fleet dashboard and client inventory database with absolute precision. Direct communication, no delays, local support.',
    initials: 'JC',
  },
  {
    name: 'Dr. Sandra Lim',
    business: 'Lim Dental Clinic Surigao',
    text: 'The automated scheduling system saved my receptionist hours of phone calls. Patients find it incredibly easy to book slots on their mobile. Highly recommended.',
    initials: 'SL',
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  useReveal(ref, { threshold: 0.08 });

  return (
      <section id="testimonials" ref={ref} className="section-block bg-snow">
        <div className="container-wide">

          {/* ── Header ── */}
          <div className="reveal mb-16 pb-8 border-b border-[#E5E7EB]">
            <p className="section-label mb-4">Client stories</p>
            <h2 className="h2 text-navy">What clients say</h2>
          </div>

          {/* ── Reviews ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {reviews.map((rev, i) => (
              <div
                key={rev.name}
                className={`reveal reveal-delay-${Math.min(i + 1, 3)} card p-8 flex flex-col`}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="flex-1 text-[#3D4451] text-sm leading-[1.8] mb-8">
                  "{rev.text}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-6 border-t border-[#E5E7EB]">
                  <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-black text-[0.65rem] text-white">{rev.initials}</span>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-navy leading-none mb-0.5">{rev.name}</p>
                    <p className="section-index">{rev.business}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
  );
}
