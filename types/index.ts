export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface SelectedArea {
  html: string;
  selector: string;
  rect: { x: number; y: number; width: number; height: number };
}

export type ViewportSize = "desktop" | "tablet" | "mobile";

export interface Project {
  id: string;
  name: string;
  html: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface BuilderState {
  html: string;
  history: string[];
  historyIndex: number;
  messages: Message[];
  selectedArea: SelectedArea | null;
  isPanelOpen: boolean;
  isAreaPanelOpen: boolean;
  isCodePanelOpen: boolean;
  isGenerating: boolean;
  viewportSize: ViewportSize;
  projectId: string | null;
  projectName: string;
  saveStatus: "saved" | "saving" | "unsaved";

  setHtml: (html: string, snapshot?: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  addMessage: (msg: Omit<Message, "id" | "timestamp">) => void;
  updateLastMessage: (content: string) => void;

  setSelectedArea: (area: SelectedArea | null) => void;
  setIsPanelOpen: (open: boolean) => void;
  setIsAreaPanelOpen: (open: boolean) => void;
  setIsCodePanelOpen: (open: boolean) => void;
  setIsGenerating: (generating: boolean) => void;
  setViewportSize: (size: ViewportSize) => void;
  setProjectId: (id: string | null) => void;
  setProjectName: (name: string) => void;
  setSaveStatus: (status: "saved" | "saving" | "unsaved") => void;
  loadProject: (project: Project) => void;
  reset: () => void;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  prompt: string;
}

export interface AnimationPreset {
  id: string;
  label: string;
  prompt: string;
}

export interface AnimationCategory {
  id: string;
  name: string;
  icon: string;
  presets: AnimationPreset[];
}
