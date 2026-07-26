import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Github, Linkedin, Mail } from 'lucide-react';
import christianImg from '../image/christian.jpg';
import juneImg      from '../image/june.jpg';
import florenceImg  from '../image/florence.jpg';
import regilImg     from '../image/regil.jpg';

const members = [
  {
    name: 'Florence Cris Solayao',
    bio: 'Focuses on backend systems, database architecture, and building secure server APIs.',
    photo: florenceImg,
    github:   'https://github.com',
    linkedin: 'https://linkedin.com',
    email:    'mailto:florence@strajec.dev',
  },
  {
    name: 'Christian John Teofilo',
    bio: 'Handles server hosting setup, database deployments, and maintaining code versioning repositories.',
    photo: christianImg,
    github:   'https://github.com',
    linkedin: 'https://linkedin.com',
    email:    'mailto:christian@strajec.dev',
  },
  {
    name: 'Regil Tagalogon',
    bio: 'Enjoys coding dynamic page layouts and bridging backend APIs with user-friendly web features.',
    photo: regilImg,
    github:   'https://github.com',
    linkedin: 'https://linkedin.com',
    email:    'mailto:regil@strajec.dev',
  },
  {
    name: 'June Dominic Laurente',
    bio: 'Works on interactive layout elements, custom page animations, and mobile-friendly responsiveness.',
    photo: juneImg,
    github:   'https://github.com',
    linkedin: 'https://linkedin.com',
    email:    'mailto:june@strajec.dev',
  },
  {
    name: 'John Rey Siman',
    bio: 'Designs beautiful visual layouts, creates mockups, and ensures the website matches what clients want.',
    photo: null,
    github:   'https://github.com',
    linkedin: 'https://linkedin.com',
    email:    'mailto:johnrey@strajec.dev',
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

export default function Team() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <>
      <Helmet>
        <title>Our Team | Strajec — Web Developers in Caraga</title>
        <meta name="description" content="Meet the Strajec team — five friends and BSIT graduates building websites in Caraga, Philippines." />
      </Helmet>

      <section id="team" ref={ref} className="section-block bg-off-white">
        <div className="container-wide">

          {/* ── Header ── */}
          <div className="reveal mb-16 pb-8 border-b border-[#E5E7EB]">
            <p className="section-label mb-4">The team</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <h2 className="h2 text-navy">Meet the friends</h2>
              <p className="body-sm max-w-sm">
                A group of five friends and BSIT graduates working together to help local businesses.
              </p>
            </div>
          </div>

          {/* ── Team grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {members.map((m, i) => {
              const initials = m.name.split(' ').map(n => n[0]).join('').slice(0, 2);
              return (
                <div key={m.name} className={`reveal reveal-delay-${Math.min(i + 1, 4)} card group flex flex-col overflow-hidden`}>

                  {/* Photo */}
                  <div className="relative aspect-[3/4] bg-off-white overflow-hidden">
                    {m.photo ? (
                      <img
                        src={m.photo}
                        alt={m.name}
                        className="absolute inset-0 w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-500 ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display font-black text-5xl text-navy/15">{initials}</span>
                      </div>
                    )}
                    {/* Gold accent bar on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </div>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-sm text-navy leading-tight mb-3">{m.name}</h3>
                    <p className="body-sm text-[0.72rem] leading-relaxed mb-4 flex-1 line-clamp-3">{m.bio}</p>

                    {/* Social */}
                    <div className="flex items-center gap-2 pt-3 border-t border-[#E5E7EB]">
                      {[
                        { href: m.github,   Icon: Github,   label: 'GitHub' },
                        { href: m.linkedin, Icon: Linkedin, label: 'LinkedIn' },
                        { href: m.email,    Icon: Mail,     label: 'Email' },
                      ].map(({ href, Icon, label }) => (
                        <a
                          key={label}
                          href={href}
                          target={label !== 'Email' ? '_blank' : undefined}
                          rel="noreferrer"
                          data-cursor={label.toLowerCase()}
                          className="w-7 h-7 rounded-md border border-[#E5E7EB] flex items-center justify-center text-mid-grey hover:border-navy hover:text-navy hover:bg-navy/5 transition-all duration-200"
                          aria-label={`${m.name} ${label}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </>
  );
}
