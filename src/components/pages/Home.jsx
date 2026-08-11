import React from 'react';
import Hero from './Hero';
import About from './About';
import Services from './Services';
import Projects from './Projects';
import Process from './Process';
import Pricing from './Pricing';
import Testimonials from './Testimonials';
import Team from './Team';
import FAQ from './FAQ';
import Contact from './Contact';

export default function Home() {
  return (
    <>
      <div id="home">
        <Hero />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="services">
        <Services />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="faq">
        <FAQ />
      </div>
    </>
  );
}
