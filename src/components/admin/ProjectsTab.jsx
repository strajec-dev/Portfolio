import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus } from 'lucide-react';

export default function ProjectsTab() {
  const { backendUrl } = useOutletContext();
  const [projects, setProjects]             = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const doFetch = () => fetchProjects();
    window.addEventListener('admin-refresh', doFetch);
    fetchProjects();
    return () => window.removeEventListener('admin-refresh', doFetch);
  }, []);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await fetch(`${backendUrl}/api/projects/`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.results || data);
      }
    } catch (err) {
      console.error('Error fetching projects', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  return (
    <>
      <Helmet><title>Projects | Strajec Admin</title></Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#6B7280]">Projects currently shown on your portfolio website</p>
          <a
            href={`${backendUrl}/admin/projects/project/add/`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Project
          </a>
        </div>

        {/* Content */}
        {loadingProjects ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#E5E7EB] rounded-2xl text-sm text-[#6B7280]">
            No projects found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} className="w-full h-40 object-cover border-b border-[#E5E7EB]" />
                  ) : (
                    <div className="w-full h-40 bg-slate-100 flex items-center justify-center border-b border-[#E5E7EB] text-xs text-[#9CA3AF]">
                      No Image Available
                    </div>
                  )}
                  <div className="p-5 space-y-3">
                    <h4 className="font-bold text-navy text-base">{project.title}</h4>
                    <p className="text-xs text-[#6B7280] line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tech_stack?.map((tech) => (
                        <span key={tech} className="bg-slate-100 text-[#4B5563] text-[0.65rem] px-2 py-0.5 rounded font-medium">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-5 pt-0 border-t border-[#F3F4F6] mt-4 flex items-center justify-between">
                  <span className={`text-[0.65rem] font-bold px-2.5 py-1 rounded-full ${project.is_featured ? 'bg-gold/25 text-navy' : 'bg-slate-100 text-[#6B7280]'}`}>
                    {project.is_featured ? '★ Featured' : 'Standard'}
                  </span>
                  <a
                    href={`${backendUrl}/admin/projects/project/${project.id}/change/`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-navy hover:underline"
                  >
                    Edit details →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
