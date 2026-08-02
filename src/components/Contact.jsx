import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Send, CheckCircle2, Facebook, Github, Linkedin, AlertCircle, Instagram, Mail, Phone, MapPin } from 'lucide-react';


const socials = [
  { Icon: Facebook,  href: 'https://www.facebook.com/profile.php?id=61591696464731', label: 'Facebook' },
  { Icon: Instagram, href: 'https://www.instagram.com/magnet.solutionsph/', label: 'Instagram' },
  { Icon: Github,    href: 'https://github.com', label: 'GitHub' },
  { Icon: Linkedin,  href: 'https://linkedin.com', label: 'LinkedIn' },
];

const field = `w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-navy text-sm
  placeholder:text-mid-grey/60 focus:outline-none focus:border-navy focus:ring-2
  focus:ring-navy/10 transition-all duration-200`;

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

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', budget: '', desc: '' });
  const [errors,    setErrors]  = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]  = useState(false);
  const ref = useRef(null);
  useReveal(ref);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())  e.name = 'Name is required.';
    if (!formData.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email format.';
    if (!formData.budget.trim()) e.budget = 'Please specify your budget.';
    if (!formData.desc.trim())  e.desc = 'Please describe your project.';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('https://formsubmit.co/ajax/magnet.solutionsph@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', budget: '', desc: '' });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact | Strajec — Digital Studio Philippines</title>
        <meta name="description" content="Start a project with Strajec. Get a tailored proposal within 24 hours." />
      </Helmet>

      <section id="contact" ref={ref} className="section-block bg-snow">
        <div className="container-wide">

          {/* ── Header ── */}
          <div className="reveal mb-16 pb-8 border-b border-[#E5E7EB]">
            <p className="section-label mb-4">Get in touch</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <h2 className="h2 text-navy">Start a project</h2>
              <p className="body-sm max-w-xs">We respond within 24 hours<br />with a tailored proposal.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 lg:gap-20">

            {/* ── Left: contact info ── */}
            <div className="reveal space-y-8">
              {[
                { Icon: Mail,   label: 'Email', value: 'magnet.solutionsph@gmail.com', href: 'mailto:magnet.solutionsph@gmail.com' },
                { Icon: Phone,  label: 'Phone', value: '+63 994 100 6573', href: 'tel:+639941006573' },
                { Icon: MapPin, label: 'Base',  value: 'Magallanes, Agusan del Norte, Caraga, Philippines', href: null },
              ].map(({ Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-off-white border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-navy" />
                  </div>
                  <div>
                    <p className="section-index mb-1">{label}</p>
                    {href
                      ? <a href={href} className="text-navy text-sm font-semibold hover:text-navy-light transition-colors">{value}</a>
                      : <p className="text-navy text-sm font-semibold">{value}</p>
                    }
                  </div>
                </div>
              ))}

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] h-44">
                <iframe
                  title="Strajec map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31545.034563833446!2d125.50346067431637!3d9.018974599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3301c2db579e0f63%3A0xe5a2ab3fb47b19a3!2sMagallanes%2C%20Agusan%20del%20Norte!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph"
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Socials */}
              <div>
                <p className="section-index mb-3">Follow us</p>
                <div className="flex gap-2">
                  {socials.map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor={label.toLowerCase()}
                      className="w-9 h-9 rounded-xl border border-[#E5E7EB] flex items-center justify-center text-mid-grey hover:border-navy hover:text-navy hover:bg-navy/5 transition-all duration-200"
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: form ── */}
            <div className="reveal reveal-delay-1 relative">
              {/* Success overlay */}
              {submitted && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center rounded-2xl border border-[#E5E7EB]">
                  <CheckCircle2 className="w-14 h-14 text-navy mb-4" strokeWidth={1.5} />
                  <h4 className="font-display font-bold text-xl text-navy mb-2">Message sent!</h4>
                  <p className="body-sm max-w-xs">Thank you. We'll respond within 24 hours with a tailored proposal.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Name */}
                  <div>
                    <label className="section-index block mb-2">Full Name *</label>
                    <input type="text" id="contact-name" name="name" value={formData.name} onChange={handleChange} placeholder="Juan dela Cruz" className={field} />
                    {errors.name && <p className="text-[0.72rem] text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="section-index block mb-2">Email Address *</label>
                    <input type="email" id="contact-email" name="email" value={formData.email} onChange={handleChange} placeholder="juan@example.ph" className={field} />
                    {errors.email && <p className="text-[0.72rem] text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="section-index block mb-2">Phone (optional)</label>
                    <input type="tel" id="contact-phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="0912 345 6789" className={field} />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="section-index block mb-2">Estimated Budget *</label>
                    <input type="text" id="contact-budget" name="budget" value={formData.budget} onChange={handleChange} placeholder="e.g. ₱5,000 or custom price" className={field} />
                    {errors.budget && <p className="text-[0.72rem] text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.budget}</p>}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="section-index block mb-2">Project Description *</label>
                  <textarea id="contact-desc" name="desc" rows={5} value={formData.desc} onChange={handleChange} placeholder="Describe the pages, features, or systems you need..." className={`${field} resize-none`} />
                  {errors.desc && <p className="text-[0.72rem] text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.desc}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  id="contact-submit-btn"
                  data-cursor="send"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-4 rounded-xl text-base disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending…
                    </span>
                  ) : (
                    <>
                      Send inquiry
                      <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2} />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
