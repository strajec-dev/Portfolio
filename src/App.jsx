import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MagneticCursor from './components/layout/CursorAndEffects';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Services from './components/pages/Services';
import Team from './components/pages/Team';
import Projects from './components/pages/Projects';
import Process from './components/pages/Process';
import Testimonials from './components/pages/Testimonials';
import FAQ from './components/pages/FAQ';
import Contact from './components/pages/Contact';
import NotFound from './components/pages/NotFound';
import Login from './components/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import LeadsTab from './components/admin/LeadsTab';
import ProjectsTab from './components/admin/ProjectsTab';
import ProtectedRoute from './components/admin/ProtectedRoute';

export default function App() {
  return (
    <>
      {/* Global cursor — rendered on all pages */}
      <MagneticCursor />

      <Routes>
        {/* Public Pages with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/team" element={<Team />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/process" element={<Process />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin Auth Route */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Portal */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/leads" element={<LeadsTab />} />
            <Route path="/admin/projects" element={<ProjectsTab />} />
          </Route>
        </Route>

        {/* Catch-all — rendered outside Layout (no header/footer) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
