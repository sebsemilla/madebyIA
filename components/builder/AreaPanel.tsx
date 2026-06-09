"use client";

import { useState } from "react";
import { useBuilderStore } from "@/store/builder";
import { streamFromAPI } from "@/lib/sandbox";

export default function AreaPanel() {
  const [input, setInput] = useState("");
  const {
    html,
    selectedArea,
    isGenerating,
    isAreaPanelOpen,
    setHtml,
    setSelectedArea,
    setIsAreaPanelOpen,
    setIsGenerating,
  } = useBuilderStore();
  const setHtmlWithSnapshot = (h: string) => setHtml(h, true);

  if (!isAreaPanelOpen || !selectedArea) return null;

  const handleClose = () => {
    setIsAreaPanelOpen(false);
    setSelectedArea(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const prompt = input.trim();
    setInput("");
    setIsGenerating(true);

    try {
      let accumulated = "";
      const modifiedHtml = await streamFromAPI(
        prompt,
        html,
        "area",
        selectedArea.html,
        (chunk) => {
          accumulated += chunk;
        }
      );

      // Replace the selected element in the full HTML and snapshot to history
      if (modifiedHtml && html) {
        const updated = html.replace(selectedArea.html, modifiedHtml);
        setHtmlWithSnapshot(updated !== html ? updated : html);
      }

      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const truncatedHtml = selectedArea.html.length > 80
    ? selectedArea.html.slice(0, 80) + "..."
    : selectedArea.html;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[480px] max-w-[90vw] glass rounded-2xl shadow-2xl z-50 border border-accent/30">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-sm font-medium text-text">Modificar elemento</span>
        </div>
        <button
          onClick={handleClose}
          className="text-text-muted hover:text-text transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Selected element preview */}
      <div className="px-4 py-2 bg-surface-2 border-b border-border">
        <p className="text-xs text-text-muted font-mono truncate">{truncatedHtml}</p>
      </div>

      {/* Quick actions */}
      <div className="px-4 pt-3 flex flex-wrap gap-2">
        {[
          "Animar entrada con GSAP",
          "Efecto hover creativo",
          "Cambiar colores",
          "Agregar texto animado",
          "Efecto 3D con Three.js",
        ].map((action) => (
          <button
            key={action}
            onClick={() => setInput(action)}
            className="text-xs px-2.5 py-1 rounded-full bg-surface-2 border border-border text-text-muted hover:border-accent hover:text-text transition-colors"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 pt-2 flex gap-2 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
            }
          }}
          placeholder="¿Qué querés hacer con este elemento?"
          disabled={isGenerating}
          rows={2}
          autoFocus
          className="flex-1 bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-text-muted resize-none focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isGenerating || !input.trim()}
          className="w-9 h-9 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center flex-shrink-0"
        >
          {isGenerating ? (
            <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
