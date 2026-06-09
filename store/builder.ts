"use client";

import { create } from "zustand";
import { BuilderState, Message, Project, SelectedArea, ViewportSize } from "@/types";

const MAX_HISTORY = 50;

export const useBuilderStore = create<BuilderState>((set, get) => ({
  html: "",
  history: [],
  historyIndex: -1,
  messages: [],
  selectedArea: null,
  isPanelOpen: true,
  isAreaPanelOpen: false,
  isCodePanelOpen: false,
  isGenerating: false,
  viewportSize: "desktop" as ViewportSize,
  projectId: null,
  projectName: "Sin título",
  saveStatus: "saved" as const,

  setHtml: (html, snapshot = false) =>
    set((state) => {
      if (!snapshot) return { html, saveStatus: "unsaved" as const };
      const trimmed = state.history.slice(0, state.historyIndex + 1);
      const next = [...trimmed, html].slice(-MAX_HISTORY);
      return { html, history: next, historyIndex: next.length - 1, saveStatus: "unsaved" as const };
    }),

  undo: () =>
    set((state) => {
      if (state.historyIndex <= 0) return {};
      const idx = state.historyIndex - 1;
      return { html: state.history[idx], historyIndex: idx, saveStatus: "unsaved" as const };
    }),

  redo: () =>
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return {};
      const idx = state.historyIndex + 1;
      return { html: state.history[idx], historyIndex: idx, saveStatus: "unsaved" as const };
    }),

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...msg, id: crypto.randomUUID(), timestamp: new Date() } as Message,
      ],
    })),

  updateLastMessage: (content) =>
    set((state) => {
      const msgs = [...state.messages];
      if (msgs.length === 0) return {};
      msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content };
      return { messages: msgs };
    }),

  setSelectedArea: (area: SelectedArea | null) =>
    set({ selectedArea: area, isAreaPanelOpen: area !== null }),

  setIsPanelOpen: (isPanelOpen) => set({ isPanelOpen }),
  setIsAreaPanelOpen: (isAreaPanelOpen) => set({ isAreaPanelOpen }),
  setIsCodePanelOpen: (isCodePanelOpen) => set({ isCodePanelOpen }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setViewportSize: (viewportSize) => set({ viewportSize }),
  setProjectId: (projectId) => set({ projectId }),
  setProjectName: (projectName) => set({ projectName }),
  setSaveStatus: (saveStatus) => set({ saveStatus }),

  loadProject: (project: Project) =>
    set({
      html: project.html,
      messages: project.messages,
      history: project.html ? [project.html] : [],
      historyIndex: project.html ? 0 : -1,
      projectId: project.id,
      projectName: project.name,
      saveStatus: "saved" as const,
      selectedArea: null,
      isAreaPanelOpen: false,
      isGenerating: false,
    }),

  reset: () =>
    set({
      html: "",
      history: [],
      historyIndex: -1,
      messages: [],
      selectedArea: null,
      isPanelOpen: true,
      isAreaPanelOpen: false,
      isCodePanelOpen: false,
      isGenerating: false,
      viewportSize: "desktop" as ViewportSize,
      projectId: null,
      projectName: "Sin título",
      saveStatus: "saved" as const,
    }),
}));
