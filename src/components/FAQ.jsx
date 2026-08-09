import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

const faqs = [
  {
    q: 'How long does it take to build a website?',
    a: 'Typically 1–3 weeks depending on complexity. A simple landing page takes 5–7 days; a full e-commerce system or custom web portal takes 3–4 weeks.',
  },
  {
    q: 'How much does a website cost?',
    a: 'Our packages start as low as ₱5,000. We are very budget-friendly and always open to discussing prices to find a solution that works for your business.',
  },
  {
    q: 'Do you offer payment in installments?',
    a: 'We typically require a 50% downpayment to commence work, with the remaining 50% due upon completion. However, we also offer flexible options with downpayments as low as 30% for a hassle-free experience.',
  },
  {
    q: 'Will my website work on mobile?',
    a: 'All websites are fully mobile responsive — we verify layouts across mobile, tablet, and desktop before handover. If you want a dedicated mobile app, we also build those using Flutter!',
  },
  {
    q: 'Do you provide website maintenance?',
    a: 'Yes. We offer custom monthly maintenance plans tailored to your needs, covering backups, security audits, software updates, and minor content edits.',
  },
  {
    q: 'Is the domain name included?',
    a: 'Domain registration is not included. You purchase via GoDaddy or Namecheap — we assist with setup and configuration at no additional cost.',
  },
];


export default function FAQ() {
  const [open, setOpen] = useState(null);
  const ref = useRef(null);
  useReveal(ref, { threshold: 0.05 });

  return (

      <section id="faq" ref={ref} className="section-block bg-off-white">
        <div className="container-wide">

          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-16 lg:gap-24">

            {/* Left column — sticky heading */}
            <div className="reveal">
              <p className="section-label mb-4">Questions?</p>
              <h2 className="h2 text-navy mb-6">
                Frequently<br />asked.
              </h2>
              <p className="body-sm mb-8">
                Quick answers to common questions. Still unsure? Reach out directly.
              </p>
              <Link to="/contact" data-cursor="ask" className="btn-primary text-sm py-3 px-6">
                Ask us directly →
              </Link>
            </div>

            {/* Right column — accordion */}
            <div className="reveal reveal-delay-1 divide-y divide-[#E5E7EB]">
              {faqs.map((faq, i) => {
                const isOpen = open === i;
                return (
                  <div key={i}>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full py-6 flex items-start justify-between gap-6 text-left group"
                      aria-expanded={isOpen}
                    >
                      <span className={`font-display font-semibold text-base transition-colors duration-200 ${
                        isOpen ? 'text-navy' : 'text-[#1E2A3B] group-hover:text-navy'
                      }`}>
                        {faq.q}
                      </span>
                      <div className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200 ${
                        isOpen
                          ? 'border-navy bg-navy text-white'
                          : 'border-[#E5E7EB] text-mid-grey group-hover:border-navy group-hover:text-navy'
                      }`}>
                        {isOpen
                          ? <Minus className="w-3 h-3" strokeWidth={2.5} />
                          : <Plus  className="w-3 h-3" strokeWidth={2.5} />
                        }
                      </div>
                    </button>

                    <div className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}>
                      <div className="overflow-hidden">
                        <p className="pb-6 body-sm leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>
  );
}
