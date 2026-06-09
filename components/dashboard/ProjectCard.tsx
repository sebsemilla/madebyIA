"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/types";
import { deleteProject, renameProject, formatDate } from "@/lib/projects";

interface Props {
  project: Project;
  onDeleted: (id: string) => void;
  onRenamed: (id: string, name: string) => void;
}

export default function ProjectCard({ project, onDeleted, onRenamed }: Props) {
  const router = useRouter();
  const [isRenaming, setIsRenaming] = useState(false);
  const [nameInput, setNameInput] = useState(project.name);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    router.push(`/builder?project=${project.id}`);
  };

  const handleRenameCommit = () => {
    const name = nameInput.trim() || "Sin título";
    renameProject(project.id, name);
    onRenamed(project.id, name);
    setIsRenaming(false);
  };

  const handleDelete = () => {
    deleteProject(project.id);
    onDeleted(project.id);
    setMenuOpen(false);
  };

  const hasContent = Boolean(project.html);

  return (
    <div className="group relative flex flex-col rounded-2xl bg-surface-1 border border-border hover:border-accent/40 transition-all overflow-hidden">
      {/* Mini preview */}
      <div
        className="relative w-full bg-[#050505] cursor-pointer overflow-hidden"
        style={{ height: "160px" }}
        onClick={handleOpen}
      >
        {hasContent ? (
          <iframe
            srcDoc={project.html}
            sandbox="allow-scripts"
            className="absolute top-0 left-0 pointer-events-none border-0"
            style={{
              width: "1280px",
              height: "800px",
              transform: "scale(0.2)",
              transformOrigin: "0 0",
            }}
            title={project.name}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl text-surface-3">◈</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="text-xs text-white font-medium px-3 py-1.5 rounded-full bg-accent">
            Abrir
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center justify-between px-3 py-2.5 gap-2">
        <div className="min-w-0 flex-1">
          {isRenaming ? (
            <input
              ref={inputRef}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleRenameCommit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameCommit();
                if (e.key === "Escape") { setNameInput(project.name); setIsRenaming(false); }
              }}
              autoFocus
              className="w-full text-sm font-medium text-text bg-surface-2 border border-accent rounded px-1.5 py-0.5 focus:outline-none"
            />
          ) : (
            <p
              className="text-sm font-medium text-text truncate cursor-pointer hover:text-accent transition-colors"
              onClick={() => { setIsRenaming(true); setTimeout(() => inputRef.current?.select(), 10); }}
            >
              {project.name}
            </p>
          )}
          <p className="text-xs text-text-muted mt-0.5">{formatDate(project.updatedAt)}</p>
        </div>

        {/* Menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted hover:text-text hover:bg-surface-2 transition-colors opacity-0 group-hover:opacity-100"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 bottom-full mb-1 w-36 bg-surface-2 border border-border rounded-xl shadow-xl z-20 overflow-hidden">
                <button
                  onClick={() => { setIsRenaming(true); setMenuOpen(false); setTimeout(() => inputRef.current?.select(), 10); }}
                  className="w-full text-left px-3 py-2 text-xs text-text hover:bg-surface-3 transition-colors"
                >
                  Renombrar
                </button>
                <button
                  onClick={handleOpen}
                  className="w-full text-left px-3 py-2 text-xs text-text hover:bg-surface-3 transition-colors"
                >
                  Abrir
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-surface-3 transition-colors border-t border-border"
                >
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
