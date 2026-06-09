"use client";

import { useState, useRef, useEffect } from "react";
import { useBuilderStore } from "@/store/builder";
import { streamFromAPI } from "@/lib/sandbox";
import GuideDrawer from "@/components/guide/GuideDrawer";

export default function ChatPanel() {
  const [input, setInput] = useState("");
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    html,
    messages,
    isGenerating,
    setHtml,
    addMessage,
    updateLastMessage,
    setIsGenerating,
  } = useBuilderStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const prompt = input.trim();
    setInput("");
    addMessage({ role: "user", content: prompt });
    addMessage({ role: "assistant", content: "..." });
    setIsGenerating(true);

    // Exclude the current in-progress pair (last 2 messages just added)
    const history = messages.slice(0, -2).map((m) => ({ role: m.role, content: m.content }));

    let accumulated = "";
    try {
      await streamFromAPI(prompt, html, "generate", null, (chunk) => {
        accumulated += chunk;
      }, history);

      if (!accumulated.trim()) {
        updateLastMessage("La IA devolvió una respuesta vacía. Intentá de nuevo.");
        return;
      }

      setHtml(accumulated, true);
      updateLastMessage("Listo. Hacé click en cualquier elemento para modificarlo.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      updateLastMessage(`Error: ${msg}`);
      console.error("[ChatPanel]", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border flex-shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span className="text-xs font-medium text-text-muted">Claude Sonnet</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center space-y-3 pt-8 px-2">
            <p className="text-text-muted text-sm leading-relaxed">
              Describí la página que querés crear.
            </p>
            <div className="space-y-1.5">
              {[
                "Landing con partículas 3D y título animado",
                "Portfolio oscuro con scroll reveal",
                "Página artística con geometría WebGL",
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => setInput(example)}
                  className="w-full text-left text-xs text-text-muted px-3 py-2 rounded-lg bg-surface-2 border border-border hover:border-accent hover:text-text transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[88%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-accent text-white rounded-br-sm"
                  : "bg-surface-2 text-text border border-border rounded-bl-sm"
              }`}
            >
              {msg.content === "..." ? (
                <span className="flex gap-1 py-0.5">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </span>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Vocabulary drawer */}
      <GuideDrawer
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onInsert={(text) => setInput((prev) => (prev ? `${prev} ${text}` : text))}
      />

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-border flex-shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent);
              }
            }}
            placeholder="Describí tu página... (Enter para enviar)"
            disabled={isGenerating}
            rows={2}
            className="flex-1 bg-surface-2 border border-border rounded-lg px-3 py-2 text-xs text-text placeholder-text-muted resize-none focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
          />
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsGuideOpen((o) => !o)}
              title="Vocabulario de prompts"
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors flex items-center justify-center border ${
                isGuideOpen
                  ? "bg-accent/15 text-accent border-accent/30"
                  : "bg-surface-2 text-text-muted hover:text-text border-border"
              }`}
            >
              ?
            </button>
            <button
              type="submit"
              disabled={isGenerating || !input.trim()}
              className="w-8 h-8 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isGenerating ? (
                <svg className="w-3.5 h-3.5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
