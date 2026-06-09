"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBuilderStore } from "@/store/builder";
import { ViewportSize } from "@/types";
import { renameProject } from "@/lib/projects";
import type { ReactElement } from "react";

const VIEWPORTS: { id: ViewportSize; label: string; icon: ReactElement }[] = [
  {
    id: "desktop",
    label: "Desktop",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "tablet",
    label: "Tablet",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const SAVE_LABELS = {
  saved: "Guardado",
  saving: "Guardando...",
  unsaved: "Sin guardar",
};

export default function Toolbar() {
  const router = useRouter();
  const [isRenaming, setIsRenaming] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    html, canUndo, canRedo, undo, redo,
    isCodePanelOpen, setIsCodePanelOpen,
    viewportSize, setViewportSize,
    projectId, projectName, setProjectName,
    saveStatus, reset,
  } = useBuilderStore();

  const startRename = () => {
    setNameInput(projectName);
    setIsRenaming(true);
    setTimeout(() => inputRef.current?.select(), 10);
  };

  const commitRename = () => {
    const name = nameInput.trim() || "Sin título";
    setProjectName(name);
    if (projectId) renameProject(projectId, name);
    setIsRenaming(false);
  };

  const handleExport = () => {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNewProject = () => {
    reset();
    router.push("/");
  };

  return (
    <div className="flex items-center justify-between px-4 h-11 bg-surface-1 border-b border-border flex-shrink-0 gap-3">
      {/* Left: logo + project name */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Link href="/" className="text-sm font-semibold text-text hover:text-accent transition-colors flex-shrink-0">
          Web<span className="text-accent">Craft</span>
        </Link>

        <span className="text-border flex-shrink-0">›</span>

        {isRenaming ? (
          <input
            ref={inputRef}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") setIsRenaming(false);
            }}
            className="text-sm font-medium text-text bg-surface-2 border border-accent rounded px-2 py-0.5 focus:outline-none min-w-0 w-40"
          />
        ) : (
          <button
            onClick={startRename}
            className="text-sm font-medium text-text hover:text-accent transition-colors truncate max-w-48 text-left"
            title="Click para renombrar"
          >
            {projectName}
          </button>
        )}

        {/* Save status */}
        <span className={`text-xs flex-shrink-0 transition-colors ${
          saveStatus === "saved" ? "text-surface-3" :
          saveStatus === "saving" ? "text-text-muted animate-pulse" :
          "text-text-muted"
        }`}>
          {SAVE_LABELS[saveStatus]}
        </span>
      </div>

      {/* Center: undo/redo + viewport */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-0.5">
          <button onClick={undo} disabled={!canUndo()} title="Deshacer (Ctrl+Z)"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          <button onClick={redo} disabled={!canRedo()} title="Rehacer (Ctrl+Y)"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
            </svg>
          </button>
        </div>

        <div className="w-px h-5 bg-border" />

        <div className="flex items-center gap-0.5 bg-surface-2 rounded-lg p-0.5 border border-border">
          {VIEWPORTS.map((v) => (
            <button key={v.id} onClick={() => setViewportSize(v.id)} title={v.label}
              className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${
                viewportSize === v.id ? "bg-accent text-white" : "text-text-muted hover:text-text"
              }`}>
              {v.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Right: code + export + back */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => setIsCodePanelOpen(!isCodePanelOpen)}
          title="Ver código"
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-colors border ${
            isCodePanelOpen
              ? "bg-accent/15 text-accent border-accent/30"
              : "bg-surface-2 text-text-muted hover:text-text border-border"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>

        <button
          onClick={handleExport}
          disabled={!html}
          title="Exportar HTML"
          className="flex items-center gap-1.5 px-3 h-7 rounded-lg text-xs font-medium bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar
        </button>

        <button
          onClick={handleNewProject}
          title="Volver al dashboard"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
