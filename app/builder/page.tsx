"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Canvas from "@/components/builder/Canvas";
import ChatPanel from "@/components/chat/ChatPanel";
import AreaPanel from "@/components/builder/AreaPanel";
import Toolbar from "@/components/builder/Toolbar";
import CodePanel from "@/components/builder/CodePanel";
import AnimationPanel from "@/components/builder/AnimationPanel";
import ComponentSnippets from "@/components/builder/ComponentSnippets";
import TemplateGallery from "@/components/templates/TemplateGallery";
import { useBuilderStore } from "@/store/builder";
import { getProject, createNewProject, saveProject, buildProjectSnapshot } from "@/lib/projects";

type Tab = "chat" | "templates" | "components" | "animate";

const AUTO_SAVE_DELAY = 1500;

function BuilderContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");
  const [tab, setTab] = useState<Tab>("chat");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    html, messages, projectName, saveStatus,
    undo, redo, canUndo, canRedo,
    loadProject, reset, setSaveStatus, setProjectId,
  } = useBuilderStore();

  // Load or create project on mount
  useEffect(() => {
    if (!projectId) { reset(); return; }
    const existing = getProject(projectId);
    if (existing) {
      loadProject(existing);
    } else {
      const fresh = createNewProject();
      fresh.id = projectId;
      saveProject(fresh);
      loadProject(fresh);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // Auto-save with debounce
  useEffect(() => {
    if (!projectId || !html) return;
    setSaveStatus("unsaved");

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSaveStatus("saving");
      const snapshot = buildProjectSnapshot(projectId, projectName, html, messages);
      saveProject(snapshot);
      setSaveStatus("saved");
    }, AUTO_SAVE_DELAY);

    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, projectName]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        if (canRedo()) redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, canUndo, canRedo]);

  const TABS: { id: Tab; label: string }[] = [
    { id: "chat", label: "Chat" },
    { id: "templates", label: "Templates" },
    { id: "components", label: "Bloques" },
    { id: "animate", label: "Animar" },
  ];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-surface">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 flex flex-col bg-surface-1 border-r border-border">
          <div className="flex border-b border-border flex-shrink-0">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                  tab === t.id
                    ? "text-accent border-b-2 border-accent"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden">
            {tab === "chat" && <ChatPanel />}
            {tab === "templates" && (
              <div className="h-full overflow-y-auto"><TemplateGallery /></div>
            )}
            {tab === "components" && <ComponentSnippets />}
            {tab === "animate" && <AnimationPanel />}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <Canvas />
          <AreaPanel />
        </div>

        {/* Code panel */}
        <CodePanel />
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-surface">
        <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
