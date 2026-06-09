"use client";

import { useState, useEffect } from "react";
import { useBuilderStore } from "@/store/builder";

export default function CodePanel() {
  const { html, isCodePanelOpen, setIsCodePanelOpen, setHtml } =
    useBuilderStore();
  const [draft, setDraft] = useState(html);
  const [isDirty, setIsDirty] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDraft(html);
    setIsDirty(false);
  }, [html]);

  if (!isCodePanelOpen) return null;

  const handleApply = () => {
    setHtml(draft, true);
    setIsDirty(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const lineCount = draft.split("\n").length;

  return (
    <div className="flex flex-col w-[420px] flex-shrink-0 bg-surface-1 border-l border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text">HTML</span>
          <span className="text-xs text-text-muted font-mono">{lineCount} líneas</span>
          {isDirty && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-accent/20 text-accent border border-accent/30">
              editado
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="text-xs px-2.5 h-6 rounded-md bg-surface-2 border border-border text-text-muted hover:text-text transition-colors"
          >
            {copied ? "Copiado!" : "Copiar"}
          </button>
          {isDirty && (
            <button
              onClick={handleApply}
              className="text-xs px-2.5 h-6 rounded-md bg-accent hover:bg-accent-hover text-white transition-colors"
            >
              Aplicar
            </button>
          )}
          <button
            onClick={() => setIsCodePanelOpen(false)}
            className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-text transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden relative">
        {!html ? (
          <div className="flex items-center justify-center h-full text-text-muted text-sm">
            Genera una página primero
          </div>
        ) : (
          <textarea
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setIsDirty(e.target.value !== html);
            }}
            spellCheck={false}
            className="w-full h-full resize-none bg-transparent text-xs font-mono text-text p-4 focus:outline-none leading-relaxed"
            style={{ tabSize: 2 }}
          />
        )}
      </div>
    </div>
  );
}
