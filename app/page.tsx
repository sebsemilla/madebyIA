"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { Project } from "@/types";
import { getProjects, createNewProject, saveProject } from "@/lib/projects";

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProjects(getProjects());
    setMounted(true);
  }, []);

  const handleNewProject = () => {
    const p = createNewProject();
    saveProject(p);
    router.push(`/builder?project=${p.id}`);
  };

  const handleDeleted = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleRenamed = (id: string, name: string) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  return (
    <main className="min-h-screen bg-surface overflow-auto">
      {/* Subtle grid */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#7c3aed 1px, transparent 1px), linear-gradient(90deg, #7c3aed 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-text">
              Web<span className="text-accent">Craft</span>
              <span className="text-text-muted font-light"> AI</span>
            </h1>
            <p className="text-text-muted text-sm mt-1">Tus proyectos</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/guide"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-text-muted hover:text-text hover:bg-surface-1 border border-border transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Guía de prompts
            </Link>
            <button
              onClick={handleNewProject}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo proyecto
            </button>
          </div>
        </div>

        {!mounted ? null : projects.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-surface-2 border border-border flex items-center justify-center">
              <span className="text-3xl text-surface-3">◈</span>
            </div>
            <div className="text-center space-y-2">
              <p className="text-text font-medium">No hay proyectos aún</p>
              <p className="text-text-muted text-sm">Creá tu primer página con IA</p>
            </div>
            <button
              onClick={handleNewProject}
              className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
            >
              Crear primer proyecto →
            </button>
          </div>
        ) : (
          /* Projects grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* New project card */}
            <button
              onClick={handleNewProject}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border hover:border-accent/50 hover:bg-surface-1 transition-all text-text-muted hover:text-accent"
              style={{ height: "220px" }}
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs font-medium">Nuevo proyecto</span>
            </button>

            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onDeleted={handleDeleted}
                onRenamed={handleRenamed}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
